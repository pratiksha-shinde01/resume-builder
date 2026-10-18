import { generateAiContent } from "@/app/gimini";
import { GenerateProjrctDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function POST(req: NextRequest) {
    try {
        const body:GenerateProjrctDescriptionBody = await req.json();
        const{ experienceLevel,  jobTitle , techStack} = body;

        if (!experienceLevel  || !jobTitle|| !techStack ) {
            return NextResponse.json<ApiResponse>({
                message: "Missing required fields",
                success: false,
            }, { status: 400 });
        } // ✅ CLOSED THE 'if' STATEMENT HERE

        // This block now executes correctly outside of the if condition
const prompt = `
You are an expert resume writer and ATS optimization specialist.

Generate a professional, ATS-friendly project description using the following details:

Experience Level: ${experienceLevel}
Job Title: ${jobTitle}
Tech Stack: ${techStack.join(", ")}

Rules:
1. Return ONLY the project description as plain text.
2. Write between 50 and 80 words, inclusive.
3. Tailor the description to the given job type and experience level.
4. Naturally incorporate relevant technical keywords from the provided tech stack.
5. Explain the general technical purpose and potential functionality of a project relevant to the job type.
6. Use professional action verbs such as Developed, Built, Implemented, and Integrated where appropriate.
7. Do not invent specific project names, features, achievements, performance metrics, or business results.
8. Do not claim professional experience or expertise that was not provided.
9. Avoid generic filler, keyword stuffing, repetition, and exaggerated claims.
10. Use clear, concise, grammatically correct language suitable for a resume.
11. Do not include headings, bullet points, introductions, explanations, or word counts.
12. Verify that the description contains 50-80 words before responding.

IMPORTANT:
Return ONLY the final project description. Do not return JSON, markdown, quotation marks, or any additional text.
`;
        const result = await generateAiContent(prompt);
        let projectDescription = result;

       
        return NextResponse.json<ApiResponse>({
            message: "projectDescription generated successfully",
            success: true,
            data: { projectDescription }
        }, { status: 201 });

    } catch (error) {
        console.log("Error generate projectDescription :", error);
        return NextResponse.json<ApiResponse>({
            message: "Error creating projectDescription",
            success: false,
        }, { status: 500 });
    }
}
