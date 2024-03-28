// we will have a general middleware, that will check for every request from client : means not for any specific bundle of routes

const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) return next();

        try{
            const userpayload = validateToken(tokenCookieValue);
            req.user = userpayload;
        }catch(error) {}
        next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
}