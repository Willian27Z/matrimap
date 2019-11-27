//used for chat messages
export class ChatMessage {
    constructor(
        public author: string,
        public message: string,
        public date: Date,
    ){}
}

// Actions for Socket.io
export enum Action {
    JOINED,
    LEFT
}

// Socket.io events
export enum IOEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    FRIEND = "friend",
}