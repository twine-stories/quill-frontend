const encoder = new TextEncoder();

export const INIT_ESCROW: Uint8Array = encoder.encode("initializeEscrow");
export const MAKE_SELL_OFFER: Uint8Array = encoder.encode("makeSellOffer");
export const BUY: Uint8Array = encoder.encode("buy");
export const STOP_SELL_OFFER: Uint8Array = encoder.encode("stopSellOffer");


/*
 * App States
 * 0: not initialized
 * 1: active
 * 2: selling in progress
 */
export const nameMapping: object = {
    'ESCROW_ADDRESS': 'escrowAddress',
    'ASA_PRICE': 'asaPrice',
    'ASA_OWNER': 'asaOwner',
    'APP_STATE': 'appState',
    'ASA_ID': 'asaId',
    'START_PRICE': 'startPrice',
    'END_PRICE': 'endPrice',
    'START_TIME': 'startTime',
    'DURATION': 'duration'
};