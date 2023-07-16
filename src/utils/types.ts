import { Genre, WorkType, ConnectType, CollectionType } from 'enums.ts';

export type User = {
    id?: number;
    walletAddress: string;
    creator: boolean;
    accountCreationDate?: Date;
    email?: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
    userName: string;
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
    medium: WorkType;
    url: string;
    hook: string;
    cover?: string;
    banner?: string;
    publishStamp?: Date;
    genre1: Genre;
    genre2?: Genre;
    genre3?: Genre;
    published: boolean;
}

export type Episode = {
    id?: number;
    work: Work;
    title: string;
    content: string;
    cover?: string;
    endOfChapterMessage?: string;
    publishStamp?: Date;
    episodeNumber: number;
    flags: number;
    url: string;
    mature: boolean;
    published: boolean;
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
    collection?: NFTCollection;
    episode?: Episode;
    percentage: number;
}

export type Feedback = {
    id?: number;
    submitter: User;
    beta: boolean;
    subject: string;
    description: string;
    images?: string;
    stamp?: Date;
}

export type Follow = {
    id?: number;
    follower: User;
    followee: User;
}

export type ImageUpload = {
    name: string;
    file: File;
    preview: string;
    openUpload: boolean;

}

export type Like = {
    id?: number;
    liker: User;
    episode: Episode;
}

export type Comment = {
    id?: number;
    commenter: User;
    episode: Episode;
    content: string;
}

export type Tip = {
    id?: number;
    tipper: User;
    episode: Episode;
    amount: number;
}