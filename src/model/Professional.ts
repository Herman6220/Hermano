import mongoose, { Schema, Document } from "mongoose";
import { Types } from "mongoose";

export interface Professional extends Document {
    userId: Types.ObjectId;
    email: string;
    status: string;
    isActive: boolean;
    fullname: string;
    phone: string;
    services: {
        serviceId: Types.ObjectId;
        price: number;
        description?: string;
        images?: string[];
        averageRating: number;
        reviewsCount: number;
        isServiceActive: boolean;
    }[];
    description: string;
    experience: number;
    location: string;
    rating: number;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProfessionalSchema: Schema<Professional> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"],
        default: "PENDING"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    services: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProfessionalService"
        }],
    },
    description: {
        type: String
    },
    experience: {
        type: Number
    },
    location: {
        type: String
    },
    rating: {
        type: Number
    },
    profilePicture: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }

})

function arrayLimit(val: any){
    return val.length <= 5;
}

const ProfessionalModel = (mongoose.models.Professional as mongoose.Model<Professional>) || mongoose.model<Professional>("Professional", ProfessionalSchema)

export default ProfessionalModel;