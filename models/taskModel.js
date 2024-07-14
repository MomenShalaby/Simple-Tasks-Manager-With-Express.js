const mongoose = require("mongoose");

const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "list"],
      required: true,
    },
    body: String,
    is_shared: {
      type: Boolean,
      default: false,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    list: [{ type: Schema.Types.ObjectId, ref: "Task.List" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
