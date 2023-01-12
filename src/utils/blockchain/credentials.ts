import algosdk, { Algodv2, Indexer, mnemonicToSecretKey } from 'algosdk';

const clientAddress = 'https://testnet-algorand.api.purestake.io/ps2';
const indexerAddress = 'https://testnet-algorand.api.purestake.io/idx2';
const port = '';
const token = {'X-API-Key': 'beOoH8pO9c3HNd85AXd6C1eRStQshbL352yYVQsR'};

export const adminAddr: string = "CB2MYSJFLTUMGRURINUT3B5A7VK45LNZWFRTLG2SJGBRVAQF32UDDUEX34";
const mnemonic: string = "muscle glad denial accuse process name law hover pink siege fabric away suggest when guard tip jelly firm toast stomach foil extra spoil absent swarm";

export function getClient(): Algodv2 {
    return new Algodv2(token, clientAddress, port);
}

export function getIndexer(): Indexer {
    return new Indexer(token, indexerAddress, port);
}

export function getSecretKey(): Uint8Array {
    return mnemonicToSecretKey(mnemonic).sk;
}