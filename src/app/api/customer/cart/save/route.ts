import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import CartModel, { CartItem } from "@/model/Cart";
import CustomerModel from "@/model/Customer";
import ProfessionalModel from "@/model/Professional";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || session.user.activeRole !== "CUSTOMER") {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const { professionalService} = await request.json()

    if (!professionalService) {
        return Response.json({
            success: false,
            message: "Missing cart item fields"
        }, { status: 400 })
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const customer = await CustomerModel.findOne({ userId })

        if (!customer) {
            return Response.json({
                success: false,
                message: "Customer not found"
            }, { status: 401 })
        }

        const customerId = customer._id

        let cart = await CartModel.findOne({ customerId })

        if (!cart) {
            cart = new CartModel({ customerId, cartItems: [] })
        }

        console.log("cart", cart)

        const existingItem = cart.cartItems.find(
            (item: any) =>
                item.professionalService._id.toString() === professionalService._id.toString()
        );

        if (existingItem) {
            return Response.json({
                success: false,
                message: "Item already exists in the cart."
            }, { status: 400 })
        }

        cart.cartItems.push({
            professionalService,
            quantity: 1
        } as any)

        await cart.save()

        return Response.json({
            success: true,
            message: "Item added to cart successfully"
        }, { status: 200 })
    } catch (error) {
        console.log("An unknown error occured while adding items to cart", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }

}