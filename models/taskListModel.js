const mongoose = require("mongoose");

const { Schema } = mongoose;

const TaskListSchema = new Schema(
  {
    task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task.List", TaskListSchema);
