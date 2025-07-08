import mongoose, { Schema, Document, Types } from "mongoose";
import { ProfessionalService } from "./ProfessionalService";

export interface Order extends Document {
    customerId: Types.ObjectId;
    professionalServices: {
        professionalService: ProfessionalService;
        quantity: number;
    }[];
    totalAmount: number;
    serviceLocation: string;
    status: string;
    paymentStatus: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    createdAt: Date;
}

const OrderSchema: Schema<Order> = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    professionalServices: {
        type: [{
            professionalService: {
                _id: {type: mongoose.Schema.Types.ObjectId, required: true},
                professionalId: {type: mongoose.Schema.Types.ObjectId, ref: "Professional", required: true},
                serviceId: {type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true},
                price: {type: Number, required: true},
                description: {type: String},
                images: [{type: String}]
            },
            quantity: Number
        }],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    serviceLocation: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"],
        default: "PENDING",
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
        default: "PENDING",
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpayPaymentId: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const OrderModel = (mongoose.models.Order as mongoose.Model<Order>) || mongoose.model<Order>("Order", OrderSchema)

export default OrderModel;