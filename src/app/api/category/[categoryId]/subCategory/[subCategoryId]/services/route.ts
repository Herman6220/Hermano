import dbConnect from "@/lib/dbConnect";
import ServiceModel from "@/model/Service";


export async function GET(request: Request, {params}: {params: Promise<{subCategoryId: string}>}){
    try {
        await dbConnect()

        const subCategoryId = (await params).subCategoryId;

        const services = await ServiceModel.find({subCategory: subCategoryId})

        if(!services || services.length === 0){
            return Response.json({
                success: false,
                message: "Services coudn't be found"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: services
        }, {status: 200})
        
    } catch (error) {
        console.error("Some error occured while fetching the services.", error)
                return Response.json({
                    success: false,
                    message: "Internal server error"
                }, {status: 500})
    }
}
