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
import { useState } from "react";
import { Loader2 } from "lucide-react";


function page(){
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof userSignInSchema>>({
        resolver: zodResolver(userSignInSchema),
        defaultValues: {
          email: "",
          password: ""
        }
    })


    const onSubmit = async(data: z.infer<typeof userSignInSchema>) => {
      setIsSubmitting(true)
      const result = await signIn("professional", {
        redirect: false,
        email: data.email,
        password: data.password
      })
      if(result?.error){
        setIsSubmitting(false)
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
        setIsSubmitting(false)
        router.push('/professionals')
        console.log(result)
      }
    }

    return(
      <div className="flex justify-center items-center min-h-screen bg-[#0d0012]">
        <div className="w-full max-w-md p-8 space-y-8 bg-gradient-to-br from-violet-900/20 to-blue-700/80 border border-blue-950 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-2 text-blue-400">
              Sign In as Professional
            </h1>
            <p className="mb-4 text-white">    
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
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input placeholder="email" className="text-white !placeholder-gray-400" {...field} />
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
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" className="text-white !placeholder-gray-400" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 hover:bg-blue-700">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
            </>
          ) : ("SignIn")}
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
          <p className="text-white">
            Not a member?{" "}
            <Link href="/professionals/sign-up" className="text-blue-500 hover:text-blue-700">
              Sign up            
            </Link>
          </p>
    </div>
        </div>
      </div>
    )



}

export default page