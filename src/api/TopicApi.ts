import { TopicGetAllResponse } from "../dtos/responses";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/topic`;

export const getAllTopics = async ( setTopics: React.Dispatch<React.SetStateAction<TopicGetAllResponse[]>> ): Promise<void> => {
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();

        const formattedTopics = data.map((topic: any) => ({
        id: topic.id,
        name: topic.name,
        subtopics: topic.subtopics.map((sub: any) => ({
            id: sub.id,
            name: sub.name,
        })),
        }));

        setTopics(formattedTopics);
    } catch (error) {
        console.error("Error fetching topics:", error);
        setTopics([]);
    }
};
