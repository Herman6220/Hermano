import dbConnect from "@/lib/dbConnect";
import ProfessionalModel from "@/model/Professional";
import ProfessionalServiceModel from "@/model/ProfessionalService";
import ServiceModel from "@/model/Service";
import { useSearchParams } from "next/navigation";

export async function GET(request: Request){

  const {searchParams} = new URL(request.url)
  const searchTerm = searchParams.get("searchTerm")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const rating = searchParams.get("rating")
  const sort = searchParams.get("sort")

  let sortOption = {}

  console.log("Search term", searchTerm)
  console.log("sortTerm", sort)
  console.log("minPrice", minPrice)
  console.log("maxPrice", maxPrice)

  switch(sort){
    case "price-asc":
      sortOption = {"professionalService.price": 1};
      break;
    case "price-desc":
      sortOption = {"professionalService.price": -1};
      break;
    case "name-asc":
      sortOption = {"professionalService.matchedProfessionals.fullname": -1};
      break;
    case "name-desc":
      sortOption = {"professionalService.matchedProfessionals.fullname": 1};
      break;
    default:
      sortOption = {_id: 1}
  }

  const escapeRegex = (input: string) =>
  input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const escapedSearchTerm = escapeRegex(searchTerm || "")

    await dbConnect()

  try {
    // const services = await ServiceModel.find({
    //   title: {$regex: searchTerm || "", $options: "i"}
    // })
    // const professionalServices = await ServiceModel.aggregate([
    //   {$match: {title: {$regex: searchTerm || "", $options: "i"}}},
    //   {$lookup: {
    //     from: "professionalservices",
    //     localField: "_id",
    //     foreignField: "serviceId",
    //     as: "matchedProfessionalServices"
    //   }}
    // ])

    const professionalServices = await ServiceModel.aggregate([
      {
        $match: {
          title: {$regex: escapedSearchTerm || "", $options: "i"},
        }
      },
      {
        $lookup: {
          from: "professionalservices",
          let: {serviceId: "$_id"},
          pipeline: [
            {
              $match: {
                isServiceActive: true,
                $expr: {
                  $eq: ["$serviceId", "$$serviceId"]
                },
                ...(minPrice || maxPrice ? {
                  price : {
                    ...(minPrice ? {$gte: Number(minPrice)}: {}),
                    ...(maxPrice ? {$lte: Number(maxPrice)}: {})
                  }
                }: {}),
                ...(rating ? {
                  averageRating: {
                    ...(rating ? {$gte: Number(rating)}: {})
                  }
                } : {})
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
              $match: {
                "matchedProfessionals.0": {$exists: true}
              }
            },
            {
              $unwind: "$matchedProfessionals"
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
              $unwind: "$matchedServices"
            }
          ],
          as: "matchedProfessionalServices"
        }
      },
      {
        $match: {
          "matchedProfessionalServices.0": {$exists: true}
        }
      },
      {
        $unwind: "$matchedProfessionalServices"
      },
      {
        $project: {
          _id: 0,
          professionalService: "$matchedProfessionalServices"
        }
      },
      {
        $sort: sortOption
      }
    ])

    if(!professionalServices){
      return Response.json({
        success: false,
        message: "No services found"
      }, {status: 400})
    }

    return Response.json({
        success: true,
        message: professionalServices
      }, {status: 200})

  } catch (error) {
    console.error("An unknown error occured", error)
    return Response.json({
        success: false,
        message: "Internal server error"
      }, {status: 400})
  }
}