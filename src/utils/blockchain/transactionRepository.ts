import algosdk, { SuggestedParams, Transaction, Algodv2, LogicSigAccount, Indexer, makeApplicationCallTxnFromObject, makePaymentTxnWithSuggestedParamsFromObject, makeAssetTransferTxnWithSuggestedParamsFromObject, computeGroupID, signLogicSigTransactionObject, encodeUint64, decodeAddress } from 'algosdk';
import MyAlgoConnect, { SignedTx } from '@randlabs/myalgo-connect';
import { getClient, getIndexer, adminAddr, getSecretKey } from './credentials.ts';
import { BUY } from './constants.ts';
import { genericGet, genericPost } from '../api.ts';
import { ConnectType } from '../enums.ts';
import { peraWallet } from '../../App.tsx';

const myAlgoConnect = new MyAlgoConnect();

const client: Algodv2 = getClient();
const indexer: Indexer = getIndexer();
const encoder = new TextEncoder();

export const sendTransaction = async (signedTxn: Uint8Array): Promise<string> => {
    return await genericPost('/api/algo/sendTransaction', {'signedTxn': Buffer.from(signedTxn).toString('base64')});
}

export const getSuggestedParams = async (): Promise<SuggestedParams> => {
    return await genericGet('/api/algo/suggestedParams');
}

export async function waitForTxn(txnId: string): Promise<Record<string, any>> {
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

async function signTxn(txn: Transaction, connectType: ConnectType, sender: string): Promise<string> {
    var signed: Uint8Array
    if (connectType == ConnectType.PERA) {
        const signedTxn = await peraWallet.signTransaction([[{txn: txn, signers: [sender]}]])
        signed = signedTxn[0]
    } else {
        const signedTxn: SignedTx = await myAlgoConnect.signTransaction(txn.toByte());
        signed = signedTxn.blob
    }
    return await sendTransaction(signed);
}

export async function signTxns(txns: Transaction[]): Promise<string[]> {
    const convertedTxns: Uint8Array[] = txns.map((txn: Transaction) => txn.toByte());
    const signedTxns: SignedTx[] = await myAlgoConnect.signTransaction(convertedTxns);

    let promises: Promise<string>[] = [];
    for (const signedTxn of signedTxns) {
        promises.push(sendTransaction(signedTxn.blob));
    }

    return await Promise.all(promises);
}

async function logicSign(txn: Transaction) {
    const signedTxn: Uint8Array = txn.signTxn(getSecretKey());
    return await sendTransaction(signedTxn);
}

export async function pay(sender: string, receiver: string, amount: number | bigint): Promise<Transaction> {
    let suggestedParams = await getSuggestedParams();
    const txn = {
        amount: amount,
        from: sender,
        to: receiver,
        suggestedParams: suggestedParams
    }

    const paymentTxn: Transaction = makePaymentTxnWithSuggestedParamsFromObject(txn);
    return paymentTxn;
}

export async function paySign(sender: string, receiver: string, amount: number | bigint, logicSig?: boolean): Promise<string> {
    const paymentTxn: Transaction = await pay(sender, receiver, amount);

    if (logicSig) {
        return await logicSign(paymentTxn);
    }
    return await signTxn(paymentTxn);
}

async function createASA(creatorAddress: string, unitName: string, assetName: string, note: Uint8Array, total: number, decimals: number, assetUrl: string, connectType: ConnectType): Promise<string> {
    let suggestedParams = await getSuggestedParams();
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
        note: note
    });

    return await signTxn(createTxn, connectType, creatorAddress);
}

export async function createNFT(creatorAddress: string, unitName: string, assetName: string, assetUrl: string, note: Uint8Array, numAssets: number, connectType: ConnectType): Promise<string> {
    return await createASA(creatorAddress, unitName, assetName, note, numAssets, 0, assetUrl, connectType);
}

