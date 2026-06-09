import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  problemSolved: string;
  techStack: string[];
  keyFeatures: string[];
  engineeringChallenges: string;
  githubUrl: string;
  liveUrl?: string;
  isFeatured: boolean;
  image: string;
  order: number;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    problemSolved: { type: String, required: true },
    techStack: { type: [String], required: true },
    keyFeatures: { type: [String], required: true },
    engineeringChallenges: { type: String, required: true },
    githubUrl: { type: String, required: true },
    liveUrl: { type: String },
    isFeatured: { type: Boolean, default: false },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
