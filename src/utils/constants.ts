import { CollectionType } from "./enums.ts";

export const saleTypeMap: Record<string, CollectionType> = {
    'rev_auction': CollectionType.REV_AUCTION,
    'sale': CollectionType.SALE,
    'shuffle': CollectionType.SHUFFLE
}

export const MAX_COLLABORATORS: number = 3;

<<<<<<< HEAD
export const CHAPTER_DELIMETER: string = "³¤³";
export const CHAPTER_IMG_DELIMETER: string = "ïmg¦";
export const STORY_COVER_PATH: string = 'story/';
export const STORY_BANNER_PATH: string = 'banner/';

export const AWS_S3_REGION: string = "us-east-1";
