export const maxDuration = 30;
import { NextResponse } from 'next/server';
import getModelResponse from '@/utils/getModelResponse';
import fetchSurveyPrompt from '@/helpers/fetchSurveyPrompt';


export const POST = async (req, res) => {
  try {
    const { surveyQuestions,individuals, characteristics } = await req.json();

    // Generate AI Responses
    const results = await getModelResponse(fetchSurveyPrompt(surveyQuestions, characteristics, individuals));

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}