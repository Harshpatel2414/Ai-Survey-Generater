import getModelResponse from '@/utils/getModelResponse';
import fetchSurveyPrompt from '@/helpers/fetchSurveyPrompt';
import { NextRequest, NextResponse } from 'next/server';

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
