import mongoose, {Schema, Document, Types} from "mongoose";

export interface ProfessionalService extends Document{
    professionalId: Types.ObjectId;
    serviceId: Types.ObjectId;
    price: number;
    description?: string;
    images?: string[];
    averageRating: number;
    reviewsCount: number;
    isServiceActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProfessionalServiceSchema: Schema<ProfessionalService> = new Schema({
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professional",
        required: true,
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    images: [{
        type: String
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    isServiceActive: {
        type: Boolean,
        default: true
    }
})


const ProfessionalServiceModel = (mongoose.models.ProfessionalService as mongoose.Model<ProfessionalService>) || mongoose.model<ProfessionalService>("ProfessionalService", ProfessionalServiceSchema)

export default ProfessionalServiceModel;