import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getModelResponse = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: prompt }
            ],
        });
        console.log("response", response.usage, response.choices[0].finish_reason);
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        throw error;
    }
};

export default getModelResponse;
