'use client'


import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { addToLocalCart } from '@/lib/localCart'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Loader2, Star, X } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import "aos/dist/aos.css";
import AOS from 'aos'

function page() {

  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSort = searchParams.get("sort") || ""
  const [professionalServices, setProfessionalServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const categoryId = params.categoryId
  const subCategoryId = params.subCategoryId
  const serviceId = params.serviceId
  const serviceName = params.professionals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0])
  const [range, setRange] = useState<[number, number]>([0, 1000])
  const [getMinMax, setGetMinMax] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [sortOption, setSortOption] = useState(initialSort)
  const initialMinPrice = searchParams.get("minPrice") || ""
  const numInitialMinPrice = Number(initialMinPrice)
  const [minPriceValue, setMinPriceValue] = useState<number>(numInitialMinPrice)
  const initialMaxPrice = searchParams.get("maxPrice") || ""
  const numInitialMaxPrice = Number(initialMaxPrice)
  const [maxPriceValue, setMaxPriceValue] = useState<number>(numInitialMaxPrice)

  const getSearchParams = () => {
    const params = new URLSearchParams();
    if (sortOption) params.set('sort', sortOption);
    if (minPriceValue) params.set('minPrice', minPriceValue.toString());
    if (maxPriceValue) params.set('maxPrice', maxPriceValue.toString());
    return params;
  };


  const fetchProfessionalServices = useCallback(async () => {
    try {
      const params = getSearchParams();
      console.log("Fetching with params:", params.toString());
      router.push(`?${params.toString()}`, { scroll: false })
      const response = await axios.get(`/api/category/${categoryId}/subCategory/${subCategoryId}/services/${serviceId}/professionalServices?${params.toString()}`)
      console.log(response.data.message)
      setProfessionalServices(response.data.message)
      setGetMinMax(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to fetch professionals"
      })
    } finally {
      setIsLoading(false)
    }
  }, [categoryId, subCategoryId, serviceId, setProfessionalServices, setIsLoading, sortOption, minPriceValue, maxPriceValue])

  useEffect(() => {
    fetchProfessionalServices()
  }, [fetchProfessionalServices])

  const handleAddToCart = async (professionalService: any) => {
    if (session && session.user.activeRole === "CUSTOMER") {
      try {
        console.log(professionalService)
        const response = await axios.post('/api/customer/cart/save', { professionalService })
        toast("Success", {
          description: response.data.message
        })
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast("Error", {
          description: axiosError.response?.data.message
        })
      }
    } else {
      addToLocalCart(professionalService)
      toast("Success", {
        description: "Item added successfully"
      })
    }

  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  useEffect(() => {
    const getPriceRange = async () => {
      const allPrices = getMinMax.map((prev: any) => prev?.professionalService.price)
        .sort((a, b) => a - b)
      const lowestPrice = allPrices?.[0]
      const highestPrice = allPrices?.[allPrices.length - 1]
      setPriceBounds([lowestPrice, highestPrice])
      setRange([lowestPrice, highestPrice])
    }
    getPriceRange()
  }, [getMinMax])

  const handleFilter = async () => {
    setMinPriceValue(range[0])
    setMaxPriceValue(range[1])
  }

  useEffect(() => {
      const sortParam = searchParams.get("sort");
      if (sortParam) {
        setSortOption(sortParam);
      }
    }, [searchParams]);

  useEffect(() => {
      AOS.init({
        once: true, // animation triggers only once
      });
    }, []);


  return (
    <div className="flex justify-center items-center w-full py-5 pb-15 min-h-[80vh]">
      {isLoading ? (
        <Loader2 className='w-10 h-10 animate-spin' />
      ) : (
        <>
          <div className='flex flex-col justify-start w-5xl min-h-[80vh] items-center'>
            {professionalServices && professionalServices.length > 0 ? (
              <>
                <div className='w-full flex items-center justify-between px-18 py-2 pb-4'>
                  <h1 className='text-2xl'>{(professionalServices as any)?.[0].professionalService.matchedServices.title}</h1>
                  <div className='flex gap-2'>
                    <div ref={dropdownRef}>
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='p-2 rounded-full hover:bg-gray-200'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-60 p-2 border-1 border-gray-300 flex flex-col gap-1">
                          <button
                            className='text-left w-full hover:bg-gray-200 p-2 rounded-sm'
                            onClick={() => setSortOption("")}>
                            Default
                          </button>
                          <button
                            className='text-left w-full hover:bg-gray-200 p-2 rounded-sm'
                            onClick={() => setSortOption("price-asc")}>
                            Price: Low to High
                          </button>
                          <button
                            className='text-left w-full hover:bg-gray-200 p-2 rounded-sm'
                            onClick={() => setSortOption("price-desc")}>
                            Price: High to Low
                          </button>
                          <button
                            className='text-left w-full hover:bg-gray-200 p-2 rounded-sm'
                            onClick={() => setSortOption("name-asc")}>
                            Name: A-Z
                          </button>
                          <button
                            className='text-left w-full hover:bg-gray-200 p-2 rounded-sm'
                            onClick={() => setSortOption("name-desc")}>
                            Name: Z-A
                          </button>
                        </div>
                      )}
                    </div>
                    <div ref={filterDropdownRef}>
                      <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className='p-2 rounded-full hover:bg-gray-200'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                      </button>
                      {isFilterOpen && (
                        <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-60 p-2 border-1 border-gray-300 flex flex-col gap-4">
                          <div className='flex flex-col gap-2'>
                            <p>min: {range[0]} - max: {range[1]}</p>
                            <Slider
                              value={range}
                              onValueChange={(val) => {
                                const newRange = val as [number, number];
                                console.log(newRange[0], newRange[1]);
                                setRange(newRange);
                              }}
                              min={priceBounds[0]}
                              max={priceBounds[1]}
                              step={1000}
                            />
                          </div>
                          <Button
                            onClick={() => handleFilter()}
                            className='bg-blue-500 hover:bg-blue-700'>Apply</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='w-4xl'>
                  {professionalServices.map((professionalService: any) =>
                    <>
                      <Separator />
                      <Card
                        onClick={() => {
                          setSelectedItem(professionalService.professionalService)
                          setIsModalOpen(!isModalOpen)
                        }}
                        className='w-full h-34 grid grid-cols-5 px-4 py-4 shadow-none border-none my-2'>
                        <div className='w-26 h-26 border rounded-2xl overflow-hidden'>
                          <img
                            src={professionalService.professionalService.images[0]}
                            alt='service image'
                            className='object-cover w-full h-full'
                          />
                        </div>
                        <div className='flex flex-col justify-between col-span-3'>
                          <div className=''>
                            <div className='flex gap-2 items-center'>
                              <img
                                src={professionalService.professionalService.matchedProfessionals.profilePicture}
                                className='w-7 h-7 rounded-full object-cover'
                              />
                              <CardTitle>{professionalService.professionalService.matchedProfessionals.fullname}</CardTitle>
                            </div>
                            <CardDescription className='truncate'>{professionalService.professionalService.description}</CardDescription>
                          </div>
                          <div className='flex gap-2 items-center'>
                            <div className='flex'>
                              {[1, 2, 3, 4, 5].map((star) =>
                                <Star className='w-3' fill={professionalService.professionalService.averageRating >= star ? "black" : "none"} />
                              )}
                            </div>
                            <div>{professionalService.professionalService.reviewsCount}</div>
                          </div>
                        </div>
                        <div className='flex flex-col items-end justify-between'>
                          <h1 className='text-3xl font-light'>{((professionalService.professionalService.price) / 100).toFixed(2)} /-</h1>
                          <Button
                            onClick={() => handleAddToCart(professionalService.professionalService)}
                            className='bg-blue-500 hover:bg-blue-700'
                          >Add to cart
                          </Button>
                        </div>
                      </Card>
                      <Separator />
                      <div>
                        {isModalOpen && (
                          <div
                            data-aos="fade-up"
                            onClick={(e) => {
                              // Only close if clicking directly on the backdrop (not modal content)
                              if (e.target === e.currentTarget) {
                                setIsModalOpen(false);
                              }
                            }}
                            className="fixed inset-0 z-50 bg-white/20 flex items-center justify-center">
                            <div className="bg-white rounded-3xl max-w-2xl w-full relative overflow-hidden shadow-md">
                              <Carousel className=''>
                                <CarouselContent>
                                  {selectedItem?.images.map((image: string) =>
                                    <CarouselItem className='overflow-hidden h-80'>
                                      <img
                                        src={image}
                                        alt='service-image'
                                        className='w-full h-full object-cover'
                                      />
                                    </CarouselItem>
                                  )}
                                </CarouselContent>
                                <CarouselPrevious className='left-2 bg-blue border-none shadow-none text-gray-100' />
                                <CarouselNext className='right-2 bg-blue border-none shadow-none text-gray-100' />
                              </Carousel>
                              <div className='p-4 pb-8'>
                                <div className='flex justify-between mb-2'>
                                  <div className='flex gap-2 items-center'>
                                    <img
                                      src={selectedItem?.matchedProfessionals.profilePicture}
                                      alt='profile-picture'
                                      className='w-8 h-8 object-cover rounded-full'
                                    />
                                    <h2>{selectedItem?.matchedProfessionals.fullname}</h2>
                                  </div>
                                  <Button className='bg-blue-500 hover:bg-blue-700'>Add to cart</Button>
                                </div>
                                <div>
                                  <CardDescription>{selectedItem?.description}</CardDescription>
                                </div>
                                <div className='mt-4'>
                                  <h1 className='text-2xl font-light'>{((selectedItem?.price) / 100).toFixed(2)} /-</h1>
                                </div>
                              </div>
                              <button
                                className="absolute top-3 right-3 text-gray-500 p-2 rounded-full hover:bg-gray-300/20"
                                onClick={() => setIsModalOpen(false)}
                              >
                                <X className='w-4 h-4' />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <p>No professionals available for this service</p>

            )}

          </div>
        </>
      )
      }
    </div >
  )
}

export default page