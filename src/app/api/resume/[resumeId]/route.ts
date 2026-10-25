
import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

type RouteContext = {
  params: Promise<{ resumeId: string }>;
};

// GET: Fetch a single resume
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    // getCurrentUser() returns the user ID directly
    const userId = await getCurrentUser();
    const { resumeId } = await params;

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User ID not found",
        },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid resume ID",
        },
        { status: 400 }
      );
    }

    const resume = await ResumeModel.findOne({
      _id: resumeId,
      user_id: userId,
    });

    if (!resume) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume not found or access denied",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume fetched successfully",
        data: resume,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET RESUME ERROR:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to fetch resume",
      },
      { status: 500 }
    );
  }
}

// PATCH: Update a single resume
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    // getCurrentUser() returns the user ID directly
    const userId = await getCurrentUser();
    const { resumeId } = await params;

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User ID not found",
        },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid resume ID",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updatedResume = await ResumeModel.findOneAndUpdate(
      {
        _id: resumeId,
        user_id: userId,
      },
      {
        $set: body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedResume) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume not found or access denied",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume updated successfully",
        data: updatedResume,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH RESUME ERROR:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to update resume",
      },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const userId = await getCurrentUser();
    const { resumeId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid resume ID" },
        { status: 400 }
      );
    }

    const deletedResume = await ResumeModel.findOneAndDelete({
      _id: resumeId,
      user_id: userId,
    });

    if (!deletedResume) {
      return NextResponse.json(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Resume deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete resume error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete resume" },
      { status: 500 }
    );
  }
}