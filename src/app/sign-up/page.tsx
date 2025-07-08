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
            console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast("signup failed", {
                description: errorMessage
            })
            setIsSubmitting(false)
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ScrollArea className="w-full max-w-md p-6 bg-white rounded-lg shadow-md max-h-[90vh] overflow-hidden flex flex-col ">
        <div className='m-2'>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-6">
            Sign Up as Customer
          </h1>
          <p className="mb-4">
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field}
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} 
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Johny Storm" {...field} 
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
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="phone no." {...field} 
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="address" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
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
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-700 hover:text-blue-800">
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