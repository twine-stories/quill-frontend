const encoder = new TextEncoder();

export const INIT_ESCROW: Uint8Array = encoder.encode("initializeEscrow");
export const MAKE_SELL_OFFER: Uint8Array = encoder.encode("makeSellOffer");
export const BUY: Uint8Array = encoder.encode("buy");
export const STOP_SELL_OFFER: Uint8Array = encoder.encode("stopSellOffer");