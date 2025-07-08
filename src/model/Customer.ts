import mongoose, {Schema, Document} from "mongoose";
import { Types } from "mongoose";

export interface Customer extends Document{
    userId: Types.ObjectId;
    email: string;
    fullname: string;
    phone?: string;
    address?: string;
    cart?: Types.ObjectId;
    orders?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema: Schema<Customer> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: [true, "Full name is required"]
    },
    phone: {
        type: String,
    },
    address: {
        type: String
    },
    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: "Service"
        }
    ],
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    createdAt: {
        type: Date,
        rquired: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const CustomerModel = (mongoose.models.Customer as mongoose.Model<Customer>) || mongoose.model<Customer>("Customer", CustomerSchema)

export default CustomerModel;