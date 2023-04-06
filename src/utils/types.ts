import { Genre, WorkType, ConnectType, CollectionType } from 'enums.ts';

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
    connectType: ConnectType;
    description?: string;
    website?: string;
    twitter?: string;
    instagram?: string;
    reddit?: string;
    discord?: string;
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
    collType: CollectionType;
    url: string;
    active: boolean;
}

export type Artwork = {
    id: number;
    origColl: NFTCollection;
    currColl?: NFTCollection;
    appId?: number;
}

export type ProfitSplit = {
    id?: number;
    creator: User;
    collection: NFTCollection;
    percentage: number;
}