
import { generateAiContent } from "@/app/gimini";
import { GenerateExperianceDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateExperianceDescriptionBody = await req.json();

    const {
      experienceLevel,
      yearsOfExperience,
      techStack,
      jobRole,
    } = body;

    if (
      !experienceLevel?.trim() ||
      yearsOfExperience === undefined ||
      yearsOfExperience === null ||
      !Array.isArray(techStack) ||
      techStack.length === 0 ||
      !techStack.some(
        (technology) =>
          typeof technology === "string" &&
          technology.trim().length > 0
      ) ||
      !jobRole?.trim()
    ) {
      return NextResponse.json<ApiResponse>(
        {
          message: "Missing required fields",
          success: false,
        },
        { status: 400 }
      );
    }

    if (
      typeof yearsOfExperience !== "number" ||
      !Number.isFinite(yearsOfExperience) ||
      yearsOfExperience < 0
    ) {
      return NextResponse.json<ApiResponse>(
        {
          message: "Invalid years of experience",
          success: false,
        },
        { status: 400 }
      );
    }

    const technologies = techStack
      .filter(
        (technology): technology is string =>
          typeof technology === "string"
      )
      .map((technology) => technology.trim())
      .filter(Boolean);

    const prompt = `
You are an expert resume writer and ATS optimization specialist.

Generate a professional, ATS-friendly work experience description using:

Experience Level: ${experienceLevel}
Years of Experience: ${yearsOfExperience}
Tech Stack: ${technologies.join(", ")}
Job Role: ${jobRole.trim()}

Rules:
1. Return only the final description as plain text.
2. Write 50–80 words.
3. Tailor the description to the job role and experience level.
4. Naturally include relevant technologies and ATS-friendly keywords.
5. Use strong action verbs where appropriate.
6. Keep responsibilities appropriate to the experience level.
7. Never invent achievements, metrics, projects, or business results.
8. Do not claim skills beyond the provided tech stack.
9. Avoid generic filler and keyword stuffing.
10. Use clear, professional language.
11. Do not include headings, bullet points, or word counts.
12. For a fresher, describe relevant development responsibilities
    without falsely claiming previous employment.

Return only the description. No JSON or markdown.
`;

    const result = await generateAiContent(prompt);

    if (typeof result !== "string" || !result.trim()) {
      throw new Error("AI returned an empty description");
    }

    const workExperianceDescription = result.trim();

    return NextResponse.json<ApiResponse>(
      {
        message: "Work experience description generated successfully",
        success: true,
        data: { workExperianceDescription },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error generating work experience description:",
      error
    );

    return NextResponse.json<ApiResponse>(
      {
        message: "Error generating work experience description",
        success: false,
      },
      { status: 500 }
    );
  }
}
