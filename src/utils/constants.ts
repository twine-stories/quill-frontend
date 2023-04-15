import { CollectionType } from "./enums.ts";

export const saleTypeMap: Record<string, CollectionType> = {
    'rev_auction': CollectionType.REV_AUCTION,
    'sale': CollectionType.SALE,
    'shuffle': CollectionType.SHUFFLE
}

export const MAX_COLLABORATORS: number = 3;

export const CHAPTER_DELIMETER: string = "³¤³";
export const CHAPTER_IMG_DELIMETER: string = "ïmg¦";