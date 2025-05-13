export interface NewsCreateDto {
  title: string;
  image: string;
  description: string;
  link: string;
  date: string;
  subtopic_ids: number[];
}

export interface NewsResponseDto {
  id: number;
  title: string;
  image: string;
  description: string;
  date: string;
  link?: string;
  subtopics: { name: string }[];
  user: {
    avatar: string;
    regular_user?: {
      name: string;
    };
    university_user?: {
      name: string;
    };
    business_user?: {
      name: string;
    };
  };
}
