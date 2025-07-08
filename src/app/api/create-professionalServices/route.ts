import dbConnect from "@/lib/dbConnect";
import ProfessionalModel from "@/model/Professional";
import ProfessionalServiceModel from "@/model/ProfessionalService";
import ServiceModel from "@/model/Service";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user:User = session?.user as User

    try{
        if(!session || session.user.activeRole !== "PROFESSIONAL"){
            return Response.json({
                success: false,
                message: "Not Authenticated"
            }, {status: 404})
        }

        const userId = new mongoose.Types.ObjectId(user._id)

        const professional = await ProfessionalModel.findOne({userId})

        if(!professional){
            return Response.json({
                success: false,
                message: "This account doesn't exists, create a new account."
            }, {status: 401})
        }

        const professionalId = professional?._id

        // const {serviceId, price, description, images} = await request.json()

        const {services} = await request.json()

        const serviceIds = services.map((service: any) => service.serviceId)
        console.log("serviceIds", serviceIds)

        const validServices = await ServiceModel.find({_id: {$in: serviceIds}})
        console.log("validServices", validServices)

        const validServicesIds = validServices.map((vps: any) => vps._id.toString())
        console.log("validServiceIds", validServicesIds)

        if(!validServicesIds || validServicesIds.length === 0){
            return Response.json({
                success: false,
                message: "The services selected doesn't exist or has been deleted."
            }, {status: 401})
        }

        const validProfessionalServices = services.filter((service: any) => validServicesIds.includes(service.serviceId))
        console.log("validProfessionalServices", validProfessionalServices)

        const validProfessionalServicesIds = validProfessionalServices.map((vps: any) => vps.serviceId.toString())
        console.log("validProfessionalServicesIds", validProfessionalServicesIds)

        const existingProfessionalServices = await ProfessionalServiceModel.find({serviceId: {$in: validProfessionalServicesIds}, professionalId})
        console.log("existingPS", existingProfessionalServices)

        const existingProfessionalServicesIds = existingProfessionalServices.map((eps) => eps.serviceId.toString())
        console.log("existingPSIds", existingProfessionalServicesIds)

        const newProfessionalServices = validProfessionalServices.filter((vps: any) => !existingProfessionalServicesIds.includes(vps.serviceId))

        if(!newProfessionalServices || newProfessionalServices.length === 0){
            return Response.json({
                success: false,
                message: "Services already exists with your account."
            }, {status: 401})
        }

        const newProfessionalServicesWithProfessionalId = newProfessionalServices.map((nps: any) => ({
            ...nps,
            professionalId: professionalId
        }))

        const savedProfessionalServices = await ProfessionalServiceModel.insertMany(newProfessionalServicesWithProfessionalId);
        
        const savedProfessionalServicesIds = savedProfessionalServices.map((sps) => sps._id.toString())

        await ProfessionalModel.updateOne(
            {_id: professionalId},
            {$push: {services: savedProfessionalServicesIds}}
        )
         
        return Response.json({
            success: true,
            message: "Service for your account has been created successfully"
        }, {status: 200})

    }catch(error){
        console.error("Some error occured", error)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500})
    }
}