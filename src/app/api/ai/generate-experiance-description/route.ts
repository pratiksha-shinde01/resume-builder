import { generateAiContent } from "@/app/gimini";
import { GenerateExperianceDescriptionBody,  } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function POST(req: NextRequest) {
    try {
        const body:GenerateExperianceDescriptionBody = await req.json();
        const{ experienceLevel,  yearsOfExperience , techStack, jobRole} = body;

        if (!experienceLevel  || !yearsOfExperience|| !techStack ||!jobRole) {
            return NextResponse.json<ApiResponse>({
                message: "Missing required fields",
                success: false,
            }, { status: 400 });
        } // ✅ CLOSED THE 'if' STATEMENT HERE

        // This block now executes correctly outside of the if condition
const prompt = `
You are an expert resume writer and ATS optimization specialist.

Generate a professional, ATS-friendly work experience description using the following details:

Experience Level: ${experienceLevel}
Years of Experience: ${yearsOfExperience}
Tech Stack: ${techStack.join(", ")}
Job Role: ${jobRole}

Rules:
1. Return ONLY the final work experience description as plain text.
2. Write between 50 and 80 words, inclusive.
3. Tailor the description to the specified job role and experience level.
4. Naturally incorporate relevant technologies and ATS-friendly keywords from the provided tech stack.
5. Use strong action verbs such as Developed, Implemented, Built, Maintained, and Optimized where appropriate.
6. Ensure the responsibilities described are appropriate for the specified years of experience.
7. Never invent specific achievements, performance metrics, projects, or business results.
8. Do not claim expertise in technologies beyond what is provided.
9. Avoid generic filler, keyword stuffing, repetition, and exaggerated claims.
10. Use clear, concise, professional, grammatically correct language.
11. Do not include headings, bullet points, introductions, explanations, or word counts.
12. Verify that the description contains 50–80 words before responding.

IMPORTANT:
Return ONLY the final description as plain text. Do not return JSON, markdown, quotation marks, or any additional text.
`;
        const result = await generateAiContent(prompt);
        let workExperianceDescription = result;

       
        return NextResponse.json<ApiResponse>({
            message: "workExperianceDescription generated successfully",
            success: true,
            data: { workExperianceDescription }
        }, { status: 201 });

    } catch (error) {
        console.log("Error generate workExperianceDescription :", error);
        return NextResponse.json<ApiResponse>({
            message: "Error creating workExperianceDescription",
            success: false,
        }, { status: 500 });
    }
}
