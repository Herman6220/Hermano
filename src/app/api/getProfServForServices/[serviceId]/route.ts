import dbConnect from "@/lib/dbConnect";
import ProfessionalServiceModel from "@/model/ProfessionalService";
import mongoose from "mongoose";

export async function GET(request: Request, { params }: { params: Promise<{ serviceId: string }> }) {
  try {

    const { searchParams } = new URL(request.url)
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const rating = searchParams.get("rating")
    const sort = searchParams.get("sort")

    let sortOption = {}

    console.log("sortTerm", sort)

    switch (sort) {
      case "price-asc":
        sortOption = { "professionalService.price": 1 };
        break;
      case "price-desc":
        sortOption = { "professionalService.price": -1 };
        break;
      case "name-asc":
        sortOption = { "professionalService.matchedProfessionals.fullname": -1 };
        break;
      case "name-desc":
        sortOption = { "professionalService.matchedProfessionals.fullname": 1 };
        break;
      default:
        sortOption = { _id: 1 }
    }


    await dbConnect()

    const serviceId = (await params).serviceId
    const newServiceId = new mongoose.Types.ObjectId(serviceId)

    console.log(newServiceId)

    const professionalServices = await ProfessionalServiceModel.aggregate([
      {
        $match: {
          serviceId: newServiceId,
          ...(minPrice || maxPrice ? {
            price: {
              ...(minPrice ? { $gte: Number(minPrice) } : {}),
              ...(maxPrice ? { $lte: Number(maxPrice) } : {})
            }
          } : {})
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "matchedServices"
        }
      },
      {
        $lookup: {
          from: "professionals",
          localField: "professionalId",
          foreignField: "_id",
          as: "matchedProfessionals"
        }
      },
      {
        $addFields: {
          matchedServices: { $arrayElemAt: ["$matchedServices", 0] },
          matchedProfessionals: { $arrayElemAt: ["$matchedProfessionals", 0] }
        }
      },
      {
        $project: {
          _id: 0,
          professionalService: "$$ROOT"
        }
      },
      {
        $sort: sortOption
      }
    ])

    console.log(professionalServices)

    if (!professionalServices || professionalServices.length === 0) {
            return Response.json({
                success: false,
                message: "No professional found for this service."
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: professionalServices
        }, { status: 200 })
  } catch (error) {
      console.error("Some error occured while fetching the professionals.", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
  }
}