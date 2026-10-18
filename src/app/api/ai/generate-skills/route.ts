import { generateAiContent } from "@/app/gimini";
import { GenerateSummary } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function POST(req: NextRequest) {
    try {
        const body:GenerateSummary = await req.json();
        const{ experienceLevel,  jobTitle } = body;

        if (!experienceLevel  || !jobTitle) {
            return NextResponse.json<ApiResponse>({
                message: "Missing required fields",
                success: false,
            }, { status: 400 });
        } // ✅ CLOSED THE 'if' STATEMENT HERE

        // This block now executes correctly outside of the if condition
        const prompt = `
You are an expert technical recruiter and ATS resume optimization specialist.

Generate 10-15 relevant technical skills for the following job profile.

Job Title: ${jobTitle}
Experience Level: ${experienceLevel}

Rules:
1. Generate ONLY technical skills, including programming languages, frameworks, libraries, databases, developer tools, and technical concepts.
2. Include relevant, industry-standard, ATS-friendly skills.
3. Exclude soft skills, personality traits, and non-technical skills.
4. Avoid duplicates and irrelevant technologies.
5. Suggest skills relevant to the job title and experience level.
6. Return the result as a RAW JSON ARRAY OF STRINGS.
7. Do NOT return an object with a "skills" property.
8. Do NOT convert the array into a string.
9. Do NOT escape the JSON array or include literal newline characters inside a string.
10. Do NOT include markdown code fences, explanations, headings, or any additional text.

CORRECT OUTPUT FORMAT:
["JavaScript (ES6+)", "React.js", "HTML5", "CSS3", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Git", "GitHub", "REST APIs"]

INCORRECT OUTPUT FORMATS:
{"skills": "[\\"JavaScript\\", \\"React.js\\"]"}
{"skills": ["JavaScript", "React.js"]}
"[ \\"JavaScript\\", \\"React.js\\" ]"

IMPORTANT: Return ONLY a valid JSON array. The response must begin with [ and end with ]. The array must be a JSON array data structure, not a string containing JSON.
`;
        const result = await generateAiContent(prompt);
        let skills = result;

        if (typeof skills === 'string') {
            try {
                skills = JSON.parse(skills);
            } catch (error) {
                console.log("Error parsing skills JSON:", error);
            }
        }
        return NextResponse.json<ApiResponse>({
            message: "Skills generated successfully",
            success: true,
            data: { skills }
        }, { status: 201 });

    } catch (error) {
        console.log("Error generate skills :", error);
        return NextResponse.json<ApiResponse>({
            message: "Error creating skills",
            success: false,
        }, { status: 500 });
    }
}
