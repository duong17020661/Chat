export interface IMessages {
    id: number,
    message: string,
    senderID: number,
    receiverID: number,
    time: string,
    type: string,
    url?: string,
    typeof?: string
    timeDiff?: number
}