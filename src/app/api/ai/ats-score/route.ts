import { generateAiContent } from "@/app/gimini";
import {   ImproveContentBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const{resumeText } = body;

        if (!resumeText) {
            return NextResponse.json<ApiResponse>({
                message: "Missing required fields",
                success: false,
            }, { status: 400 });
        } // ✅ CLOSED THE 'if' STATEMENT HERE

    


const prompt = `
You are an expert Applicant Tracking System (ATS) evaluator and professional resume analyst.

Analyze the following resume text and calculate an ATS compatibility score out of 100.

Resume Text:
${resumeText}

Evaluation Criteria:
1. Resume Structure and Formatting: 20 points
   - Clear sections, headings, and logical organization.
2. Skills and Technical Keywords: 25 points
   - Relevant skills, technical terminology, and industry keywords.
3. Work Experience and Projects: 20 points
   - Clear responsibilities, technical contributions, and relevant details.
4. Professional Summary: 15 points
   - Clarity, relevance, and effectiveness of the summary.
5. Education and Qualifications: 10 points
   - Clear educational details and relevant qualifications.
6. Grammar and Readability: 10 points
   - Correct grammar, concise writing, and professional language.

Rules:
1. Calculate the score based only on the provided resume text.
2. Return an integer score between 0 and 100.
3. Evaluate missing sections fairly based on the candidate's experience level when it can be reasonably inferred.
4. Do not penalize freshers for lacking professional work experience when relevant projects or academic experience demonstrate their skills.
5. Do not invent missing information or assume qualifications that are not present.
6. Identify the resume's key strengths and the most important areas for improvement.
7. Provide actionable suggestions to improve the resume's ATS compatibility.
8. Be objective, consistent, and constructive.
9. Do not claim that the score guarantees passing an actual ATS screening. Real ATS results depend on the job description, employer settings, and parsing software.
10. Return valid JSON only. Do not include markdown code fences or text outside the JSON object.

Required JSON Format:
{
  "atsScore": 75,
  "strengths": [
    "Clear technical skills section",
    "Relevant projects demonstrating practical knowledge"
  ],
  "weaknesses": [
    "Professional summary could be more targeted",
    "Some project descriptions lack specific technical details"
  ],
  "suggestions": [
    "Tailor the resume keywords to the target job description",
    "Improve project descriptions by clarifying technical contributions"
  ]
}

IMPORTANT:
The example score and feedback above are illustrative only. Evaluate the actual resume independently. Ensure atsScore is an integer from 0 to 100, strengths, weaknesses, and suggestions are arrays of strings, and the entire response is valid JSON.
`;
        const result = await generateAiContent(prompt);
        const AtsScore = result;

        return NextResponse.json<ApiResponse>({
            message: "AtsScore generated successfully",
            success: true,
            data: { AtsScore }
        }, { status: 201 });

    } catch (error) {
        console.log("Error generate AtsScore :", error);
        return NextResponse.json<ApiResponse>({
            message: "Error creating resume",
            success: false,
        }, { status: 500 });
    }
}
