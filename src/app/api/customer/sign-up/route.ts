import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import CustomerModel from "@/model/Customer";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { email, password, fullname, phone, address } = await request.json()
        const existingUser = await UserModel.findOne({ email })
        const existingCustomer = await CustomerModel.findOne({ email })

        if (existingUser && existingCustomer) {
            return Response.json({
                success: false,
                message: "User already exists with this email"
            }, { status: 400 })
        } else if (existingUser && !existingCustomer) {

            if (!existingUser.role.includes("CUSTOMER")) {
                existingUser.role.push("CUSTOMER");
                await existingUser.save();
            }

            const newCustomer = new CustomerModel({
                userId: existingUser._id,
                email,
                fullname,
                phone: phone || "",
                address: address || "",
                cart: [],
                orders: []
            })

            await newCustomer.save()
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = new UserModel({
                email,
                password: hashedPassword,
                verifyCode: "",
                verifyCodeExpiry: null,
                role: ["CUSTOMER"]
            })
            await newUser.save()

            const newCustomer = new CustomerModel({
                userId: newUser._id,
                email,
                fullname,
                phone: phone || "",
                address: address || "",
                cart: [],
                orders: []
            })

            await newCustomer.save()
        }

        return Response.json({
            success: true,
            message: "User registered successfully"
        }, { status: 201 })
    } catch (error) {
        console.error("Error registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}