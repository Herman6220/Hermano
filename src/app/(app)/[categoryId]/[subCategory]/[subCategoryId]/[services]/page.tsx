'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

function page() {

    const [services, setServices] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const params = useParams()
    const subCategoryId = params.subCategoryId
    const categoryId = params.categoryId
    const categoryTitle = params.subCategory
    const subCategoryTitle = params.services

    const handleNavigation = (serviceId: string, serviceTitle: string) => {
        router.push(`/${categoryId}/${categoryTitle}/${subCategoryId}/${subCategoryTitle}/${serviceId}/${serviceTitle}`)
    }

    const fetchServices = useCallback(async() => {
        try {
            const response = await axios.get(`/api/category/${categoryId}/subCategory/${subCategoryId}/services`)
            setServices(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("Error",{
                description: axiosError.response?.data.message || "Failed to fetch services"
            })
        }finally{
            setIsLoading(false)
        }
    }, [categoryId, subCategoryId, setIsLoading, setServices])

    useEffect(() => {
        fetchServices()
    }, [fetchServices])

  return (
    <div className="flex flex-col justify-center items-center w-full py-5 pb-15 min-h-[80vh] bg-[#0d0012]">
      {isLoading ? (
        <Loader2 className="w-10 h-10 animate-spin" />
      ) : (
        <div className="mt-4 px-12 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full place-items-center">
      {services.length > 0 ? (
        (services as any).map((service: any) => (
           <Card 
            key={service._id} 
            className="w-100 h-60 hover:scale-105 transition-transform duration-300 rounded-3xl shadow-none bg-blue-500 border-none" 
            onClick={() => handleNavigation(service._id, service.title)}>
  <CardHeader>
    <CardTitle>{service.title}</CardTitle>
  </CardHeader>
</Card>
        ))
      ) : (
        <p>No services found.</p>
      )}
    </div>
      )}
    </div>
  )
}

export default page