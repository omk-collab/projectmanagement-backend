import mongoose, { Schema } from "mongoose";
import { Project } from "./project.models";

const projectNotSchema = new Schema(
    {
        Project:{
            type: Schema.Types.ObjectId,
            ref:"Project",
            required: true,
        },
        CreatedBy:{
            type: Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        content:{
            type: String,
            required: true
        }
    },
    {timestamps=true},

);

export const ProjectNote = mongoose.model("ProjectNote",projectNotSchema);