export async function createApplication(approvalProgram: string, clearProgram: string, globalInts: number, globalByteSlices: number, localInts: number, localByteSlices: number, appArgs: Uint8Array[], foreignAssets: number[]): Promise<number> {
    let suggestedParams = await getSuggestedParams();

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

export async function changeAssetManagement(assetId: number, currentManagerAddress: string, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, emptyAddressChecking: boolean): Promise<Transaction> {
    let suggestedParams = await getSuggestedParams();
    const txn = {
        from: currentManagerAddress,
        assetIndex: assetId,
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

export async function changeAssetManagementSign(assetId: number, currentManagerAddress: string, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, emptyAddressChecking: boolean): Promise<string> {
    const assetChangeTxn: Transaction = await changeAssetManagement(assetId, currentManagerAddress, manager, reserve, freeze, clawback, emptyAddressChecking);
    return await signTxn(assetChangeTxn);
}

export async function escrowProgramToAddress(escrowProgram: string): Promise<string> {
    const account: LogicSigAccount = new LogicSigAccount(await compileProgram(escrowProgram));
    return account.address();
}

export async function getApplicationById(appId: number): Promise<object> {
    const app = await indexer.lookupApplications(appId).do();
    return app['application'];
}

export async function getAssetById(assetId: number): Promise<object> {
    const asset = await indexer.lookupAssetByID(assetId).do();
    return asset['asset'];
}

export async function getAccountAssets(walletAddress: string): Promise<Array<object>> {
    const assets: Record<string, any> = await indexer.lookupAccountCreatedAssets(walletAddress).do();
    // console.log(await indexer.lookupAccountAssets(walletAddress).do());
    return assets['assets'];
}

export async function callApplication(appId: number, callerAddress: string, onComplete: algosdk.OnApplicationComplete, appArgs?: Uint8Array[], foreignAssets?: number[], accounts?: string[]): Promise<Transaction> {
    let suggestedParams = await getSuggestedParams();
    const txn = {
        from: callerAddress,
        suggestedParams: suggestedParams,
        appIndex: appId,
        onComplete: onComplete,
        appArgs: appArgs,
        foreignAssets: foreignAssets,
        accounts: accounts
    };

    const callTxn: Transaction = makeApplicationCallTxnFromObject(txn);
    return callTxn;
}

export async function callApplicationSign(appId: number, callerAddress: string, onComplete: algosdk.OnApplicationComplete, appArgs?: Uint8Array[], foreignAssets?: number[], accounts?: string[], logicSig?: boolean) {
    const callTxn: Transaction = await callApplication(appId, callerAddress, onComplete, appArgs, foreignAssets, accounts);

    if (logicSig) {
        return await logicSign(callTxn);
    }
    return await signTxn(callTxn);
}

async function assetTransfer(senderAddress: string, receiverAddress: string, amount: number | bigint, assetId: number, revocationTarget?: string): Promise<Transaction> {
    let suggestedParams = await getSuggestedParams();
    const txn = {
        from: senderAddress,
        to: receiverAddress,
        suggestedParams: suggestedParams,
        amount: amount,
        assetIndex: assetId,
        revocationTarget: revocationTarget
    };

    const transferTxn = makeAssetTransferTxnWithSuggestedParamsFromObject(txn);
    return transferTxn;
}

export async function optIn(assetId: number, address: string): Promise<Transaction> {
    return await assetTransfer(address, address, 0, assetId);
}

export async function buyAsset(assetId: number, appId: number, ownerAddress: string, buyerAddress: string, price: number | bigint, escrowAddress: string, contractAddress: string, timestamp?: number): Promise<Transaction[]> {
    let appArgs: Uint8Array[] = [BUY];
    if (timestamp) {
        appArgs.push(encodeUint64(timestamp));
    }
    appArgs.push(...[decodeAddress('KYUH2SNU6FWFGBK6PNWI4EUIABOYFIQIQH2WOP3FW7DGA623ESTGXYQPJA').publicKey, encodeUint64(90), decodeAddress('CB2MYSJFLTUMGRURINUT3B5A7VK45LNZWFRTLG2SJGBRVAQF32UDDUEX34').publicKey, encodeUint64(10)]);
    let appCallTxn: Transaction = await callApplication(appId, buyerAddress, algosdk.OnApplicationComplete.NoOpOC, appArgs);
    // change hardcod
    let paymentTxn: Transaction = await pay(buyerAddress, contractAddress, price);
    let assetTransferTxn: Transaction = await assetTransfer(escrowAddress, buyerAddress, 1, assetId, ownerAddress);

    let txns: Transaction[] = [appCallTxn, paymentTxn, assetTransferTxn];
    const gid: Buffer = computeGroupID(txns);

    return txns.map((txn: Transaction) => {
        txn.group = gid;
        return txn;
    });
}

export async function buySign(optInTxn: Transaction, buyTxns: Transaction[], escrowProgram: string): Promise<object> {
    const myAlgoSignTxns: Transaction[] = [optInTxn, buyTxns[0], buyTxns[1]];
    const convertedTxns: Uint8Array[] = myAlgoSignTxns.map((txn: Transaction) => txn.toByte());

    const signedTxns: SignedTx[] = await myAlgoConnect.signTransaction(convertedTxns);

    const account: LogicSigAccount = new LogicSigAccount(await compileProgram(escrowProgram));
    const transferTxnSigned: SignedTx = signLogicSigTransactionObject(buyTxns[2], account);

    // send and wait for opt in
    let response = await client.sendRawTransaction(signedTxns[0].blob).do();
    let txnInfo = await waitForTxn(signedTxns[0].txID);

    // send and wait for atomic swap
    const buySignedTxns: SignedTx[] = [signedTxns[1], signedTxns[2], transferTxnSigned];
    const buySignedTxnsBlobs: Uint8Array[] = buySignedTxns.map((elem: SignedTx) => elem.blob);
    response = await client.sendRawTransaction(buySignedTxnsBlobs).do();
    txnInfo = await waitForTxn(response['txId']);

    return txnInfo;
}