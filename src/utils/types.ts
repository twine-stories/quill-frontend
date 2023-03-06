import { Genre, WorkType } from 'enums.ts';

export type User = {
    id?: number;
    walletAddress: string;
    creator: boolean;
    accountCreationDate?: Date;
    email?: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    profileImg: string;
    illustrator: boolean;
    suspended: boolean;
    userCookie?: string;
}

export type Work = {
    id?: number;
    creator: User;
    title: string;
    description: string;
    cover?: string;
    banner?: string;
    publishStamp?: Date;
    genre1: Genre;
    genre2?: Genre;
    genre3?: Genre;
    medium: WorkType;
    url: string;
}

export type Episode = {
    id?: number;
    creator: User;
    title: string;
    description: string;
    cover?: string;
    banner?: string;
    publishStamp?: Date;
    genre1: Genre;
    genre2?: Genre;
    genre3?: Genre;
    medium: WorkType;
    url: string;
}

export type NFTCollection = {
    id?: number;
    work: Work;
    publishStamp?: Date;
    name: string;
}

export type Artwork = {
    id?: number;
    collection: NFTCollection;
    assetId: number;
    appId?: number;
}