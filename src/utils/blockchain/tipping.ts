import {
    SuggestedParams,
    Transaction,
    makePaymentTxnWithSuggestedParamsFromObject,
} from 'algosdk'
import MyAlgoConnect, { SignedTx } from '@randlabs/myalgo-connect'
import { adminAddr } from './credentials.ts'
import { SignerTransaction } from '@perawallet/connect/dist/util/model/peraWalletModels.js'
import { peraWallet } from '../../App.tsx'
import { genericGet } from '../api.ts'
import { TWINE_CUT } from './constants.ts'
import { sendTransaction } from './transactionRepository.ts'

type BigPayment = {
    amount: bigint
    from: string
    to: string
    suggestedParams: SuggestedParams
}

const myAlgoConnect = new MyAlgoConnect()

const tipHelper = async (
    sender: string,
    wallets: string[],
    percentages: number[],
    creatorTipShare: bigint,
): Promise<Transaction[]> => {
    let txns: Transaction[] = []

    let i: number
    let txnObj: BigPayment
    let suggestedParams: SuggestedParams
    for (i = 0; i < wallets.length; i++) {
        suggestedParams = await genericGet(
            '/api/algo/suggested-params'
        )

        txnObj = {
            amount: (creatorTipShare * BigInt(percentages[i])) / 100n,
            from: sender,
            to: wallets[i],
            suggestedParams: suggestedParams,
        }
        txns.push(makePaymentTxnWithSuggestedParamsFromObject(txnObj))
    }

    return txns
}

export const tip = async (
    sender: string,
    wallets: string[],
    percentages: number[],
    totalTip: bigint,
    pera: boolean,
    setProcessing
) => {
    const twineCut: bigint = totalTip / BigInt(TWINE_CUT * 100)
    const creatorsCut: bigint = totalTip - twineCut

    let txns: Transaction[] = await tipHelper(
        sender,
        wallets,
        percentages,
        creatorsCut
    )

    let suggestedParams: SuggestedParams = await genericGet(
        '/api/algo/suggested-params'
    )

    const twinePaymentObj: BigPayment = {
        amount: twineCut,
        from: sender,
        to: adminAddr,
        suggestedParams: suggestedParams,
    }
    txns.push(makePaymentTxnWithSuggestedParamsFromObject(twinePaymentObj))

    let promises: Promise<string>[] = []
    if (pera) {
        // handle pera wallet
        const convertedTxns: SignerTransaction[] = txns.map(
            (txn: Transaction) => {
                return { txn: txn, signers: [sender] }
            }
        )

        const signedTxns = await peraWallet.signTransaction([convertedTxns])

        setProcessing(true)
        for (const signedTxn of signedTxns) {
            promises.push(sendTransaction(signedTxn))
        }
    } else {
        // handle my algo wallet
        const convertedTxns: Uint8Array[] = txns.map((txn: Transaction) =>
            txn.toByte()
        )
        const signedTxns: SignedTx[] =
            await myAlgoConnect.signTransaction(convertedTxns)

        setProcessing(true)
        for (const signedTxn of signedTxns) {
            promises.push(sendTransaction(signedTxn.blob))
        }
    }

    await Promise.all(promises)
    setProcessing(false)
}
