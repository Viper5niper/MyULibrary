import fs from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { isValidUrl } from '../utils/utils';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-40_]+$/, 'is invalid'],
      index: true,
    },
    lastname: {
      type: String,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-40_]+$/, 'is invalid'],
      index: true,
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      maxlength: 60,
    },
    avatar: String,
    role: { type: String, default: 'STUDENT' },
    bio: String,
    // google
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    // fb
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    withdrawals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Withdrawal' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true },
);

console.log(join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH));

userSchema.methods.toJSON = function () {
  // if not exists avatar1 default
  const absoluteAvatarFilePath = `${join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH)}${this.avatar}`;
  const avatar = isValidUrl(this.avatar)
    ? this.avatar
    : fs.existsSync(absoluteAvatarFilePath)
    ? `${process.env.IMAGES_FOLDER_PATH}${this.avatar}`
    : `${process.env.IMAGES_FOLDER_PATH}avatar2.jpg`;

  return {
    id: this._id,
    provider: this.provider,
    email: this.email,
    username: this.username,
    firstname: this.firstname,
    lastname: this.lastname,
    avatar: avatar,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      expiresIn: '12h',
      id: this._id,
      provider: this.provider,
      email: this.email,
    },
    secretOrKey,
  );
  return token;
};

userSchema.methods.registerUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (errh, hash) => {
      if (err) {
        console.log(err);
      }
      // set pasword to hash
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// const delay = (t, ...vs) => new Promise(r => setTimeout(r, t, ...vs)) or util.promisify(setTimeout)

export async function hashPassword(password) {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  });

  return hashedPassword;
}

export const validateUser = (user) => {
  const schema = {
    avatar: Joi.any(),
    firstname: Joi.string().min(2).max(100).required(),
    lastname: Joi.string().min(2).max(100).required(),
    username: Joi.string()
      .min(2)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/)
      .required(),
    role: Joi.string().valid('STUDENT', 'ADMIN', ''),
    password: Joi.string().min(6).max(20).allow('').allow(null),
  };

  return Joi.validate(user, schema);
};

const User = mongoose.model('User', userSchema);

export default User;
