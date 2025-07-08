import dbConnect from "@/lib/dbConnect";
import ServiceModel from "@/model/Service";

export async function GET(){
  try {
    await dbConnect()

    // const searchName = ["Street Racing Chauffeur", "Getaway Driver (Non-Violent)", "Untraceable Night Drops"]

    // const services = await ServiceModel.aggregate([
    //   {$sample: {size: 3}}
    // ])

    const services = await ServiceModel.find(
      {title: {$in: ["Street Racing Chauffeur", "Getaway Driver (Non-Violent)", "Untraceable Night Drops"]}}
    )

    if(!services){
      return Response.json({
        success: false,
        message: "No services found"
      }, {status: 400})
    }

    return Response.json({
        success: true,
        message: services
      }, {status: 200})

  } catch (error) {
    console.log("An unknown error occured", error)
    return Response.json({
        success: false,
        message: "Internal server error"
      }, {status: 500})
  }
}