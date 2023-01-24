import algosdk, { SuggestedParams, Transaction, Algodv2, LogicSigAccount, Indexer, makeApplicationCallTxnFromObject, makePaymentTxnWithSuggestedParamsFromObject } from 'algosdk';
import MyAlgoConnect, { SignedTx } from '@randlabs/myalgo-connect';
import { getClient, getIndexer, adminAddr, getSecretKey } from './credentials.ts';

const myAlgoConnect = new MyAlgoConnect();

const client: Algodv2 = getClient();
const indexer: Indexer = getIndexer();
const encoder = new TextEncoder();

let suggestedParams: SuggestedParams;
client.getTransactionParams().do().then(response => {
    suggestedParams = response;
    suggestedParams.flatFee = true;
    suggestedParams.fee = 1000;
});

async function waitForTxn(txnId: string): Promise<Record<string, any>> {
    const status = await client.status().do();
    var lastRound = status['last-round'];
    var pending = await client.pendingTransactionInformation(txnId).do();
    while (!('confirmed-round' in pending && pending['confirmed-round'] > 0)) {
        lastRound += 1;
        await client.statusAfterBlock(lastRound);
        pending = await client.pendingTransactionInformation(txnId).do();
    }

    return pending;
}

async function signTxn(txn: Transaction): Promise<object> {
    const signedTxn: SignedTx = await myAlgoConnect.signTransaction(txn.toByte());
    const response = await client.sendRawTransaction(signedTxn.blob).do();

    const txnInfo = await waitForTxn(signedTxn.txID);
    return txnInfo;
}

export async function signTxns(txns: Transaction[]) {
    const convertedTxns: Uint8Array[] = [];
    txns.forEach(txn => {
        convertedTxns.push(txn.toByte());
    });

    const signedTxns: SignedTx[] = await myAlgoConnect.signTransaction(convertedTxns);
    for (const signedTxn of signedTxns) {
        await client.sendRawTransaction(signedTxn.blob).do();
        await waitForTxn(signedTxn.txID);
    }
}

async function logicSign(txn: Transaction) {
    const signedTxn: Uint8Array = txn.signTxn(getSecretKey());
    const response = await client.sendRawTransaction(signedTxn).do();

    return await waitForTxn(response['txId']);
}

export function pay(sender: string, receiver: string, amount: number | bigint): Transaction {
    const txn = {
        amount: amount,
        from: sender,
        to: receiver,
        suggestedParams: suggestedParams
    }

    const paymentTxn: Transaction = makePaymentTxnWithSuggestedParamsFromObject(txn);
    return paymentTxn;
}

export async function paySign(sender: string, receiver: string, amount: number | bigint, logicSig?: boolean): Promise<Transaction | object> {
    const paymentTxn: Transaction = pay(sender, receiver, amount);

    if (logicSig) {
        return await logicSign(paymentTxn);
    }
    return await signTxn(paymentTxn);
}

async function createASA(creatorAddress: string, unitName: string, assetName: string, total: number, decimals: number, assetUrl: string): Promise<object> {
    const createTxn: Transaction = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: creatorAddress,
        suggestedParams: suggestedParams,
        unitName: unitName,
        assetName: assetName,
        assetURL: assetUrl,
        total: total,
        decimals: decimals,
        manager: creatorAddress,
        reserve: creatorAddress,
        freeze: creatorAddress,
        clawback: creatorAddress,
        defaultFrozen: true,
    });

    return await signTxn(createTxn);
}

export async function createNFT(creatorAddress: string, unitName: string, assetName: string, assetUrl: string): Promise<object> {
    return await createASA(creatorAddress, unitName, assetName, 1, 0, assetUrl);
}

export async function createApplication(approvalProgram: string, clearProgram: string, globalInts: number, globalByteSlices: number, localInts: number, localByteSlices: number, appArgs: Uint8Array[], foreignAssets: number[]): Promise<number> {
    const apBytes: Uint8Array = await compileProgram(approvalProgram);
    const cpBytes: Uint8Array = await compileProgram(clearProgram);

    const txn = {
        from: adminAddr,
        suggestedParams: suggestedParams,
        approvalProgram: apBytes,
        clearProgram: cpBytes,
        numLocalInts: localInts,
        numLocalByteSlices: localByteSlices,
        numGlobalInts: globalInts,
        numGlobalByteSlices: globalByteSlices,
        appArgs: appArgs,
        foreignAssets: foreignAssets,
        onComplete: algosdk.OnApplicationComplete.NoOpOC
    }

    let createTxn: Transaction = algosdk.makeApplicationCreateTxnFromObject(txn);

    const signedTxn = createTxn.signTxn(getSecretKey());
    const response = await client.sendRawTransaction(signedTxn).do();
    
    const txnInfo = await waitForTxn(response['txId']);

    return txnInfo['application-index'];
}

async function compileProgram(source: string): Promise<Uint8Array> {
    const programBytes: Uint8Array = encoder.encode(source);
    const compileResponse = await client.compile(programBytes).do();
    const compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, 'base64'));
    return compiledBytes;
}

export function changeAssetManagement(asset_id: number, currentManagerAddress: string, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, emptyAddressChecking: boolean): Transaction {
    const txn = {
        from: currentManagerAddress,
        assetIndex: asset_id,
        manager: manager,
        reserve: reserve,
        freeze: freeze,
        clawback: clawback,
        suggestedParams: suggestedParams,
        strictEmptyAddressChecking: emptyAddressChecking
    }

    const assetChangeTxn: Transaction = algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject(txn);
    return assetChangeTxn;
}

export async function changeAssetManagementSign(assetId: number, currentManagerAddress: string, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, emptyAddressChecking: boolean): Promise<object> {
    const assetChangeTxn: Transaction = changeAssetManagement(assetId, currentManagerAddress, manager, reserve, freeze, clawback, emptyAddressChecking);
    return await signTxn(assetChangeTxn);
}

export async function escrowProgramToAddress(escrowProgram: string): Promise<string> {
    const account: LogicSigAccount = new LogicSigAccount(await compileProgram(escrowProgram));
    return account.address();
}

export async function getAccountAssets(walletAddress: string): Promise<Array<object>> {
    const assets: Record<string, any> = await indexer.lookupAccountCreatedAssets(walletAddress).do();
    return assets['assets'];
}

export function callApplication(appId: number, callerAddress: string, onComplete: algosdk.OnApplicationComplete, appArgs?: Uint8Array[], foreignAssets?: number[]): Transaction {
    const txn = {
        from: callerAddress,
        suggestedParams: suggestedParams,
        appIndex: appId,
        onComplete: onComplete,
        appArgs: appArgs,
        foreignAssets: foreignAssets,
    };

    const callTxn: Transaction = makeApplicationCallTxnFromObject(txn);
    return callTxn;
}

export async function callApplicationSign(appId: number, callerAddress: string, onComplete: algosdk.OnApplicationComplete, appArgs?: Uint8Array[], foreignAssets?: number[], logicSig?: boolean) {
    const callTxn: Transaction = callApplication(appId, callerAddress, onComplete, appArgs, foreignAssets);

    if (logicSig) {
        return await logicSign(callTxn);
    }
    return await signTxn(callTxn);
}