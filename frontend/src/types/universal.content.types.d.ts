// Tag types for universal usage
export interface Tag {
  text: string;
  icon?: ReactNode;
  prefix?: string;
  customColor?: string;
  customBgColor?: string;
}

// Detail item (used for metadata like date, location, etc.)
export interface DetailItem {
  text: string;
  icon?: ReactNode;
}

// Content card types for universal usage
export interface UniversalCardProps {
  title: string;
  description?: string;
  image?: {
    src: string;
    alt?: string;
    fallbackLetter?: boolean;
    overlay?: ReactNode;
    aspectRatio?: "square" | "video" | "auto" | number;
  };
  badges?: Badge[];
  tags?: Tag[];
  details?: DetailItem[];
  actionButton?: {
    text: string;
    onClick?: (e: React.MouseEvent) => void;
    isProduct?: boolean;
  };
  variant?: "vertical" | "horizontal";
  size?: "small" | "medium" | "large";
  hoverEffect?: boolean;
  onClick?: () => void;
  className?: string;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  cornerElement?: ReactNode;
}

// Badge types for universal usage
export interface Badge {
  text: string;
  type?:
    | "primary"
    | "success"
    | "warning"
    | "info"
    | "danger"
    | "neutral"
    | string;
  icon?: ReactNode;
  customColor?: string;
  customBgColor?: string;
}
