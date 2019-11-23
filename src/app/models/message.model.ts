// This model represents a single public message displayed in scrapbook
export class Message {
    constructor(
        public author: string,
        public recipient: string,
        public message: string,
        public date: Date,
        public userName: string,
        public avatar: string,
        public editable: boolean,
        public comments: {from: string, comment: string, userName:string}[],
    ){}
}