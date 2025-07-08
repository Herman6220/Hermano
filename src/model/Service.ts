import mongoose,{Schema, Document, Types} from "mongoose";

export interface Service extends Document{
    title: string;
    subCategory: Types.ObjectId;
    category: Types.ObjectId;
    createdAt: Date;
}

const ServiceSchema: Schema<Service> = new Schema({
    title: {
        type: String,
        required: true,
        enum: ["Armed Bodyguard", "Executive Extraction", "Discreet Shadow Escort",
"Underground Bouncers", "Hostile Event Neutralizers", "Riot Standby Unit",
"Surveillance Van Rental", "Spy Camera Installation", "Counter-Surveillance",
"Discreet Kidnap Retrieval", "Night Recon Missions", "Evidence Disposal",
"Street Racing Chauffeur", "Getaway Driver (Non-Violent)", "Untraceable Night Drops",
"Lamborghini Hourly Ride", "Chauffeured Supercar", "Intercity Speed Run",
"Secure Trunk Transport", "No-Questions Night Haul", "Courier with Jammer",
"Bail in 24 Hours", "Unregistered Weapon Case", "Assault Case Cleanup",
"Fake Identity Removal", "Name Clearing", "Business License Overhaul",
"Client Anonymity Support", "No-Paper Deal Mediation", "Off-Record Disputes",
"Shell Company Setup", "Cash Laundering Advice", "Crypto Mixing",
"Offshore Account Setup", "Gold Bar Procurement", "Privacy-Focused Investments",
"Intimidation Visit", "Collateral Seizure Crew", "Unregistered Collection",
"Crime Scene Cleaning", "Vehicle Disposal", "Biohazard Removal",
"Fake Passport", "Work Permit Creation", "University Degree Printing",
"Digital Identity Erasure", "Phone Burn Pack", "Relocation Kit",
"Penthouse Hideout Booking", "Private Island Transfer", "VIP Discreet Host",
"High-End Companion", "Confidential Party Staffing", "Elite Concierge",
"Corporate Sabotage Strategy", "Info Broker", "Digital Blackmail Packages"
]
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
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

const ServiceModel = (mongoose.models.Service as mongoose.Model<Service>) || mongoose.model<Service>("Service", ServiceSchema)

export default ServiceModel;