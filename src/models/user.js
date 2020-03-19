import { hash, compare } from 'bcryptjs';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        validate: {
            validator: (email) => User.dontExist({ email }),
            message: ({ value }) => `Email ${value} has already been taken.`
        }
    },
    username: {
        type: String,
        validate: {
            validator: (username) => User.dontExist({ username }),
            message: ({ value }) => `Username ${value} has already been taken.`
        }
    },
    password: String,
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hash(this.password, 12);
    }
});

UserSchema.statics.dontExist = async function (options) {
    return await this.where(options).countDocuments() === 0;
}

UserSchema.methods.isMatch = async function (password) {
    return await compare(password, this.password);
}

const User = model('users', UserSchema);

export default User;