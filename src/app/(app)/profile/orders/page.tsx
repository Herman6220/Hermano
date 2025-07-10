"use client"

import { Card, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {format} from "date-fns"

function page() {

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("/api/orders/getOrders")
      setOrders(response.data.message)
      console.log(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])


  return (
    <>
      <div className='flex items-center justify-center min-h-[80vh] bg-[#0d0012]'>
        {isLoading ? (
          <>
            <Loader2 className='w-10 h-10 animate-spin' />
          </>
        ) : (
          <>
            <div className='w-full min-h-[80vh] flex justify-center'>
              <div className='w-5xl flex flex-col gap-2'>
                {orders ? (
                  <>
                    {orders.map((order: any) => (
                      <>
                      {/* <Separator></Separator> */}
                      <div className='bg-blue-500/30 h-[0.1px] w-full'></div>
                        <Card className='w-full h-32 border-none shadow-none overflow-hidden p-4 bg-[#13000b]'>
                          <div className='grid grid-cols-7 gap-2 w-full h-full'>
                          <div className='flex items-center justify-center overflow-hidden h-full w-30 rounded-lg'>
                            <img 
                              src={order.professionalServices.professionalService?.images?.[0]}
                              alt='image'
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <div className='flex flex-col justify-between'>
                            <div>
                              <CardTitle className='text-white'>{order.matchedServices.title}</CardTitle>
                            </div>
                            <div className='flex gap-2 items-center'>
                            <div>
                              <img 
                                src={order.matchedProfessionals.profilePicture}
                                alt='profile picture'
                                className='w-7 h-7 rounded-full'
                              />
                            </div>
                            <p className='text-white'>{order.matchedProfessionals.fullname}</p>
                            </div>
                          </div>
                          <div className='flex item-center justify-center'>
                            <div className='flex flex-col justify-center'>
                              <h2 className='text-sm text-gray-500 text-center'>Ordered on</h2>
                              <h4 className='text-center text-white'>{format(new Date(order.createdAt), "dd MMMM yyyy")}</h4>
                            </div>
                          </div>
                          <div className='flex item-center justify-center'>
                            <div className='flex flex-col justify-center'>
                              <h2 className='text-sm text-gray-500 text-center'>Quantity</h2>
                              <h4 className='text-center text-white'>{order.professionalServices.quantity}</h4>
                            </div>
                          </div>
                          <div className='flex item-center justify-center'>
                            <div className='flex flex-col justify-center'>
                              <h2 className='text-sm text-gray-500 text-center'>Price</h2>
                              <h4 className='text-center text-white'>{((order.professionalServices.professionalService.price)/100).toFixed(2)}</h4>
                            </div>
                          </div>
                          <div className='flex item-center justify-center'>
                            <div className='flex flex-col justify-center'>
                              <h2 className='text-sm text-gray-500 text-center'>Total Price</h2>
                              <h4 className='text-center text-white'>{((order.totalAmount)/100).toFixed(2)}</h4>
                            </div>
                          </div>
                          <div className='flex flex-col gap-1 items-end justify-between'>
                            <div className='w-3/4 flex flex-col items-center'>
                              <p className='text-xs text-gray-500'>Service status:</p>
                            <div className='rounded-full bg-blue-500/50 border border-blue-500 w-full py-1'>
                              <p className='text-center text-xs text-blue-500 font-bold'>{order.status}</p>
                            </div>
                            </div>
                            <div className='w-3/4 flex flex-col items-center'>
                              <p className='text-xs text-gray-500'>Payment status:</p>
                            <div className='rounded-full bg-orange-500/50 border border-orange-500 w-full py-1'>
                              <p className='text-center text-xs text-orange-500 font-bold'>{order.paymentStatus}</p>
                            </div>
                            </div>
                          </div>
                          </div>
                        </Card>
                      </>
                    ))}
                    <div className='bg-blue-500/30 h-[0.1px] w-full'></div>
                  </>
                ) : (
                  <>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default page
