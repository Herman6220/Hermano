'use client'

import { customerSignUpSchema } from '@/schemas/customerSignUpSchema'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'

function page() {
    const [isSubmitting, setIsSubmitting] = useState(false) 
    const router = useRouter()
    const form = useForm<z.infer<typeof customerSignUpSchema>>({
        resolver: zodResolver(customerSignUpSchema),
        defaultValues: {
            email: "",
            password: "",
            fullname: "",
            phone: "",
            address: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof customerSignUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>("api/customer/sign-up", data)
            toast("success", {
                description: response.data.message
            })
            router.replace('/')
            setIsSubmitting(false)
        } catch (error) {
            // console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast("signup failed", {
                description: errorMessage
            })
            setIsSubmitting(false)
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0d0012]">
      <ScrollArea className="w-full max-w-md p-6 bg-gradient-to-br from-violet-900/20 to-blue-700/80 border border-blue-950 rounded-lg shadow-md max-h-[90vh] overflow-hidden flex flex-col ">
        <div className='m-2'>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-6 text-blue-400">
            Sign Up as Customer
          </h1>
          <p className="mb-4 text-white">
            Enter your details
          </p>
        </div>
      
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" className="text-white !placeholder-gray-400" {...field}
                    />
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
              <FormLabel className='text-white'>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" className="text-white !placeholder-gray-400" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Johny Storm" className="text-white !placeholder-gray-400" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="phone no." className="text-white !placeholder-gray-400" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Address</FormLabel>
              <FormControl>
                <Input placeholder="address" className="text-white !placeholder-gray-400" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className='w-full bg-blue-500 hover:bg-blue-700'>
          {
            isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait    
              </>
            ) : ("Signup")
          }
        </Button> 

          </form>
        </Form>
        <div className="text-center mt-4">
          <p className='text-white'>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:text-blue-700">
              Sign in            
            </Link>
          </p>
    </div>
      </div>
      </div>
      </ScrollArea>
    </div>
  )
}

export default page