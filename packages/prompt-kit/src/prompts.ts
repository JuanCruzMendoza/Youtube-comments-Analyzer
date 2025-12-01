export const ANALYSIS_PROMPT = `
You are an expert YouTube comment analyst. Your goal is to analyze the following comments and provide a structured summary.

Comments:
{{comments}}

Please provide a JSON response with the following structure:
{
  "summary": "A narrative summary of the general sentiment and main topics (markdown supported).",
  "clusters": [
    {
      "label": "Short label for the theme",
      "category": "praise" | "critique" | "recommendation" | "debate" | "other",
      "frequency": number (percentage 0-100),
      "sentimentSummary": {
        "positive": number (0-100),
        "neutral": number (0-100),
        "negative": number (0-100)
      },
      "examples": ["quote 1", "quote 2"],
      "recommendations": ["actionable advice"]
    }
  ]
}
`;

export interface AnalysisResponse {
   summary: string;
   clusters: {
      label: string;
      category: "praise" | "critique" | "recommendation" | "debate" | "other";
      frequency: number;
      sentimentSummary: {
         positive: number;
         neutral: number;
         negative: number;
      };
      examples: string[];
      recommendations?: string[];
   }[];
}
