import algosdk, { Algodv2, Indexer } from 'algosdk';

const clientAddress = 'https://testnet-algorand.api.purestake.io/ps2';
const indexerAddress = 'https://testnet-algorand.api.purestake.io/idx2';
const port = '';
const token = {'X-API-Key': 'beOoH8pO9c3HNd85AXd6C1eRStQshbL352yYVQsR'};

export function getClient() {
    return new Algodv2(token, clientAddress, port);
}

export function getIndexer() {
    return new Indexer(token, indexerAddress, port);
}