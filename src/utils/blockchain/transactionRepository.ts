import algosdk, { SuggestedParams, Transaction, Algodv2 } from 'algosdk';
import MyAlgoConnect, { SignedTx } from '@randlabs/myalgo-connect';
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

async function createApplication(creatorAddress: string, approvalProgram: string, clearProgram: string, globalByteSlices: number, globalInts: number, localByteSlices: number, localInts: number, appArgs: string[], foreignAssets: number[]) {
    const apBytes: Uint8Array = encoder.encode(approvalProgram);
    const cpBytes: Uint8Array = encoder.encode(clearProgram);
    let appArgsBytes: Uint8Array[] = [];

    appArgs.forEach((val: string) => {
        appArgsBytes.push(encoder.encode(val));
    });

    const sp: SuggestedParams = await getDefaultSuggestedParams();
    const createTxn: Transaction = algosdk.makeApplicationCreateTxnFromObject({
        from: creatorAddress,
        suggestedParams: sp,
        approvalProgram: apBytes,
        clearProgram: cpBytes,
        numLocalInts: localInts,
        numLocalByteSlices: localByteSlices,
        numGlobalInts: globalInts,
        numGlobalByteSlices: globalByteSlices,
        appArgs: appArgsBytes,
        foreignAssets: foreignAssets,
        onComplete: algosdk.OnApplicationComplete.NoOpOC
    });

    const signedTxn: SignedTx = await myAlgoConnect.signTransaction(createTxn.toByte());
    const response = await client.sendRawTransaction(signedTxn.blob).do();
    console.log(response);
}