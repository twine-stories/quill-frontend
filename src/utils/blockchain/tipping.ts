import { SuggestedParams, Transaction, makePaymentTxnWithSuggestedParamsFromObject } from 'algosdk';
import MyAlgoConnect, { SignedTx } from '@randlabs/myalgo-connect';
import { adminAddr } from './credentials.ts';
import { SignerTransaction } from '@perawallet/connect/dist/util/model/peraWalletModels.js';
import { peraWallet } from '../../App.tsx';
import { genericGet, genericPost } from '../api.ts';

type BigPayment = {
    amount: bigint;
    from: string;
    to: string;
    suggestedParams: SuggestedParams;
}

const myAlgoConnect = new MyAlgoConnect();

let suggestedParams: SuggestedParams;
genericGet('/api/algo/suggestedParams').then((response: SuggestedParams) => {
    suggestedParams = response;
    console.log(suggestedParams);
});

const tipHelper = (sender: string, wallets: string[], percentages: number[], creatorTipShare: bigint): Transaction[] => {
    let txns: Transaction[] = [];

    let i: number;
    let txnObj: BigPayment;
    for (i = 0; i < wallets.length; i++) {
        txnObj = {
            amount: (creatorTipShare * BigInt(percentages[i])) / 100n,
            from: sender,
            to: wallets[i],
            suggestedParams: suggestedParams
        }
        txns.push(makePaymentTxnWithSuggestedParamsFromObject(txnObj));
    }

    return txns;
}

export const tip = async (sender: string, wallets: string[], percentages: number[], totalTip: bigint, pera: boolean) => {
    const twineCut: bigint = (totalTip) / 10n;
    const creatorsCut: bigint = totalTip - twineCut;

    let txns: Transaction[] = tipHelper(sender, wallets, percentages, creatorsCut);

    const twinePaymentObj: BigPayment = {
        amount: twineCut,
        from: sender,
        to: adminAddr,
        suggestedParams: suggestedParams
    };
    txns.push(makePaymentTxnWithSuggestedParamsFromObject(twinePaymentObj));

    if (pera) {
        // handle pera wallet
        const convertedTxns: SignerTransaction[] = txns.map((txn: Transaction) => {
            return {txn: txn, signers: [sender]}
        });
        
        const signedTxns = await peraWallet.signTransaction([convertedTxns]);

        for (const signedTxn of signedTxns) {
            await genericPost('/api/algo/sendTransaction', {'signedTxn': Buffer.from(signedTxn).toString('base64')});
        }
    } else {
        // handle my algo wallet
        const convertedTxns: Uint8Array[] = txns.map((txn: Transaction) => txn.toByte());
        const signedTxns: SignedTx[] = await myAlgoConnect.signTransaction(convertedTxns);

        for (const signedTxn of signedTxns) {
            await genericPost('/api/algo/sendTransaction', {'signedTxn': Buffer.from(signedTxn.blob).toString('base64')});
        }
    }
}