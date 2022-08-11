import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

bookSchema.methods.toJSON = function () {
  return {
    id: this._id,
    title: this.title,
    author: this.author,
    year: this.year,
    genre: this.genre,
    stock: this.stock,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const validateBook = (message) => {
  const schema = {
    title: Joi.string().min(5).max(100).required(),
    author: Joi.string().min(5).max(100).required(),
    year: Joi.number().required(),
    genre: Joi.string().min(5).max(100).required(),
    stock: Joi.number().required(),
  };
  return Joi.validate(message, schema);
};

const Book = mongoose.model('Book', bookSchema);

export default Book;
