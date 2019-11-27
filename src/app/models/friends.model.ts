export class Friends {
    constructor(
        // These are the properties I want to store locally
        // All the user profile will be stored in this properties
        // Need to match database structure to facilitate receiving info
        public id: string,
        public status: string,
        public date: string,
        public pseudo: string,
        public nom: string,
        public prenom: string,
        public avatar: string,
        public recommendedBy: string,
    ){}
}