"use client"

import { Card, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Customer } from '@/model/Customer'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

function page() {


  const [isLoading, setIsLoading] = useState(true)
  const [customer, setCustomer] = useState<Customer | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get('/api/customer/profile')
      setCustomer(response.data.message || null)
      console.log(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message
      })
    } finally {
      setIsLoading(false)
    }
  }, [setCustomer])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])


  return (
    <div className='flex justify-center items-center min-h-[80vh]'>
      {isLoading ? (
        <>
          <Loader2 className='w-10 h-10 animate-spin' />
        </>
      ) : (
        <>
          <div className='w-full min-h-[80vh]'>
            <div>
              <Card className='px-6'>
                <div className="flex divide-x divide-gray-300 w-full min-h-24">
                  <div className="flex-1 px-4 text-left">
                    <h1 className='text-3xl font-light mb-2'>Welcome, <span className='font-medium'>{customer?.fullname}</span></h1>
                    <p>{customer?.email}</p>
                  </div>
                  <div className="flex-1 px-4 text-left">
                    <p className='text-gray-500 border-b inline-block mb-2'>Contacts</p>
                    <p>{customer?.phone}</p>
                  </div>
                  <div className="flex-1 px-4 text-left">
                    <p className='text-gray-500 border-b inline-block mb-2'>Addressess</p>
                    <p>{customer?.address}</p>
                  </div>
                </div>

              </Card>
              <Separator className='my-4' />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default page
