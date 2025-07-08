import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/Category";
import SubCategoryModel from "@/model/SubCategory";
import mongoose from "mongoose";


export async function POST(req: NextRequest){
    await dbConnect()

    try {
        const body = await req.json()

        if(!body.category){
            return Response.json({
                success: false,
                message: "Please provide a category id"
            }, {status: 400})
        }
        const category = await CategoryModel.findOne({title: body.category})
        const categoryId = category?._id
        let subCategoryNames: string[] = [];

        if(typeof body.title === 'string'){
            subCategoryNames = [body.title]
        }else if(Array.isArray(body.title)){
            subCategoryNames = body.title
        }else{
            return Response.json({
                success: false,
                message: "Provide name as either a string or [string]"
            })
        }

        const existing = await SubCategoryModel.find({name: {$in: subCategoryNames}})
        const existingNames = existing.map((c) => c.title)
        const newNames = subCategoryNames.filter((n) => !existingNames.includes(n))

        if(!newNames || newNames.length === 0){
            return Response.json({
                success: false,
                message: "Sub Categories already exists"
            }, {status: 400})
        }

        const newSubCategories = newNames.map((title) => ({title, category: categoryId}))
        const created = await SubCategoryModel.insertMany(newSubCategories)

        return Response.json({
            success: true,
            message: "Subcategories created successfully"
        }, {status: 200})


    } catch (error) {
        console.error("Sub Categories creation error:", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }

}