export interface IUser {
    id: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    photo: string,
    email: string,
    phone: string,
    lastMessage: string,
    status: boolean,
    newMessage: number,
    lastSeen: Date
}