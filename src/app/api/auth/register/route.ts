import { generateToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User.model";
import { ApiResponse } from "@/types/api.types";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try{
        await connectDB();
        let body: RegisterBody = await req.json();
        let { email, name, password, mobile } = body;

        if (!email || !name || !password ) {
            return NextResponse.json<ApiResponse>({
               success:false,
               message:"All fields are required"
            },{
                status:400
            })
        };

        let isExisted = await UserModel.findOne({ email });
        if(isExisted){
             return NextResponse.json<ApiResponse>({
               success:false,
               message:"User already exists"
            },{
                status:409
            })
        };

        let newUser = await UserModel.create({ 
            email, name, password, mobile 
        });
       let token = generateToken({userId:newUser._id.toString()});

       let response = NextResponse.json<ApiResponse>({
        success:true,
        message:"User registered successfully",
        data:{
            user:{
               _id:newUser._id,
               email:newUser.email,
               name:newUser.name,
            },
                
            }
        },{
            status:201
        });
        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        return response;
    } catch (error) {
       console.log("Error in register route:", error);
       return NextResponse.json<ApiResponse>({
        success:false, message:"something went wrong", error:{
            error
        }
       },{
        status:500
       })
    }
}