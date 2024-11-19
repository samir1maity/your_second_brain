import mongoose, { model, Schema } from "mongoose";

// const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
  username: { type: String, requird: true, unique: true },
  password: {type: String, required: true},
  firstName: String,
  lastName: String
});

export const userModel = model('user', userSchema)