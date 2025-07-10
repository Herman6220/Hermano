'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'


function Page() {

  const [subCategories, setSubcategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const categoryId = params.categoryId
  const categoryTitle = params.subCategory
  const router = useRouter()

  const handleNavigation = (subCategoryId: string, subCategoryTitle: string) => {
    router.push(`/${categoryId}/${categoryTitle}/${subCategoryId}/${subCategoryTitle}`)
  }


  const fetchSubCategory = useCallback(async () => {
    try {
      const response = await axios.get(`/api/category/${categoryId}/subCategory`)
      setSubcategories(response.data.message || [])
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to fetch sub categories"
      })
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading, setSubcategories, categoryId])

  useEffect(() => {
    fetchSubCategory()
  }, [fetchSubCategory])

  return (
    <div className="flex flex-col justify-center items-center w-full py-5 pb-15 min-h-[80vh] bg-[#0d0012]">
      {isLoading ? (
        <Loader2 className="w-10 h-10 animate-spin" />
      ) : (
        <div className="mt-4 px-12 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full place-items-center">
          {subCategories.length > 0 ? (
            (subCategories as any).map((subCategory: any) => (
              <Card
                key={subCategory._id}
                className="w-100 h-60 hover:scale-105 transition-transform px-6 duration-300 rounded-3xl shadow-none bg-blue-500 border-none"
                onClick={() => handleNavigation(subCategory._id, subCategory.title)}>
                  <CardTitle className='text-white'>{subCategory.title}</CardTitle>
              </Card>
            ))
          ) : (
            <p>No sub categories found.</p>
          )}
        </div>
      )} 
    </div>
  )
}

export default Page