import { generateAiContent } from "@/app/gimini";
import { GenerateSummary } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body:GenerateSummary = await req.json();
        const{ experienceLevel, skills, jobTitle } = body;

        if (!experienceLevel || !skills || !jobTitle) {
            return NextResponse.json<ApiResponse>({
                message: "Missing required fields",
                success: false,
            }, { status: 400 });
        } // ✅ CLOSED THE 'if' STATEMENT HERE

        // This block now executes correctly outside of the if condition
        const prompt = `
You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist.

Generate a professional, ATS-friendly resume summary using these details:

Experience Level: ${experienceLevel}
Job Title: ${jobTitle}
Skills: ${skills.join(", ")}

Rules:
1. Return ONLY the final resume summary as plain text.
2. Write a minimum of 50 words and a maximum of 80 words.
3. Do not include a heading, introduction, explanation, bullet points, or additional text.
4. Naturally incorporate relevant skills and job-specific keywords for ATS compatibility.
5. Tailor the summary to the given job title and experience level.
6. For freshers, emphasize technical skills, relevant projects, foundational knowledge, and willingness to learn without claiming professional experience.
7. Never invent work experience, qualifications, certifications, achievements, or skills.
8. Use professional, clear, concise, and grammatically correct language.
9. Avoid keyword stuffing, generic clichés, repetition, and exaggerated claims.
10. Before responding, verify that the summary contains between 50 and 80 words. If it exceeds 80 words, rewrite it to fit within the limit.

IMPORTANT: Output ONLY the resume summary. Do not include the word count, quotation marks, markdown formatting, or any text before or after the summary.
`;
        const result = await generateAiContent(prompt);
        const summary = result;

        return NextResponse.json<ApiResponse>({
            message: "Summary generated successfully",
            success: true,
            data: { summary }
        }, { status: 201 });

    } catch (error) {
        console.log("Error generate summary :", error);
        return NextResponse.json<ApiResponse>({
            message: "Error creating resume",
            success: false,
        }, { status: 500 });
    }
}
