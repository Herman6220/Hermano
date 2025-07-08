import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import ProfessionalModel from "@/model/Professional";
import bcrypt from "bcryptjs";


export async function POST(request: Request){
    await dbConnect()

    try{
        const {email, password, fullname, phone, services, description, experience,location, profilePicture} = await request.json()
        const existingUser = await UserModel.findOne({email})
        const existingProfessional = await ProfessionalModel.findOne({email})

        if(existingUser && existingProfessional){
            return Response.json({
                success: false,
                message: "User already exists with this email"
            }, {status : 400})
        }else if(existingUser && !existingProfessional){

            if (!existingUser.role.includes("PROFESSIONAL")) {
                existingUser.role.push("PROFESSIONAL");
                await existingUser.save();
            }

            const newProfessional = new ProfessionalModel({
            userId: existingUser._id,
            email,
            status: "PENDING",
            isActive: true,
            fullname,
            phone: phone || "",
            services,
            description: description || "",
            experience: experience || "",
            location: location || "",
            profilePicture: profilePicture || ""
        })

        await newProfessional.save()
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new UserModel({
            email,
            password: hashedPassword,
            verifyCode: "",
            verifyCodeExpiry: null,
            role: ["PROFESSIONAL"]
        })

        await newUser.save()

        const newProfessional = new ProfessionalModel({
            userId: newUser._id,
            email,
            status: "PENDING",
            isActive: true,
            fullname,
            phone: phone || "",
            services,
            description: description || "",
            experience: experience || "",
            location: location || "",
            profilePicture: profilePicture || ""
        })

        await newProfessional.save()
        }

        
        return Response.json({
            success: true,
            message: "User registered successfully"
        }, {status: 201})
    }
    catch(error){
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