import algosdk, { SuggestedParams, Transaction, Algodv2 } from 'algosdk';
import MyAlgoConnect, { CreateApplTxn, SignedTx } from '@randlabs/myalgo-connect';
import { getClient, getIndexer } from './credentials.ts';

const myAlgoConnect = new MyAlgoConnect();

const client: Algodv2 = getClient();
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

    const signedTxn: SignedTx = await myAlgoConnect.signTransaction(createTxn.toByte());
    const response = await client.sendRawTransaction(signedTxn.blob).do();

    const txnInfo = await waitForTxn(signedTxn.txID);

    return txnInfo;
}

export async function createNFT(creatorAddress: string, unitName: string, assetName: string, assetUrl: string): Promise<object> {
    return await createASA(creatorAddress, unitName, assetName, 1, 0, assetUrl);
}

export async function createApplication(creatorAddress: string, approvalProgram: string, clearProgram: string, globalInts: number, globalByteSlices: number, localInts: number, localByteSlices: number, appArgs: Uint8Array[], foreignAssets: number[]): Promise<object> {
    const apBytes: Uint8Array = await compileProgram(approvalProgram);
    const cpBytes: Uint8Array = await compileProgram(clearProgram);

    const sp: SuggestedParams = await getDefaultSuggestedParams();
    const txn = {
        from: creatorAddress,
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

    const signedTxn: SignedTx = await myAlgoConnect.signTransaction(createTxn.toByte());
    const response = await client.sendRawTransaction(signedTxn.blob).do();
    
    const txnInfo = await waitForTxn(signedTxn.txID);

    return txnInfo;
}

async function compileProgram(source: string): Promise<Uint8Array> {
    const programBytes = encoder.encode(source);
    const compileResponse = await client.compile(programBytes).do();
    const compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, 'base64'));
    return compiledBytes;
}

async function changeAssetManagement(asset_id: number, currentManagerAddress: string, manager: string, reserve: string, freeze: string, clawback: string, emptyAddressChecking: boolean): Promise<object> {
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
    const signedTxn: SignedTx = await myAlgoConnect.signTransaction(assetChangeTxn.toByte());
    const response = await client.sendRawTransaction(signedTxn.blob).do();

    const txnInfo = await waitForTxn(signedTxn.txID);
    return txnInfo;
}