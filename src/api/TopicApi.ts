import { Topic } from "../models/Topic";

export const GetAllTopics = async (setTopics: React.Dispatch<React.SetStateAction<Topic[]>>): Promise<void> => {
  try {
    const response = await fetch("http://localhost:8080/api/topic");
    const data = await response.json();

    const formattedTopics = data.map((topic: any) => ({
      id: topic.id,
      name: topic.name,
      subtopics: topic.subtopic.map((sub: any) => ({
        id: sub.ID,
        name: sub.Name,
      })),
    }));

    setTopics(formattedTopics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    setTopics([]);
  }
};
