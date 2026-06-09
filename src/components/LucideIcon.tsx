import * as Icons from "lucide-react";

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function LucideIcon({ name, className = "", size = 20 }: LucideIconProps) {
  // Safely find the icon inside Lucide exports
  const IconComponent = (Icons as any)[name];
  
  if (!IconComponent) {
    // Return a default developer-themed Code icon if custom string isn't found
    const Fallback = Icons.Code;
    return <Fallback className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}

export default LucideIcon;
