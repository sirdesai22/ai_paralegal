// create tasks for given data using gemini api
// data will be in the form of array of objects
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  });

export const generateTasks = async (data: any) => {
    try {
        const prompt = `Create a list of tasks for ${data}.
        1. A structured list of tasks
        2. The task should be in a JSON format
        
        Format the response as a JSON object with the following structure:
        {
          name: string;
          type: string;
          priority: "High" | "Medium" | "Low";
          status: "in-progress" | "completed";
        }
          
        Ensure all data is valid and does not contain any errors. Return only raw JSON, no markdown or explanations. Do not halucinate any data.`;
  
        const response = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        if (!response) {
          console.error("No response from AI model");
          return "null";
        }
        const cleaned = response.text
          ?.replace(/^```json/, "")
          .replace(/^```/, "")
          .replace(/```$/, "")
          .trim();
        console.log(cleaned);
        const tasksData = JSON.parse(cleaned || "");
        console.log(tasksData);
        return tasksData as any;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to generate study materials";
        console.error("Error generating study materials:", errorMessage);
        return null;
      }
}
