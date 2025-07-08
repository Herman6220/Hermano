import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/Cart";
import CustomerModel from "@/model/Customer";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";


export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user:User = session?.user as User

    if(!session || session.user.activeRole !== "CUSTOMER"){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 400})
    }

    const {localCart} = await request.json()

    console.log(localCart)

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const customer = await CustomerModel.findOne({userId})
        if(!customer){
            return Response.json({
                success: false,
                message: "Customer not found"
            }, {status: 400})
        }

        let cart = await CartModel.findOne({customerId: customer._id});
        
        if(!cart){
            cart = new CartModel({customerId: customer._id, cartItems: []});
        }

        localCart.forEach((localCartItem: any) => {
            const exists = cart.cartItems.find(
                (dbItem) => dbItem.professionalService._id.toString() === localCartItem.professionalService._id.toString()
            )
            if(!exists){
                cart.cartItems.push(localCartItem)
            }else if(exists && exists.quantity === 1 && localCartItem.quantity === 1){
                return
            }else{
                exists.quantity += localCartItem.quantity
            }
        })

        await cart.save()

        return Response.json({
            success: true,
            message: "Carts have been merged successfully"
        }, {status: 200})
    } catch (error) {
        console.error("An unknown error occured", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }


}