import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/Cart";
import { User } from "next-auth";
import mongoose from "mongoose";
import CustomerModel from "@/model/Customer";


export async function GET(){
    await dbConnect()

    const session = await getServerSession(authOptions)
    console.log("Session", session);

    const user: User = session?.user as User

    if(!session || session?.user?.activeRole !== "CUSTOMER"){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const customer = await CustomerModel.findOne({userId})
        const cart = await CartModel.aggregate([
            {
                $match: {customerId: customer?._id}
            },
            {
                $unwind: "$cartItems"
            },
            {
                $lookup: {
                    from: "services",
                    localField: "cartItems.serviceId",
                    foreignField: "_id",
                    as: "cartItems.service"
                },
            },
            {
                $lookup: {
                    from: "professionals",
                    localField: "cartItems.professionalId",
                    foreignField: "_id",
                    as: "cartItems.professional"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    customerId: {$first: "$customerId"},
                    cartItems: {
                        $push: "$cartItems"
                    }
                }
            }
            
        ])



        if(!cart){
            return Response.json({
                success: false,
                message: "Your cart is empty, start filling it up!!!"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: cart
        }, {status: 200})
    } catch (error) {
        console.log("An unexpected error occured while fetching your cart", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}