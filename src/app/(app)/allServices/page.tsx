"use client"

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import "aos/dist/aos.css";
import AOS from "aos";
import { useRouter } from 'next/navigation'

function page() {

  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()


  const fetchAllServices = useCallback(async () => {
    try {
      const response = await axios.get("/api/getAllServices")
      setServices(response.data.message)
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
    fetchAllServices()
  }, [fetchAllServices])

  useEffect(() => {
      AOS.init({
        once: true, // animation triggers only once
      });
    }, []);

  const handleServicesNavigation = async (serviceId: string, serviceTitle: string) => {
    router.push(`/services/${serviceId}/${serviceTitle}`)
  }


  return (
    <div className='flex flex-col justify-center items-center w-full py-5 pb-15 min-h-[80vh] bg-[#0d0012]'>
      {isLoading ? (
        <>
          <Loader2 className='w-10 h-10 animate-spin' />
        </>
      ) : (
        <>
          {/* <div>
            <h2>All services</h2>
          </div> */}
          
            {services.length > 0 ? (
              <>
              <div 
              data-aos="fade-up"
              className='w-full px-24'>
                <h3 className='text-2xl'>All services</h3>
              </div>
              <div className="px-12 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 w-full place-items-center">
              {(services as any).map((service: any) => (
                <div
                data-aos="fade-up"
                >
                <Card
                  key={service._id}
                  className="w-100 h-60 hover:scale-105 transition-transform duration-300 rounded-3xl shadow-none px-6 bg-blue-500 border-none"
                  onClick={() => handleServicesNavigation(service._id, service.title)}>
                    <CardTitle className='text-white'>{service.title}</CardTitle>
                </Card>
                </div>
                
              ))}
              </div>
              </>
            ) : (
              <p>No services found.</p>
            )}
          
        </>
      )}
    </div>
  )
}

export default page
