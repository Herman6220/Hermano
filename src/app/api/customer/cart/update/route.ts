import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/Cart";
import CustomerModel from "@/model/Customer";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";

export async function PATCH(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user:User = session?.user as User

    if(!session || session.user.activeRole !== "CUSTOMER"){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})    
    }

    const {professionalServiceId, adjustment} = await request.json()
    console.log(professionalServiceId, adjustment)

    if(!professionalServiceId || typeof(adjustment) !== "number" || adjustment === 0){
        return Response.json({
            success: false,
            message: "Invalid Input"
        }, {status: 404})
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const customer = await CustomerModel.findOne({userId})

        if(!customer){
            return Response.json({
                success: false,
                message: "Customer not found"
            }, {status: 404})
        }

        const result = await CartModel.updateOne(
            {
                customerId: customer._id,
                "cartItems.professionalService._id": professionalServiceId
            },
            {
                $inc: {"cartItems.$.quantity": adjustment}
            }
        )

        if(result.matchedCount === 0){
            return Response.json({
                success: false,
                message: "Item not found in the cart"
            }, {status: 404})
        }

        await CartModel.updateOne(
            {customerId: customer._id},
            {$pull: {cartItems: {quantity: {$lte: 0}}}}
        )

        return Response.json({
            success: true,
            message: "Cart updated successfully"
        }, {status: 200})
    } catch (error) {
        console.error("An error occured while updating cart", error)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500})
    }
}