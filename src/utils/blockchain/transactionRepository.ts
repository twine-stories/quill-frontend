import algosdk, { SuggestedParams, Transaction, Algodv2, LogicSigAccount, Indexer, makeApplicationCallTxnFromObject, makePaymentTxnWithSuggestedParamsFromObject } from 'algosdk';
import MyAlgoConnect, { SignedTx } from '@randlabs/myalgo-connect';
import { getClient, getIndexer, adminAddr, getSecretKey } from './credentials.ts';

const myAlgoConnect = new MyAlgoConnect();

const client: Algodv2 = getClient();
const indexer: Indexer = getIndexer();
const encoder = new TextEncoder();

async function getDefaultSuggestedParams(): Promise<SuggestedParams> {
    let suggestedParams: SuggestedParams = await client.getTransactionParams().do();

    suggestedParams.flatFee = true;
    suggestedParams.fee = 1000;

    return suggestedParams;
}

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
        await client.sendRawTransaction(signedTxn.blob);
        await waitForTxn(signedTxn.txID);
    }
}

export async function pay(sender: string, receiver: string, amount: number | bigint, shouldSign?: boolean, logicSig?: boolean): Promise<Transaction | object> {
    const sp: SuggestedParams = await getDefaultSuggestedParams();
    const txn = {
        amount: amount,
        from: sender,
        to: receiver,
        suggestedParams: sp
    }

    const paymentTxn: Transaction = makePaymentTxnWithSuggestedParamsFromObject(txn);

    if (shouldSign) {
        if (logicSig) {
            const signedTxn: Uint8Array = paymentTxn.signTxn(getSecretKey());
            const response = await client.sendRawTransaction(signedTxn).do();
            console.log(response);
    
            return await waitForTxn(response['txId']);
        }
        return await signTxn(paymentTxn);
    }

    return paymentTxn;
}

async function createASA(creatorAddress: string, unitName: string, assetName: string, total: number, decimals: number, assetUrl: string): Promise<object> {
    const sp: SuggestedParams = await getDefaultSuggestedParams();
    const createTxn: Transaction = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: creatorAddress,
        suggestedParams: sp,
        unitName: unitName,
        assetName: assetName,
        assetURL: assetUrl,
        total: total,
        decimals: decimals,
        manager: creatorAddress,
        reserve: creatorAddress,
        freeze: creatorAddress,
        clawback: creatorAddress,
        defaultFrozen: false,
    });

    return await signTxn(createTxn);
}

export async function createNFT(creatorAddress: string, unitName: string, assetName: string, assetUrl: string): Promise<object> {
    return await createASA(creatorAddress, unitName, assetName, 1, 0, assetUrl);
}

export async function createApplication(approvalProgram: string, clearProgram: string, globalInts: number, globalByteSlices: number, localInts: number, localByteSlices: number, appArgs: Uint8Array[], foreignAssets: number[]): Promise<number> {
    const apBytes: Uint8Array = await compileProgram(approvalProgram);
    const cpBytes: Uint8Array = await compileProgram(clearProgram);

    const sp: SuggestedParams = await getDefaultSuggestedParams();
    const txn = {
        from: adminAddr,
        suggestedParams: sp,
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
    const programBytes = encoder.encode(source);
    const compileResponse = await client.compile(programBytes).do();
    const compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, 'base64'));
    return compiledBytes;
}

export async function changeAssetManagement(asset_id: number, currentManagerAddress: string, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, emptyAddressChecking: boolean, shouldSign?: boolean): Promise<Transaction | object> {
    const sp: SuggestedParams = await getDefaultSuggestedParams();
    const txn = {
        from: currentManagerAddress,
        assetIndex: asset_id,
        manager: manager,
        reserve: reserve,
        freeze: freeze,
        clawback: clawback,
        suggestedParams: sp,
        strictEmptyAddressChecking: emptyAddressChecking
    }

    const assetChangeTxn: Transaction = algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject(txn);
    if (shouldSign) {
        return await signTxn(assetChangeTxn);
    }
    return assetChangeTxn;
}

export async function escrowProgramToAddress(escrowProgram: string): Promise<string> {
    const account: LogicSigAccount = new LogicSigAccount(await compileProgram(escrowProgram));
    return account.address();
}

export async function getAccountAssets(walletAddress: string): Promise<Array<object>> {
    const assets: Record<string, any> = await indexer.lookupAccountCreatedAssets(walletAddress).do()
    return assets['assets'];
}

export async function callApplication(appId: number, callerAddress: string, onComplete: algosdk.OnApplicationComplete, appArgs?: Uint8Array[], foreignAssets?: number[], shouldSign?: boolean, logicSig?: boolean) {
    const sp: SuggestedParams = await getDefaultSuggestedParams();
    const txn = {
        from: callerAddress,
        suggestedParams: sp,
        appIndex: appId,
        onComplete: onComplete,
        appArgs: appArgs,
        foreignAssets: foreignAssets,
    };

    const callTxn: Transaction = makeApplicationCallTxnFromObject(txn);

    if (shouldSign) {
        if (logicSig) {
            const signedTxn: Uint8Array = callTxn.signTxn(getSecretKey());
            const response = await client.sendRawTransaction(signedTxn).do();
            console.log(response);
    
            return await waitForTxn(response['txId']);
        }
        return await signTxn(callTxn);
    }
    return callTxn;
}