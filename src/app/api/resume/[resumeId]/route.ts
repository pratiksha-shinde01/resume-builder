import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req:NextRequest, {params}:{params :Promise <{ resumeId:string }> }){
    try {
        
        await connectDB()

        const user = await getCurrentUser();

        const {resumeId} = await params;

        const resume = await ResumeModel.findOne({
            _id:resumeId,
            user_id: user.userId
        })

        if(!resume) return NextResponse.json<ApiResponse>({
            success: false,
            message:"resume not found "
        } ,{ status: 404}
    );

    return NextResponse.json<ApiResponse>({
        success: true,
        message:"succsessfully fetched resume",
        data: resume
    }, {status: 200})


    } catch (error) {
        console.log("error in get resume api", error);
         return NextResponse.json<ApiResponse>({
                    message: "Error creating resume",
                    success: false,
                }, { status: 500 });
    }
}