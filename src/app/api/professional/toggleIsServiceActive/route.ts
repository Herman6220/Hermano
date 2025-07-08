import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import ProfessionalServiceModel from "@/model/ProfessionalService";
import ProfessionalModel from "@/model/Professional";

export async function PATCH(request: Request){
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user:User = session?.user as User

  if(!session || !session.user || session.user.activeRole !== "PROFESSIONAL"){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
    //   const professional = await ProfessionalModel.findOne(
    //     {userId: userId},
    //     {_id: 1}
    //   )

    //   if(!professional){
    //     return Response.json({
    //         success: false,
    //         message: "No professional found"
    //     }, {status: 401})
    //   }

    //   const professionalService = await ProfessionalServiceModel.updateOne(
    //     {professionalId: professional._id},
    //     [
    //       {$set: {isServiceActive: {$not: "$isServiceActive"}}}
    //     ]
    //   )

    //   if(!professionalService){
    //     return Response.json({
    //         success: false,
    //         message: "Service active status could not be updated"
    //     }, {status: 401})
    //   }
      
    //   return Response.json({
    //         success: true,
    //         message: "Service active status updated successfully"
    //     }, {status: 200})

    const {professionalServiceId} = await request.json()

    const professionalService = await ProfessionalServiceModel.updateOne(
      {_id: professionalServiceId},
      [
        {$set: {isServiceActive: {$not: "$isServiceActive"}}}
      ]
    )

    if(!professionalService){
        return Response.json({
            success: false,
            message: "Service active status could not be updated"
        }, {status: 401})
      }

    return Response.json({
            success: true,
            message: "Service active status updated successfully"
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