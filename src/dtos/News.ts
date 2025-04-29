export interface NewsCreateDto {
    title: string;
    description: string;
    image: string;
    link: string;
    date: string;
    subtopic_ids: number[];
}

export interface NewsResponseDto {
    id: number;
    title: string;
    description: string;
    image: string;
    date: string;
    link?: string;
    subtopics: { name: string }[]; // ⬅️ Agregado
    user: {
      username: string;
      avatar: string;
    };
  }
  