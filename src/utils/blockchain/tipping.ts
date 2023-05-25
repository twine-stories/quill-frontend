import algosdk, { SuggestedParams, Transaction, makePaymentTxnWithSuggestedParamsFromObject } from 'algosdk';
import MyAlgoConnect, { SignedTx } from '@randlabs/myalgo-connect';
import { getClient, adminAddr } from './credentials.ts';
import { waitForTxn } from './transactionRepository.ts';
import { SignerTransaction } from '@perawallet/connect/dist/util/model/peraWalletModels.js';
import { PeraWalletConnect } from '@perawallet/connect';
import { peraWallet } from '../../App.tsx';

const myAlgoConnect = new MyAlgoConnect();
// const peraWallet = new PeraWalletConnect({
//     chainId: 416002
// });

const client: algosdk.Algodv2 = getClient();

let suggestedParams: SuggestedParams;
client.getTransactionParams().do().then(response => {
    suggestedParams = response;
    suggestedParams.flatFee = true;
    suggestedParams.fee = 1000;
});

const tipHelper = (sender: string, wallets: string[], percentages: number[], creatorTipShare: bigint): Transaction[] => {
    let txns: Transaction[] = [];

    let i: number;
    let txnObj;
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

    const twinePaymentObj = {
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
            const {txId} = await client.sendRawTransaction(signedTxn).do();
            await waitForTxn(txId);
        }
    } else {
        // handle my algo wallet
        const convertedTxns: Uint8Array[] = txns.map((txn: Transaction) => txn.toByte());
        const signedTxns: SignedTx[] = await myAlgoConnect.signTransaction(convertedTxns);

        for (const signedTxn of signedTxns) {
            await client.sendRawTransaction(signedTxn.blob).do();
            await waitForTxn(signedTxn.txID);
        }
    }
}