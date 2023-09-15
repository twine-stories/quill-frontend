import algosdk, {
    SuggestedParams,
    Transaction,
    assignGroupID,
    decodeUnsignedTransaction,
    makeAssetTransferTxnWithSuggestedParamsFromObject,
    makePaymentTxnWithSuggestedParamsFromObject,
} from 'algosdk'
import MyAlgoConnect, { SignedTx } from '@randlabs/myalgo-connect'
import { genericGet, genericPost } from '../api.ts'
import { ConnectType } from '../enums.ts'
import { peraWallet } from '../../App.tsx'
import { ProfitSplit } from '../../utils/types.ts'
import { TWINE_NFT_CUT } from './constants.ts'
import { adminAddr } from './credentials.ts'

const myAlgoConnect = new MyAlgoConnect()

export const sendTransaction = async (
    signedTxn: Uint8Array
): Promise<string> => {
    return await genericPost('/api/algo/sendTransaction', {
        signedTxn: Buffer.from(signedTxn).toString('base64'),
    })
}

export const getSuggestedParams = async (): Promise<SuggestedParams> => {
    return await genericGet('/api/algo/suggested-params')
}

export async function prepareSignedTxn(
    txn: Transaction,
    connectType: ConnectType,
    sender: string
): Promise<string> {
    var signed: Uint8Array
    if (connectType == ConnectType.PERA) {
        const signedTxn = await peraWallet.signTransaction([
            [{ txn: txn, signers: [sender] }],
        ])
        signed = signedTxn[0]
    } else {
        const signedTxn: SignedTx = await myAlgoConnect.signTransaction(
            txn.toByte()
        )
        signed = signedTxn.blob
    }

    return Buffer.from(signed).toString('base64')
}

export async function prepareSignedTxns(
    txns: Transaction[],
    connectType: ConnectType,
    sender: string
): Promise<string[]> {
    const txnsBytes: Uint8Array[] = txns.map(txn => txn.toByte())
    var signed: Uint8Array[]
    if (connectType == ConnectType.PERA) {
        const signedTxns = await peraWallet.signTransaction([
            txns.map(txn => { return { txn: txn, signers: [sender] } })
        ])
        signed = signedTxns
    } else {
        const signedTxns: SignedTx[] = await myAlgoConnect.signTransaction(
            txnsBytes
        )
        signed = signedTxns.map(signedTxn => signedTxn.blob)
    }

    return signed.map(txn => Buffer.from(txn).toString('base64'))
}

async function signTxn(
    txn: Transaction,
    connectType: ConnectType,
    sender: string
): Promise<string> {
    var signed: Uint8Array
    if (connectType == ConnectType.PERA) {
        const signedTxn = await peraWallet.signTransaction([
            [{ txn: txn, signers: [sender] }],
        ])
        signed = signedTxn[0]
    } else {
        const signedTxn: SignedTx = await myAlgoConnect.signTransaction(
            txn.toByte()
        )
        signed = signedTxn.blob
    }
    return await sendTransaction(signed)
}

export async function signTxns(txns: Transaction[]): Promise<string[]> {
    const convertedTxns: Uint8Array[] = txns.map((txn: Transaction) =>
        txn.toByte()
    )
    const signedTxns: SignedTx[] =
        await myAlgoConnect.signTransaction(convertedTxns)

    let promises: Promise<string>[] = []
    for (const signedTxn of signedTxns) {
        promises.push(sendTransaction(signedTxn.blob))
    }

    return await Promise.all(promises)
}

async function createASA(
    creatorAddress: string,
    unitName: string,
    assetName: string,
    note: Uint8Array,
    total: number,
    decimals: number,
    assetUrl: string,
    connectType: ConnectType
): Promise<string> {
    let suggestedParams = await getSuggestedParams()
    const createTxn: Transaction =
        algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            from: creatorAddress,
            suggestedParams: suggestedParams,
            unitName: unitName,
            assetName: assetName,
            assetURL: assetUrl,
            total: total,
            decimals: decimals,
            manager: creatorAddress,
            reserve: creatorAddress,
            freeze: undefined,
            clawback: undefined,
            defaultFrozen: false,
            note: note,
        })

    return await signTxn(createTxn, connectType, creatorAddress)
}

export async function createNFT(
    creatorAddress: string,
    unitName: string,
    assetName: string,
    assetUrl: string,
    note: Uint8Array,
    numAssets: number,
    connectType: ConnectType
): Promise<string> {
    return await createASA(
        creatorAddress,
        unitName,
        assetName,
        note,
        numAssets,
        0,
        assetUrl,
        connectType
    )
}

export async function assetTransfer(
    senderAddress: string,
    receiverAddress: string,
    amount: number | bigint,
    assetId: number,
    connectType: ConnectType,
): Promise<string> {
    let suggestedParams = await getSuggestedParams()
    const txn = {
        from: senderAddress,
        to: receiverAddress,
        suggestedParams: suggestedParams,
        amount: amount,
        assetIndex: assetId,
    }

    const transferTxn = makeAssetTransferTxnWithSuggestedParamsFromObject(txn)
    return prepareSignedTxn(transferTxn, connectType, senderAddress)
}

async function pay(
    sender: string,
    receiver: string,
    price: number | bigint,
): Promise<Transaction> {
    let suggestedParams = await getSuggestedParams()
    const txn = {
        from: sender,
        to: receiver,
        suggestedParams: suggestedParams,
        amount: price
    }

    return makePaymentTxnWithSuggestedParamsFromObject(txn)
}

async function optIn(
    sender: string,
    assetId: number,
): Promise<Transaction> {
    let suggestedParams = await getSuggestedParams()
    const txn = {
        from: sender,
        to: sender,
        suggestedParams: suggestedParams,
        amount: 0,
        assetIndex: assetId,
    }

    return makeAssetTransferTxnWithSuggestedParamsFromObject(txn)
}

export async function buy(
    superAddr: string,
    buyer: string,
    profitSplits: ProfitSplit[],
    price: bigint,
    assetId: number,
    appCall: string,
    connectType: ConnectType,
): Promise<string[]> {
    let txnArrayPromises: Promise<Transaction>[] = []

    txnArrayPromises.push(optIn(buyer, assetId))
    
    // const optInTxn: Transaction = await optIn(buyer, assetId)

    const twineCut: bigint = (price * BigInt(TWINE_NFT_CUT * 100)) / 100n;
    const creatorCut: bigint = price - twineCut;

    txnArrayPromises.push(pay(buyer, adminAddr, twineCut));

    for (let i = 0; i < profitSplits.length; i++) {
        txnArrayPromises.push(pay(buyer, profitSplits[i].creator.walletAddress, (creatorCut * BigInt(profitSplits[i].percentage)) / 100n))
    }

    // const payTxn: Transaction = await pay(buyer, superAddr, price)
    const appCallTxn: Transaction = decodeUnsignedTransaction(
        Buffer.from(appCall, 'base64')
    );

    const response: Transaction[] = await Promise.all(txnArrayPromises);

    const txnArray: Transaction[] = [response[0], appCallTxn, ...response.slice(1)]
    const txnGroup: Transaction[] = assignGroupID(txnArray);

    const signedGroup: string[] = await prepareSignedTxns(txnGroup, connectType, buyer)
    const unsignedAppCall: string = Buffer.from(algosdk.encodeUnsignedTransaction(txnGroup[1])).toString('base64')

    return [signedGroup[0], unsignedAppCall, ...signedGroup.slice(2)]
}