export class Profile {
    constructor(
        // These are the properties I want to store locally
        // All the user profile will be stored in this properties
        // Need to match database structure to facilitate receiving info
        public pseudo: string,
        public nom: string,
        public prenom: string,
        public email: string,
        public age: number,
        public genre: string,
        public coordonees: string,
        //public photo: Buffer,
        public presentation: string,
        public preferences: {
            notifications: {
                demandeAmis: boolean,
                recommandationAmis: boolean,
                nouvelleMessagePrive: boolean,
                invitationDiscussion: boolean,
            },
            privacite: {
                voirProfile: string,
                posterPublication: string,
                envoyerMessagePrive: string,
                inviterDiscussion: string
            }
        },
    ){}
}