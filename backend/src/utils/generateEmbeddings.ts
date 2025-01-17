import { pipeline } from "@xenova/transformers";


const generateEmbeddings = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  
export const getEmbedding = async (text: string) => {
    const output1 = await generateEmbeddings(text, {
      pooling: "mean",
      normalize: true,
    });
  
    return Array.from(output1.data);
  };