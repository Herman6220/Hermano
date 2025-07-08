import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SubCategoryModel from "@/model/SubCategory";
import ServiceModel from "@/model/Service";

export async function POST(req: NextRequest){
    await dbConnect()

    try {
        const body = await req.json()

        const subCategory = await SubCategoryModel.findOne({title: body.subCategory})

        if(!subCategory){
            return Response.json({
                success: false,
                message: "No sub category found for this service, please create one first"
            })
        }

        const subCategoryId = subCategory._id

        const categoryId = subCategory.category


        let serviceNames: string[] = []

        if(typeof body.title === 'string'){
            serviceNames = [body.title]
        }else if(Array.isArray(body.title)){
            serviceNames = body.title
        }else{
            return Response.json({
                success: false,
                message: "Provide title in format of string or [string]"
            }, {status: 400})
        }

        const existing = await ServiceModel.find({title: {$in: serviceNames}})
        const existingNames = existing.map((c) => c.title)
        const newNames = serviceNames.filter((n) => !existingNames.includes(n))

        if(!newNames || newNames.length === 0){
            return Response.json({
                success: false,
                message: "Services already exists"
            }, {status: 400})
        }

        const newServices = newNames.map((title) => ({title, category: categoryId, subCategory: subCategoryId}))
        const created = await ServiceModel.insertMany(newServices)

        return Response.json({
            success: true,
            message: "Services created successfully"
        }, {status: 200})
    } catch (error) {
       console.error("Services creation error:", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}