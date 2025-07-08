import { getServerSession, User } from 'next-auth'
import Razorpay from 'razorpay'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import ProfessionalServiceModel from '@/model/ProfessionalService'
import OrderModel from '@/model/Order'
import CustomerModel from '@/model/Customer'
import CartModel from '@/model/Cart'


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})


export async function POST(request: Request){
  try {
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || session.user.activeRole !== "CUSTOMER"){
      return Response.json({
        success: false,
        message: "Not authenticated"
      }, {status: 400})
    }

    const {cartForCheckout} = await request.json()

    if(!cartForCheckout){
      return Response.json({
        success: false,
        message: "Invalid input1"
      }, {status: 400})
    }

    if(!cartForCheckout.serviceLocation){
      return Response.json({
        success: false,
        message: "Invalid input3"
      }, {status: 400})
    }

    cartForCheckout.items.map((item: any) => {
      if(!item.professionalServiceId || !item.quantity){
        return Response.json({
          success: false,
          message: "Invalid input2"
        }, {status: 400})
      }
    })

    const professionalServiceIds = cartForCheckout.items.map((professionalService: any) => professionalService.professionalServiceId)
    const professionalServiceIdsStr = professionalServiceIds.map((professionalServiceId: any) => professionalServiceId.toString())

    await dbConnect()

    const customer = await CustomerModel.findOne({userId: user._id})

    if(!customer){
      return Response.json({
        success: false,
        message: "User not found"
      }, {status: 400})
    }

    const customerId = customer._id

    const professionalServices = await ProfessionalServiceModel.find({_id: {$in: professionalServiceIds}})

    console.log(professionalServices)

    const professionalServicesObjects = professionalServices.map((item: any) => ({
      professionalService: item
    }))

    console.log(professionalServicesObjects)

    const professionalServicesForDb = professionalServicesObjects.map((item: any) => {
      const match = cartForCheckout.items.find((prev: any) => prev.professionalServiceId.toString() === item.professionalService._id.toString())
      console.log("match", match)
      if(match){
        return{...item, quantity: match.quantity}
      }
      return item;
    })
    
    console.log(professionalServicesForDb)
    
    const professionalServicesMap = new Map()

    professionalServices.forEach((professionalService: any) => {
      professionalServicesMap.set(professionalService._id.toString(), professionalService)
    })

    let subTotal = 0

    cartForCheckout.items.forEach((item: any) => {
      const professionalService = professionalServicesMap.get(item.professionalServiceId)
      if(professionalService){
        subTotal += professionalService.price * item.quantity
      }
    })

    let total = subTotal + Math.round(subTotal * 0.10)

    //create razorpay order
    const order = await razorpay.orders.create({
      amount: total,
      currency: "INR",
      receipt: `receipt-${Date.now()}`,
      notes: {
        professionalServiceIds: professionalServiceIdsStr,
        serviceLocation: cartForCheckout.serviceLocation
      }
    })

    const newOrder = new OrderModel({
      customerId: customer._id,
      professionalServices: professionalServicesForDb,
      totalAmount: total,
      serviceLocation: cartForCheckout.serviceLocation,
      status: "PENDING",
      paymentStatus: "PENDING",
      razorpayOrderId: order.id
    })

    await newOrder.save()

    await CartModel.deleteMany({customerId})

    return Response.json({
      success: true,
      message: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes,
        dbOrderId: newOrder._id,
      }
    }, {status: 200})
    
  } catch (error) {
    console.error("An unknown error occured", error)
    return Response.json({
      success: false,
      message: "Internal server error"
    }, {status: 500})
  }
}