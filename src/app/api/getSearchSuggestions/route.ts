import dbConnect from "@/lib/dbConnect";
import ServiceModel from "@/model/Service";

export async function GET(request: Request){
  await dbConnect()

  try {
    const {searchParams} = new URL(request.url)
    const searchSuggestionTerm = searchParams.get("searchSuggestionTerm")
    console.log(searchSuggestionTerm)

    const results = await ServiceModel.find(
      {title: {$regex: searchSuggestionTerm || "", $options: "i"}},
      {title: 1, _id: 0}
    )

    const suggestions = results.map((result) => result.title)

    if(!suggestions || suggestions.length === 0){
      return Response.json({
        success: false,
        message: "No services found."
      }, {status: 400})
    }

    return Response.json({
        success: true,
        message: suggestions
      }, {status: 200})

  } catch (error) {
    console.error("An unknown error occured", error)
    return Response.json({
        success: false,
        message: "Internal server error"
      }, {status: 500})
  }
}