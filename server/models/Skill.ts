import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category: "languages" | "frontend" | "backend" | "database" | "ai-ml" | "tools" | "core-cs";
  iconName: string;
  isPopular: boolean;
}

const SkillSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["languages", "frontend", "backend", "database", "ai-ml", "tools", "core-cs"],
      required: true,
    },
    iconName: { type: String, required: true },
    isPopular: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
