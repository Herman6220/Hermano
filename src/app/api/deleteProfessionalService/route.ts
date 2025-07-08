import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import ProfessionalModel from "@/model/Professional";
import ProfessionalServiceModel from "@/model/ProfessionalService";

export async function DELETE(request: Request){
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

      const {professionalServiceId} = await request.json()
      // const strProfessionalServiceId = professionalServiceId.toString();
      // const convertedProfessionalServiceId = new mongoose.Types.ObjectId(strProfessionalServiceId)

      const userId = new mongoose.Types.ObjectId(user._id)

      const professionalId = await ProfessionalModel.findOne(
        {userId: userId},
        {_id: 1}
      )

      const deletedProfessionalService = await ProfessionalServiceModel.findOneAndDelete({_id: professionalServiceId})
      console.log("deletedProserv", deletedProfessionalService)

      if(!deletedProfessionalService){
        return Response.json({
          success: false,
          message: "Service couldn't be deleted."
        }, {status: 400})
      }
      
      const updatedProfessional = await ProfessionalModel.updateOne(
        {_id: professionalId},
        {$pull: {services: professionalServiceId}}
      )

      if(updatedProfessional.modifiedCount <= 0){
        return Response.json({
          success: false,
          message: "Professional couldn't be updated."
        }, {status: 400})
      }

      return Response.json({
          success: true,
          message: "Service deleted successfully"
        }, {status: 200})
      
     } catch (error) {
        console.error("Some error occured", error)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500})
     }
}