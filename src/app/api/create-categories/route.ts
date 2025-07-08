import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/Category";


export async function POST(request: Request){
    try {
        const categories = await request.json()

        const categoryTitles = categories.map((category: any) => category.title)
        console.log(categoryTitles)

        await dbConnect();

        const existing = await CategoryModel.find({title: {$in: categoryTitles}})
        console.log(existing)
        const existingCategoriesTitles = existing.map((exists) => exists.title)
        console.log(existingCategoriesTitles)
        const newCategories = categories.filter((newCategory: any) => !existingCategoriesTitles.includes(newCategory.title))

        if(!newCategories || newCategories.length === 0){
            return Response.json({
                success: false,
                message: "Categories already exist"
            }, {status: 401})
        }

        const created = await CategoryModel.insertMany(newCategories);

        return Response.json({
            success: true,
            message: "Categories created succesfully"
        }, {status: 200})
    } catch (error) {
        console.error("Categories creation error:", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}



export async function PUT(request: Request){
    try {
        const categories = await request.json()
        console.log("categories", categories)

        const categoryTitles = categories.map((category: any) => category.title)

        await dbConnect()

        const existing = await CategoryModel.find({title: {$in: categoryTitles}})
        const existingCategoriesTitles = existing.map((exists: any) => exists.title)
        const existingCategories = categories.filter((newCategory: any) => existingCategoriesTitles.includes(newCategory.title))
        console.log("exstcategories", existingCategories)

        if(!existingCategories || existingCategories.length === 0){
            return Response.json({
                success: false,
                message: "Categories don't exist"
            }, {status: 401})
        }

        const updatedCategories = await Promise.all(existingCategories.map((exstCateg: any) => {
            const title = exstCateg.title

            return CategoryModel.updateOne(
                {title},
                {$set: exstCateg}
            )
        }))

        if(!updatedCategories || updatedCategories.length === 0){
            return Response.json({
            success: false,
            message: "Categories could not be updated"
        }, {status: 400})
        }

        console.log(updatedCategories)

        return Response.json({
            success: true,
            message: "Categories updated succesfully"
        }, {status: 200})
        
    } catch (error) {
        console.error("Categories creation error:", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}