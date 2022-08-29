import algosdk from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';


export const connection = new MyAlgoConnect();
export const algodClient = new algosdk.Algodv2('', 'https://node.testnet.algoexplorerapi.io', '');