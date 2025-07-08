import mongoose, {Schema, Document} from "mongoose";
import { Types } from "mongoose";


export interface SubCategory extends Document{
    title: string;
    category: Types.ObjectId,
    createdAt: Date;
}

const SubCategorySchema: Schema<SubCategory> = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        enum: ["Luxury Shadows", "Espionage Consulting", "Cleanup Crew", "Forgeries", "Disappearing Services", "Black Budgeting", "Anonymous Wealth Management", "Debt Collection", "Criminal Defense", "Document Fixers", "Underground Advocacy", "Underground Drivers", "Luxury Speed Service", "Smuggling Logistics", "Close Protection", "Crowd Control", "Private Ops", "Black Bag Ops"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const SubCategoryModel = (mongoose.models.SubCategory as mongoose.Model<SubCategory>) || mongoose.model<SubCategory>("SubCategory", SubCategorySchema)

export default SubCategoryModel;

