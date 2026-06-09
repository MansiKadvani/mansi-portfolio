export interface ProjectType {
  _id?: string;
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

export interface SkillType {
  _id?: string;
  name: string;
  category: "languages" | "frontend" | "backend" | "database" | "ai-ml" | "tools" | "core-cs";
  iconName: string;
  isPopular: boolean;
}

export interface ContactProgressType {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
}

export interface DbStatusType {
  isConnected: boolean;
  isFallback: boolean;
  type: string;
}

export interface AdminStatsType {
  contactsTotal: number;
  contactsUnread: number;
  projectsCount: number;
  skillsCount: number;
}
