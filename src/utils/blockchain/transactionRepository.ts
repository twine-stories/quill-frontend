import algosdk, { SuggestedParams, Transaction, Algodv2, LogicSigAccount, makeLogicSigAccountTransactionSigner, Indexer } from 'algosdk';
import MyAlgoConnect, { CreateApplTxn, SignedTx } from '@randlabs/myalgo-connect';
import { getClient, getIndexer, adminAddr, getSecretKey } from './credentials.ts';
import LookupAccountAssets from 'algosdk/dist/types/src/client/v2/indexer/lookupAccountAssets';

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

export async function changeAssetManagement(asset_id: number, currentManagerAddress: string, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, emptyAddressChecking: boolean): Promise<object> {
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

export async function escrowProgramToAddress(escrowProgram: string): Promise<string> {
    const account: LogicSigAccount = new LogicSigAccount(await compileProgram(escrowProgram));
    return account.address();
}

export async function getAccountAssets(walletAddress: string): Promise<Array<object>> {
    const assets: Record<string, any> = await indexer.lookupAccountCreatedAssets(walletAddress).do()
    return assets['assets'];
}