export interface User {
    avatar: string;
    birthday: number;
    description: string;
    displayName: string;
    email: string;
    id: number;
    isBanned: boolean;
    registrationDate: number;
    username: string;
}

export interface FriendsStatus {
    status: string;
}