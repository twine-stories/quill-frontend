import { Algodv2, Indexer, mnemonicToSecretKey } from 'algosdk';
import { env } from '../../config.ts';

const clientAddress = env === 'dev' ? 'https://testnet-algorand.api.purestake.io/ps2': 'https://mainnet-algorand.api.purestake.io/ps2';
const indexerAddress = env === 'dev' ? 'https://testnet-algorand.api.purestake.io/idx2' : 'https://mainnet-algorand.api.purestake.io/idx2';
const port = '';
const token = {'X-API-Key': 'faketoken'};

export const adminAddr: string = env === 'dev' ? "CB2MYSJFLTUMGRURINUT3B5A7VK45LNZWFRTLG2SJGBRVAQF32UDDUEX34": "FF6ZFKQWOZNGUGXFKOBH5WFAPY6SWSLKIIW52G64CQUKZWU52TN3BNMJPU";
const mnemonic: string = "muscle glad denial accuse process name law hover pink siege fabric away suggest when guard tip jelly firm toast stomach foil extra spoil absent swarm";

export const zeroAddr: string = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ";

export function getClient(): Algodv2 {
    return new Algodv2(token, clientAddress, port);
}

export function getIndexer(): Indexer {
    return new Indexer(token, indexerAddress, port);
}

export function getSecretKey(): Uint8Array {
    return mnemonicToSecretKey(mnemonic).sk;
}