import { v2 as cloudinary} from "cloudinary"
import { NextRequest } from "next/server";


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryUploadResult {
    public_id: string,
    [key: string]: any
}

export async function POST(request: NextRequest){

    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];
        const file = formData.get("file") as File;

        if((!files || files.length === 0) && (!file)){
            return Response.json({
              success: false,
              message: "File/files not found"
            }, {status: 401})
        }else if(!file){
            const uploadPromises = files.map(async(file) => {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)

          return new Promise<CloudinaryUploadResult>((resolve,reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {folder: "hermano-next-cloudinary-services-uploads",
                resource_type: "image"
              },
              (error, result) => {
                if(error) reject(error)
                else resolve(result as CloudinaryUploadResult)
              }
            )
            uploadStream.end(buffer)
          })
        })

        const results = await Promise.all(uploadPromises)
        const urls = results.map((result) => result.secure_url)

        return Response.json({
          success: true,
          message: urls
        }, {status: 200})
        } 
        else{
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                  {
                    folder: "hermano-next-cloudinary-profile-uploads",
                    resource_type: "image"
                  },
                  (error, result) => {
                    if(error) reject(error);
                    else resolve(result as CloudinaryUploadResult)
                  }
                )
                uploadStream.end(buffer)
            })

            const url = result.secure_url
            return Response.json({
              success: true,
              message: url
            }, {status: 200})

        }
        
    } catch (error) {
        console.error("Upload image failed", error)
        return Response.json({
          success: false,
          message: "Internal server error"
        }, {status: 500})
    }
}
