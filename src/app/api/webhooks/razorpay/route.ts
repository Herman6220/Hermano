import dbConnect from "@/lib/dbConnect"
import OrderModel from "@/model/Order"
import crypto from "crypto"
// import nodemailer from "nodemailer"

export async function POST(request: Request){
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!).update(body).digest("hex")

    if(expectedSignature !== signature){
      return Response.json({
        success: false,
        message: "Invalid signature"
      }, {status: 400})
    }

    const event = JSON.parse(body)

    await dbConnect()

    if(event.event === "payment.captured"){
      const payment = event.payload.payment.entity;

      const order = await OrderModel.findOneAndUpdate(
        {razorpayOrderId: payment.order_id},
        {
          razorpayPaymentId: payment.id,
          status: "PAID"
        }
      )

      // if(order){
      //     const transporter = nodemailer.createTransport({
      //       service: "sandbox.smtp.mailtrap.io",
      //       port: 2525,
      //       auth: {
      //         user: process.env.MAILTRAP_USERNAME,
      //         pass: process.env.MAILTRAP_PASSWORD
      //       }
      //     })

      //     await transporter.sendMail({
      //       from: "hermanjoshi123@gmail.com",
      //       to: order.userId.email,
      //       subject: "Order completed",
      //       text: `Your order ${order.professionalServiceId.name} has been successfully placed.`
      //     })
      // }
    }

    return Response.json({
      success: true,
      message: "Order completed"
    }, {status: 200})

  } catch (error) {
    console.error("An error ocuured", error)
    return Response.json({
      success: false,
      message: "Internal server error"
    }, {status: 500})
  }
}