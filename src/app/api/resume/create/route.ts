
import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import next from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const UserId = await getCurrentUser();

        const newResume = await ResumeModel.create({
            user_id: UserId,
            title: "",
            summary: "",
            personalInfo: {},
            workExperience: [],
            projects: [],
            skills: [],
            education: [],
            certifications: []
        });

        return NextResponse.json<ApiResponse>({
            message: "Resume created successfully",
            success: true,
            data: newResume
        }, { status: 201 });

    } catch (error) {
        console.log("Error creating resume:", error);
        return NextResponse.json<ApiResponse>({
            message: "Error creating resume",
            success: false,
        }, { status: 500 });

    }
}