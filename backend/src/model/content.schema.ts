import moongose, { model, Schema, Types } from "mongoose";

const contentTypes = ["image", "video", "article", "audio"];

const ObjectId = Types.ObjectId;

const contentSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  userId: { type: ObjectId, required: true, ref: "User" },
  tags: [{ type: ObjectId, required: true, ref: "Tag" }],
});

export const contentModel = model("content", contentSchema);
