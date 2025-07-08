'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { userSignInSchema } from "@/schemas/userSignInSchema";
import { toast } from "sonner";
import Link from "next/link";
import { mergeGuestCart } from "@/lib/mergeGuestCart";


function page(){
    const router = useRouter()

    const form = useForm<z.infer<typeof userSignInSchema>>({
        resolver: zodResolver(userSignInSchema),
        defaultValues: {
          email: "",
          password: ""
        }
    })


    const onSubmit = async(data: z.infer<typeof userSignInSchema>) => {
      const result = await signIn("customer", {
        redirect: false,
        email: data.email,
        password: data.password
      })
      if(result?.error){
        if(result.error == "CustomerSignin"){
          toast("Login failed", {
            description: "Incorrect username or password"
          })
          console.log(result.error)
        }else{
          toast("Error", {
            description: result.error
          })
        }
      }
      if(result?.ok){
        await mergeGuestCart()
        router.push('/')
        console.log(result)
      }
    }

    return(
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-2">
              Sign In as Customer
            </h1>
            <p className="mb-4">
              Enter your email and passsword
            </p>
          </div>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">SignIn</Button>
      </form>
    </Form>
    <div className="text-center mt-4">
          <p>
            Not a member?{" "}
            <Link href="/sign-up" className="text-blue-700 hover:text-blue-800">
              Sign up            
            </Link>
          </p>
    </div>
        </div>
      </div>
    )



}

export default page