
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";
import UserModel from "@/models/User.model";
import { NextResponse } from "next/server";

export async function GET() {
  let userId: string;

  try {
    userId = await getCurrentUser();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized. Please login again.",
      },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const user = await UserModel.findById(userId)
      .select("name email")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User fetched successfully.",
      data: {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Current user API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch user.",
      },
      { status: 500 }
    );
  }
}
