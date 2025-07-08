import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import ProfessionalServiceModel from "@/model/ProfessionalService";
import ProfessionalModel from "@/model/Professional";

export async function GET(){
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || session.user.activeRole !== "PROFESSIONAL"){
      return Response.json({
        success: false,
        message: "Not Authenticated"
      }, {status: 400})
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    const professional = await ProfessionalModel.findOne(
      {userId: userId},
      {_id: 1}
    )

    if(!professional){
      return Response.json({
        success: false,
        message: "Professional not found"
      }, {status: 400})
    }

    // const professionalServices = await ProfessionalServiceModel.find({professionalId: professional._id})
    const professionalServices = await ProfessionalServiceModel.aggregate([
      {
        $match: {professionalId: professional._id}
      },
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "matchedServices"
        }
      },
      {
        $addFields: {
          matchedServices: {$arrayElemAt: ["$matchedServices", 0]}
        }
      }
    ])

    if(!professionalServices){
      return Response.json({
        success: false,
        message: "Services not found, Please add services first"
      }, {status: 400})
    }

    return Response.json({
        success: true,
        message: professionalServices
      }, {status: 200})


  } catch (error) {
    console.error("An unknown error occured", error)
    return Response.json({
        success: false,
        message: "Internal server error"
      }, {status: 400})
  }
}