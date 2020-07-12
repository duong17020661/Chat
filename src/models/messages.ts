export interface IMessages {
    id: number,
    message: string,
    senderID: string,
    receiverID: string,
    time: string,
    type: string,
    url?: string,
    typeof?: string
    timeDiff?: number
}