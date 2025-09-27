import { TopicGetAllResponse } from "../dtos/responses";

export const getAllTopics = async ( setTopics: React.Dispatch<React.SetStateAction<TopicGetAllResponse[]>> ): Promise<void> => {
    try {
        const response = await fetch("http://localhost:8080/api/topic");
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
