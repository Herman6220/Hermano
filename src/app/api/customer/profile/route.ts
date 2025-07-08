import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import CustomerModel from "@/model/Customer";


export async function GET(){
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if(!session || !session.user || session.user.activeRole !== "CUSTOMER"){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id)
    console.log("User Id:", userId)

    try {
        const user = await CustomerModel.findOne({userId: userId})
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