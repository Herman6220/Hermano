import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/Category";


export async function GET(){
    try {
        await dbConnect()
        const categories = await CategoryModel.find({})

        if(!categories){
            return Response.json({
                success: false,
                message: "Categories coundn't be found"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: categories
        }, {status: 200})
    } catch (error) {
        console.error("Some error occured while fetching the categories.", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }


}