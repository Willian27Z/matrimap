export class MyProfile {
    constructor(
        // These are the properties I want to store locally
        // All the user profile will be stored in this properties
        // Need to match database structure to facilitate receiving info
        public profil: {
            firstName: string,
            lastName: string,
            age: number,
            genre: string,
            address: string,
            avatar: string,
            presentation: string,
        },
        public prefs: {
            notifications: {
                privateMessage: boolean,
                newScrapbookPost: boolean,
                friendRecommendation: boolean,
                discussionInvitation: boolean,
                friendRequest: boolean,
            },
            private: {
                firstName: boolean,
                lastName: boolean,
                age: boolean,
                genre: boolean,
                address: boolean,
                scrapbook: boolean
            }
        },
    ){}
}