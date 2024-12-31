export const maxDuration = 60;
import { NextRequest, NextResponse } from 'next/server';
import fetchSurveyPrompt from '@/helpers/fetchSurveyPrompt';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const POST = async (req) => {
    const { surveyQuestions, characteristics, individuals } = await req.json();
    
    try {
        const stream = new ReadableStream({
            async start(controller) {
                await getModelResponse(fetchSurveyPrompt(surveyQuestions, characteristics, individuals), (chunk) => {
                controller.enqueue(new TextEncoder().encode(chunk));
              });
              controller.close();
            },
          });
      
          return new Response(stream, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "Connection": "keep-alive",
            },
          });
        
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

const getModelResponse = async (prompt,onChunk) => {
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: prompt }
            ],
            temperature: 0.1,
            stream: true,
        });
    
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            onChunk(content); 
          }
        }
    } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        throw error;
    }
};