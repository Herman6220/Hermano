import mongoose, { Schema, Document, Types } from "mongoose";

export interface CartItem extends Document {
    professionalService: {
        _id: Types.ObjectId;
        professionalId: Types.ObjectId;
        serviceId: Types.ObjectId;
        price: number;
        description: string;
        images: string[];
        averageRating: number;
        reviewsCount: number;
        isServiceActive: boolean;
        matchedServices: {
            _id: Types.ObjectId;
            title: string;
            subCategory: Types.ObjectId;
            category: Types.ObjectId;
            createdAt: Date
        };
        matchedProfessionals: {
            _id: Types.ObjectId;
            fullname: string;
            email: string;
            phone: string;
            profilePicture: string;
            experience: number;
            location: string;
            description: string;
        };
    };
    quantity: number;
    createdAt: Date;
}



const CartItemSchema: Schema<CartItem> = new Schema({
    professionalService: {
        _id: {
            type: Schema.Types.ObjectId,
            ref: "ProfessionalService",
            required: true,
        },
        professionalId: {
            type: Schema.Types.ObjectId,
            ref: "Professional",
            required: true,
        },
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        price: { type: Number, required: true },
        description: { type: String },
        images: [String],
        averageRating: { type: Number, default: 1 },
        reviewsCount: { type: Number, default: 1 },
        isServiceActive: { type: Boolean, default: true },
        matchedServices: {
            _id: {
                type: Schema.Types.ObjectId,
                ref: "Service",
                required: true,
            },
            title: String,
            subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory", required: true },
            category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        },
        matchedProfessionals: {
            _id: {
                type: Schema.Types.ObjectId,
                ref: "Professional",
                required: true,
            },
            fullname: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String },
            profilePicture: { type: String },
            experience: { type: Number },
            location: { type: String },
            description: { type: String },
        },
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})


export interface Cart extends Document {
    customerId: Types.ObjectId
    cartItems: CartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema: Schema<Cart> = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
        unique: true
    },
    cartItems: {
        type: [CartItemSchema]
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const CartModel = (mongoose.models.Cart as mongoose.Model<Cart>) || mongoose.model<Cart>("Cart", CartSchema)

export default CartModel;