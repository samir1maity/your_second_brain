import mongoose, { model, Schema, Types } from "mongoose";

const tagSchema = new Schema({
  title: { type: String, required: true, unique: true },
});

export const tagModel = model("tag", tagSchema);

