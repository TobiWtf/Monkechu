class storage {
    constructor () {
        this._store = require("electron-store");
        this._storage = new this._store();
    };

    async SetLogin(email, secret, token) {

        this._storage.set(
            {
                login: {
                    secret: secret,
                    token: token,
                    email: email,
                },
            },
        );

        return this;

    };

    async GetLogin() {

        let email = this._storage.get(
            "login.email",
        );

        let secret = this._storage.get(
            "login.secret",
        );
        
        let token = this._storage.get(
            "login.token",
        );

        return {
            email: email,
            secret: secret,
            token: token,
        };
    };

    async clear() {
        this._storage.clear();
    };
};

module.exports = storage;