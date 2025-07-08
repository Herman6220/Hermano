import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "customer",
            name: "Customer",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any):Promise<any>{
                console.log("Authorize called with:", credentials);
                await dbConnect()
                try {
                    if(!credentials){
                        throw new Error("No credentials provided");
                    }
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.email}
                        ],
                        role: "CUSTOMER"
                    })
                    console.log("Found user:", user);
                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        return {
                            _id: user._id?.toString(),
                            email: user.email,
                            activeRole: "CUSTOMER"
                        }
                    }else{
                        throw new Error("Incorrect Password")
                    }
                } catch (error) {
                    throw new Error("An error ocuured while sgning you in.")
                }
            }
        }),
        CredentialsProvider({
            id: "professional",
            name: "Professional",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any):Promise<any>{
                console.log("Authorize called with:", credentials);
                await dbConnect()
                try {
                    if(!credentials){
                        throw new Error("No credentials provided");
                    }
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.email}
                        ],
                        role: "PROFESSIONAL"
                    })
                    console.log("Found user:", user);
                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        return {
                            _id: user._id?.toString(),
                            email: user.email,
                            activeRole: "PROFESSIONAL"
                        }
                    }else{
                        throw new Error("Incorrect Password")
                    }
                } catch (error) {
                    throw new Error("An error ocuured while signing you in.")
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            console.log(token, user);
            if(user){
                token._id = user._id?.toString();
                token.email = user.email;
                token.activeRole = user.activeRole;
            }
            console.log("Updated token:", token)
            return token
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.email = token.email;
                session.user.activeRole = token.activeRole 
            }
            console.log("Session:", session)
            return session
        }
    },
    pages: {
        signIn: "/auth/common-signIn"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}