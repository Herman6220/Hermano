import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import CustomerModel from "@/model/Customer";
import mongoose from "mongoose";
import OrderModel from "@/model/Order";

export async function GET(){
  try {
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || session.user.activeRole !== "CUSTOMER"){
      return Response.json({
        success: false,
        message: "Not authenticated"
      }, {status: 400})
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    await dbConnect()

    const customer = await CustomerModel.findOne({userId})

    if(!customer){
      return Response.json({
        success: false,
        message: "Customer not found"
      }, {status: 400})
    }

    const customerId = customer._id

    const orders = await OrderModel.aggregate([
      {
        $match: {customerId: customerId}
      },
      {$unwind: "$professionalServices"},
      {
        $lookup: {
          from: "services",
          localField: "professionalServices.professionalService.serviceId",
          foreignField: "_id",
          as: "matchedServices"
        }
      },
      {
        $lookup: {
          from: "professionals",
          localField: "professionalServices.professionalService.professionalId",
          foreignField: "_id",
          as: "matchedProfessionals"
        }
      },
      {$unwind: "$matchedServices"},
      {$unwind: "$matchedProfessionals"}
    ])

    if(!orders){
      return Response.json({
        success: false,
        message: "No orders found"
      }, {status: 400})
    }

    return Response.json({
      success: true,
      message: orders
    }, {status: 200})
  } catch (error) {
    console.log("An error occurred", error)
    return Response.json({
        success: false,
        message: "Internal server error"
      }, {status: 500})
  }
}