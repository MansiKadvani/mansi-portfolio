import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroStackHighlights: string[];
  aboutBioParagraphs: string[];
  githubUsername?: string;
  leetcodeUsername?: string;
  linkedinUrl?: string;
  githubRepos?: number;
  githubCommits?: number;
  githubStars?: number;
  githubFollowers?: number;
  leetcodeSolved?: number;
  leetcodeStreak?: number;
  leetcodeBadges?: number;
  aboutMetrics: Array<{ label: string; value: string; percentage: number }>;
  aboutTimeline: Array<{ year: string; title: string; desc: string }>;
  experiences: Array<{
    period: string;
    type: string;
    title: string;
    company: string;
    icon: string;
    highlights: string[];
  }>;
  achievements: Array<{
    title: string;
    issuer: string;
    desc: string;
    icon: string;
    date: string;
  }>;
}

const ProfileSchema: Schema = new Schema(
  {
    heroTitle: { type: String, required: true },
    heroSubtitle: { type: String, required: true },
    heroDescription: { type: String, required: true },
    heroStackHighlights: { type: [String], required: true },
    aboutBioParagraphs: { type: [String], required: true },
    githubUsername: { type: String, default: "" },
    leetcodeUsername: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    githubRepos: { type: Number, default: 9 },
    githubCommits: { type: Number, default: 22 },
    githubStars: { type: Number, default: 0 },
    githubFollowers: { type: Number, default: 1 },
    leetcodeSolved: { type: Number, default: 14 },
    leetcodeStreak: { type: Number, default: 5 },
    leetcodeBadges: { type: Number, default: 1 },
    aboutMetrics: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        percentage: { type: Number, required: true },
      }
    ],
    aboutTimeline: [
      {
        year: { type: String, required: true },
        title: { type: String, required: true },
        desc: { type: String, required: true },
      }
    ],
    experiences: [
      {
        period: { type: String, required: true },
        type: { type: String, required: true },
        title: { type: String, required: true },
        company: { type: String, required: true },
        icon: { type: String, required: true },
        highlights: { type: [String], required: true },
      }
    ],
    achievements: [
      {
        title: { type: String, required: true },
        issuer: { type: String, required: true },
        desc: { type: String, required: true },
        icon: { type: String, required: true },
        date: { type: String, required: true },
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
