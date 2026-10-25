
import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const userId = await getCurrentUser();

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const resumes = await ResumeModel.find({
      user_id: userId,
    }).sort({ updatedAt: -1 });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resumes fetched successfully",
        data: resumes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching resumes:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to fetch resumes",
      },
      { status: 500 }
    );
  }
}
