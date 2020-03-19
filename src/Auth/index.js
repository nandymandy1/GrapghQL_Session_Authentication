import { User } from '../models';
import { SESSION_NAME } from '../config';
import { AuthenticationError } from "apollo-server-express"

const isAuth = req => req.session.userId;

export const checkSignedIn = (req) => {
    if (!isAuth(req)) {
        throw new AuthenticationError('You must be logged in.')
    }
}

export const checkSignedOut = (req) => {
    if (isAuth(req)) {
        throw new AuthenticationError('You must not be logged in.')
    }
}

export const attemptLogin = async ({ username, password }) => {
    const messsage = 'Incorrect username or password. Please try again.'
    const user = await User.findOne({ username });
    if (!user) {
        throw new AuthenticationError(messsage);
    }
    if (!await user.isMatch(password, user.password)) {
        throw new AuthenticationError(messsage);
    }
    return user;
}

export const logoutUser = (req, res) => new Promise(
    (resolve, reject) => {
        req.session.destroy(err => {
            if (err) reject(err)
            res.clearCookie(SESSION_NAME);
            resolve(true)
        });
    }
);