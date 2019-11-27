// This model represents an item from a list of discussion
export class Discussion {
    constructor(
        public id: string,
        public owner: {
            id: string,
            username: string,
            avatar: string
        },
        public participants: {
            id: string,
            username: string,
            avatar: string
        }[],
        public subject: string,
        public messages: {
            author: {
                id: string,
                username: string,
                avatar: string
            }, 
            message: string,
            date: Date,
            editable: boolean
        }[],
        public date: Date,
        public editable: boolean
    ){}
}