import Joi from 'joi';
import mongoose from 'mongoose';
import { User } from '../models';
import { attemptLogin, logoutUser } from '../Auth';
import { UserInputError } from 'apollo-server-express';
import { registerValidate, loginValidate } from '../schemas';

export default {
    Query: {
        me: async (root, args, { req }, info) => {
            return await User.findById(req.session.userId);
        },

        users: async (root, args, { req }, info) => {
            // TODO: projection, pagination, sanitization
            return await User.find({});
        },

        user: async (root, { id }, { req }, info) => {
            // TODO: projection, sanitization
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new UserInputError(`${id} is not a valid user ID.`)
            }
            return await User.findById(id);
        }
    },

    Mutation: {
        register: async (root, args, { req }, info) => {
            await Joi.validate(args, registerValidate, { abortEarly: false })
            const user = await User.create(args);
            req.session.userId = user.id
            return user;
        },

        login: async (root, args, { req }, info) => {
            await Joi.validate(args, loginValidate, { abortEarly: false });
            const user = await attemptLogin(args);
            req.session.userId = user.id
            return user;
        },

        logout: (root, args, { req, res }, info) => {
            return logoutUser(req, res)
        }
    }
}