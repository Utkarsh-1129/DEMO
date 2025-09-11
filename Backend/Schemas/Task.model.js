import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    agri:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agri",
        required: true, 
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ["pending","in-progress","completed"],
        default: "pending",
    }
},
{
    timestamps: true,
});

const Task =  mongoose.model("Task", TaskSchema);
export default Task;    