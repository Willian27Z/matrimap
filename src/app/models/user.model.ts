// This model is only for user authentication purposes, mainly for profile id and token to be used in API calls
export class User {
    constructor(
        // These are the properties I want to store locally about the user

        // public properties can be changed and accessed freely
        public email: string,
        public id: string,
        public username: string,
        public admin: boolean,
        // private properties need getter/setter functions to be accessed/changed
        private _token: string,
        private _expiresIn: Date
    ){}

    get token() {
        // Check if token is not expired
        if(!this._expiresIn || new Date() > this._expiresIn){
            return null;
        }
        return this._token;
    }
}