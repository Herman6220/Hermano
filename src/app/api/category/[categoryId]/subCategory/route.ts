import dbConnect from "@/lib/dbConnect";
import SubCategoryModel from "@/model/SubCategory";

export async function GET(request: Request, {params}: {params: Promise<{categoryId: string}>}){
    try {
        await dbConnect()
        
        const categoryId = (await params).categoryId;
    
        const subCategories = await SubCategoryModel.find({category: categoryId})
    
        if(!subCategories || subCategories.length === 0){
            return Response.json({
                success: false,
                message: "Sub categories coudn't be found"
            }, {status: 400})
        }
    
        return Response.json({
            success: true,
            message: subCategories
        }, {status: 200})
    } catch (error) {
        console.error("Some error occured while fetching the sub categories.", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}