export class Profile {
    constructor(
        // These are the properties I want to store locally
        // All the user profile will be stored in this properties
        // Need to match database structure to facilitate receiving info
        public userID: string,
        public pseudo: string,
        public nom: string,
        public prenom: string,
        public email: string,
        public age: number,
        public genre: string,
        public coordonees: string,
        public avatar: string,
        public presentation: string,
        public friend: string,
        public friendSince: Date,
        public recommendedBy: string,
        // public preferences: {
        //     notifications: {
        //         privateMessage: boolean,
        //         newScrapbookPost: boolean,
        //         friendRecommendation: boolean,
        //         discussionInvitation: boolean,
        //         friendRequest: boolean,
        //     },
        //     privacite: {
        //         prenom: boolean,
        //         nom: boolean,
        //         age: boolean,
        //         genre: boolean,
        //         adresse: boolean,
        //         scrapbook: boolean
        //     }
        // },
    ){}
}