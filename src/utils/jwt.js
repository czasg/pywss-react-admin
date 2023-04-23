class JWT {
    clear() {
        localStorage.removeItem('jwtToken');
    }

    getJWT() {
        return localStorage.getItem('jwtToken')
    }

    getToken() {
        let token = {};
        let valid = false;
        try {
            const jwtToken = this.getJWT();
            if (jwtToken === null) {
                return {token, valid}
            }
            const tokens = jwtToken.split('.');
            if (tokens.length !== 3) {
                return {token, valid}
            }
            token = JSON.parse(decodeURIComponent(escape(window.atob(tokens[1]))));
            if (token.exp < parseInt(`${new Date().getTime() / 1000}`)) {
                return {token, valid}
            }
            valid = true;
            return {token, valid}
        } catch (e) {
            console.log(e);
            return {token, valid}
        }
    }
}

export default new JWT();
