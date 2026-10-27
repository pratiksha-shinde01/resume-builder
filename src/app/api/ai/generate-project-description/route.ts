import { generateAiContent } from "@/app/gimini";
import { GenerateProjrctDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateProjrctDescriptionBody = await req.json();

    const {
      projectTitle,
      experienceLevel,
      jobTitle,
      techStack,
    } = body;

    // Validate required fields
    if (
      !projectTitle?.trim() ||
      !experienceLevel?.trim() ||
      !jobTitle?.trim() ||
      !Array.isArray(techStack) ||
      techStack.length === 0 ||
      !techStack.every(
        (technology) =>
          typeof technology === "string" && technology.trim().length > 0
      )
    ) {
      return NextResponse.json<ApiResponse>(
        {
          message: "Please provide project title, experience level, job role, and tech stack.",
          success: false,
        },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert resume writer and ATS optimization specialist.

Generate a professional, ATS-friendly project description using the following details:

Project Title: ${projectTitle.trim()}
Experience Level: ${experienceLevel.trim()}
Target Job Role: ${jobTitle.trim()}
Tech Stack: ${techStack.map((technology) => technology.trim()).join(", ")}

Rules:
1. Return ONLY the project description as plain text.
2. Write between 50 and 80 words, inclusive.
3. Describe the project identified by the provided project title.
4. Tailor the description to the target job role and experience level.
5. Naturally incorporate relevant technical keywords from the provided tech stack.
6. Use professional action verbs such as Developed, Built, Implemented, and Integrated where appropriate.
7. Do not invent specific features, achievements, performance metrics, or business results.
8. Do not assume functionality based only on the project title. If exact features are not provided, describe the project conservatively.
9. Do not claim professional experience or expertise that was not provided.
10. Avoid generic filler, keyword stuffing, repetition, and exaggerated claims.
11. Use clear, concise, grammatically correct language suitable for a resume.
12. Do not include headings, bullet points, introductions, explanations, or word counts.
13. Verify that the description contains 50-80 words before responding.

IMPORTANT:
Return ONLY the final project description. Do not return JSON, markdown, quotation marks, or additional text.
`;

    const result = await generateAiContent(prompt);

    const projectDescription =
      typeof result === "string" ? result.trim() : "";

    if (!projectDescription) {
      return NextResponse.json<ApiResponse>(
        {
          message: "AI could not generate a project description. Please try again.",
          success: false,
        },
        { status: 502 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        message: "Project description generated successfully",
        success: true,
        data: {
          projectDescription,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating project description:", error);

    return NextResponse.json<ApiResponse>(
      {
        message: "Error generating project description",
        success: false,
      },
      { status: 500 }
    );
  }
}