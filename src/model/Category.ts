import mongoose, {Schema, Document} from "mongoose";
import { Types } from "mongoose";


export interface Category extends Document{
    title: string;
    image: string;
    description: string;
    createdAt: Date;
}

const CategorySchema: Schema<Category> = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        enum: ["Elite", "Security", "Driving", "Lawyers", "Finance", "Fixers"]
    },
    image: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const CategoryModel = (mongoose.models.Category as mongoose.Model<Category>) || mongoose.model<Category>("Category", CategorySchema)

export default CategoryModel;