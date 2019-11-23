// This model represents an item from a list of discussion
export class Discussion {
    constructor(
        public owner: string,
        public participants: string[],
        public subject: string,
        public messages: {
            author: string, 
            message: string,
            date: Date,     
            seenBy: string[]    // Return names from backend
        }[],
        public date: Date,  //when subject was started
    ){}
}