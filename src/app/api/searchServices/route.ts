import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/Category";
import ServiceModel from "@/model/Service";
import SubCategoryModel from "@/model/SubCategory";

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

  

  try {

    await dbConnect()

    const categoryIdsArr = await CategoryModel.find({title: {$regex: escapedSearchTerm || "", $options: "i"}}, {_id: 1})
    const categoryIds = categoryIdsArr.map((c: any) => c._id)
    console.log(categoryIds)
    const subCategoryIdsArr = await SubCategoryModel.find({title: {$regex: escapedSearchTerm || "", $options: "i"}})
    const subCategoryIds = subCategoryIdsArr.map((s) => s._id)

    const professionalServices = await ServiceModel.aggregate([
      {
        $match: {$or: [
          {title: {$regex: escapedSearchTerm || "", $options: "i"}},
          {category: {$in: categoryIds}},
          {subCategory: {$in: subCategoryIds}}]
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