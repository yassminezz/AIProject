import { GoogleGenAI, Type } from "@google/genai";
import { MindMapData, Language, DetailedSummary } from "../types.ts";

export const generateMindMapFromBase64 = async (base64Data: string, mimeType: string, language: Language): Promise<MindMapData> => {
  try {
    // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    // Using Flash 2.5 for efficiency with large documents
    const model = "gemini-2.5-flash";

    let langName = 'French';
    if (language === 'en') langName = 'English';
    if (language === 'ar') langName = 'Arabic';

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: `Analyze this document. Create a structured 'slideable mind map' summary in ${langName}. Identify the main topic. Then break the content down into 5-10 logical sequential cards (nodes). For each node, generate a short, unique string id. Each node should have a title, a brief 1-sentence summary, 3-4 distinct bullet points, and a category (concept, fact, formula, or example). Ensure all text is in ${langName}.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainTopic: { type: Type.STRING },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  keyPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  iconType: { 
                    type: Type.STRING,
                    enum: ['concept', 'fact', 'formula', 'example']
                  }
                },
                required: ['id', 'title', 'summary', 'keyPoints', 'iconType']
              }
            }
          },
          required: ['mainTopic', 'nodes']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as MindMapData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateDetailedSummary = async (mindMapData: MindMapData, language: Language): Promise<DetailedSummary> => {
  try {
    // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    const model = "gemini-2.5-flash";

    let langName = 'French';
    if (language === 'en') langName = 'English';
    if (language === 'ar') langName = 'Arabic';

    const promptText = `Based on the following mind map data, generate a detailed summary document in ${langName}. The document should have a concise introduction, a detailed section for each node expanding on its key points in well-structured paragraphs, and a concluding summary. Ensure all text is in ${langName}. Mind map data: ${JSON.stringify(mindMapData)}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: promptText }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introduction: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ['title', 'content']
              }
            },
            conclusion: { type: Type.STRING }
          },
          required: ['introduction', 'sections', 'conclusion']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI for summary generation");
    }

    return JSON.parse(text) as DetailedSummary;

  } catch (error) {
    console.error("Gemini API Error (Summary):", error);
    throw error;
  }
};
