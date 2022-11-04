import { Genre, WorkType } from 'enums.ts';

export type User = {
    id: number;
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
    id: number;
    creator: User;
    title: string;
    cover?: string;
    banner?: string;
    publishStamp?: Date;
    genre1: Genre;
    genre2?: Genre;
    genre3?: Genre;
    medium: WorkType;
    url: string;
}