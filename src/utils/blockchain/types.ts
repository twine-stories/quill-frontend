export type Asset = {
    escrowAddress: string;
    asaPrice?: number | bigint;
    asaOwner: string;
    appState: number;
    asaId: number;
    escrowProgram: string;
    startPrice?: number | bigint;
    endPrice?: number | bigint;
    startTime?: number;
    duration?: number;
};