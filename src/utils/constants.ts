import { CollectionType } from "./enums.ts";

export const saleTypeMap: Record<string, CollectionType> = {
    'auction': CollectionType.REV_AUCTION,
    'sale': CollectionType.SALE,
    'shuffle': CollectionType.SHUFFLE
}