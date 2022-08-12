import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const withdrawalSchema = new Schema(
  {
    returned: { type: Boolean, default: false },
    quantity: { type: Number },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

withdrawalSchema.methods.toJSON = function () {
  return {
    id: this._id,
    quantity: this.quantity,
    returnedDate: this.returnedDate,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    book: this.book.toJSON(),
    user: this.user.toJSON(),
  };
};

export const validateWithdrawal = (withdrawal) => {
  const schema = {
    quantity: Joi.number().required().min(1),
    book: Joi.required(),
    user: Joi.string(),
  };
  return Joi.validate(withdrawal, schema);
};

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

export default Withdrawal;
