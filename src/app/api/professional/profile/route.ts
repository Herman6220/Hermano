import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import ProfessionalModel from "@/model/Professional";


export async function GET(){
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if(!session || !session.user || session.user.activeRole !== "PROFESSIONAL"){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await ProfessionalModel.findOne({userId: userId})
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 401})
        }

        return Response.json({
            success: true,
            message: user
        }, {status: 200})
    } catch (error) {
        console.log("An unexpected error occured", error)
        return Response.json(
                {
                    success: false,
                    message: "An unexpected error occured"
                },{status: 500}
            )
    }
}