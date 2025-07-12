"use client"

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { addToLocalCart } from '@/lib/localCart'
import { ApiResponse } from '@/types/ApiResponse'
import "aos/dist/aos.css";
import AOS from 'aos'
import axios, { AxiosError } from 'axios'
import { Loader2, Star, X } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

function page() {

  const router = useRouter()

  const { data: session } = useSession()
  const user: User = session?.user as User
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("searchTerm")
  const initialSort = searchParams.get("sort") || ""
  const [sortOption, setSortOption] = useState(initialSort)
  const initialMinPrice = searchParams.get("minPrice") || ""
  const numInitialMinPrice = Number(initialMinPrice)
  const [minPriceValue, setMinPriceValue] = useState<number>(numInitialMinPrice)
  const initialMaxPrice = searchParams.get("maxPrice") || ""
  const numInitialMaxPrice = Number(initialMaxPrice)
  const [maxPriceValue, setMaxPriceValue] = useState<number>(numInitialMaxPrice)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState([])

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const filterDropdownRef = useRef<HTMLDivElement>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0])
  const [range, setRange] = useState<[number, number]>([0, 1000])
  const [getMinMax, setGetMinMax] = useState([])


  const getSearchParams = () => {
    const params = new URLSearchParams();
    params.set('searchTerm', searchTerm || '');
    if (sortOption) params.set('sort', sortOption);
    if (minPriceValue) params.set('minPrice', minPriceValue.toString());
    if (maxPriceValue) params.set('maxPrice', maxPriceValue.toString());
    return params;
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) {
        return
      }
      try {
        const params = getSearchParams();
        params.set('searchTerm', searchTerm);
        // console.log("Fetching with params:", params.toString());

        router.push(`?${params.toString()}`, { scroll: false })

        const response = await axios.get(`/api/searchServices?${params.toString()}`);
        // console.log(response.data.message);
        setSearchResults(response.data.message);
        setGetMinMax(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast("Error", {
          description: axiosError.response?.data.message
        })
      } finally {
        setIsLoading(false)
      }

    }
    // console.log("searchTerm and sortOption", searchTerm, sortOption)
    fetchResults()
  }, [searchTerm, sortOption, minPriceValue, maxPriceValue])


  const handleAddToCart = async (professionalService: any) => {
    if (session && session.user.activeRole === "CUSTOMER") {
      try {
        // console.log(professionalService)
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
      const response = addToLocalCart(professionalService)
      toast("Success", {
        description: response
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
    <div className="flex justify-center items-center w-full py-5 pb-15 min-h-[80vh] bg-[#0d0012]">
      
      {isLoading ? (
        <Loader2 className='w-10 h-10 animate-spin text-blue-500' />
      ) : (
        <>
          
          <div className='flex flex-col justify-start w-5xl min-h-[80vh] items-center'>
            {searchResults && searchResults.length > 0 ? (
              <>
                <div className='w-full flex items-center justify-between px-18 py-2 pb-4'>
                  <h1 className='text-2xl text-white'>Search results for '{searchTerm}'</h1>
                  <div className='flex gap-2'>
                    <div ref={dropdownRef}>
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='p-2 rounded-full hover:bg-gray-800'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="absolute right-90 mt-2 w-48 bg-black/50 backdrop-blur-[5px] rounded-md shadow-lg z-60 p-2 border-1 border-blue-950 flex flex-col gap-1">
                          <button
                            className='text-left w-full hover:bg-gray-800 p-2 rounded-sm text-white'
                            onClick={() => setSortOption("")}>
                            Default
                          </button>
                          <button
                            className='text-left w-full hover:bg-gray-800 p-2 rounded-sm text-white'
                            onClick={() => setSortOption("price-asc")}>
                            Price: Low to High
                          </button>
                          <button
                            className='text-left w-full hover:bg-gray-800 p-2 rounded-sm text-white'
                            onClick={() => setSortOption("price-desc")}>
                            Price: High to Low
                          </button>
                          <button
                            className='text-left w-full hover:bg-gray-800 p-2 rounded-sm text-white'
                            onClick={() => setSortOption("name-asc")}>
                            Name: A-Z
                          </button>
                          <button
                            className='text-left w-full hover:bg-gray-800 p-2 rounded-sm text-white'
                            onClick={() => setSortOption("name-desc")}>
                            Name: Z-A
                          </button>
                        </div>
                      )}
                    </div>
                    <div ref={filterDropdownRef}>
                      <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className='p-2 rounded-full hover:bg-gray-800'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                      </button>
                      {isFilterOpen && (
                        <div className="absolute right-79 mt-2 w-48 bg-black/50 backdrop-blur-[5px] rounded-md shadow-lg z-60 p-4 border-1 border-blue-950 flex flex-col gap-4">
                          <div className='flex flex-col gap-2'>
                            <p className='text-white'>min: {range[0]} - max: {range[1]}</p>
                            <Slider
                              value={range}
                              onValueChange={(val) => {
                                const newRange = val as [number, number];
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
                <div className='h-[0.1px] w-4xl bg-blue-500'></div>
                <div className='w-4xl'>
                  {searchResults.map((searchResult: any) =>
                    <div>
                      <Card
                        onClick={() => {
                          setSelectedItem(searchResult.professionalService)
                          setIsModalOpen(!isModalOpen)
                        }}
                        className='w-full h-34 grid grid-cols-5 px-4 py-4 shadow-none border-none my-2 bg-[#0d0012]'>
                        <div className='w-26 h-26 rounded-2xl overflow-hidden'>
                          <img
                            src={searchResult.professionalService.images[0]}
                            alt='service image'
                            className='object-cover w-full h-full'
                          />
                        </div>
                        <div className='flex flex-col justify-between col-span-3'>
                          <div className=''>
                            <div className='flex gap-2 items-center'>
                              <img
                                src={searchResult?.professionalService.matchedProfessionals?.profilePicture}
                                className='w-7 h-7 rounded-full object-cover'
                              />
                              <CardTitle className='text-white'>{searchResult?.professionalService.matchedProfessionals.fullname}</CardTitle>
                            </div>
                            <CardDescription className='truncate'>{searchResult?.professionalService.description}</CardDescription>
                          </div>
                          <div className='flex gap-2 items-center'>
                            <div className='flex'>
                              {[1, 2, 3, 4, 5].map((star) =>
                                <Star className='w-3' stroke='white' strokeWidth="0.5px" fill={searchResult?.professionalService.averageRating >= star ? "blue" : "none"} />
                              )}
                            </div>
                            <div><p className='text-white font-light'>{searchResult?.professionalService.reviewsCount}</p></div>
                          </div>
                        </div>
                        <div className='flex flex-col items-end justify-between'>
                          <h1 className='text-3xl font-light text-white'>{((searchResult?.professionalService.price) / 100).toFixed(2)} /-</h1>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(searchResult?.professionalService)}}
                            className='bg-blue-500 hover:bg-blue-700'
                          >Add to cart
                          </Button>
                        </div>
                      </Card>
                      {/* <Separator /> */}
                      <div className='bg-blue-500/30 h-[0.1px] w-full'></div>
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
                            className="fixed inset-0 bg-black/5  z-50 flex items-center justify-center ">
                            <div className="bg-black/50 backdrop-blur-[5px] rounded-3xl max-w-2xl w-full relative overflow-hidden border border-blue-950">
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
                                    <h2 className='text-white'>{selectedItem?.matchedProfessionals.fullname}</h2>
                                  </div>
                                  <Button 
                                    onClick={() => {
                                      handleAddToCart(selectedItem)}}
                                    className='bg-blue-500 hover:bg-blue-700'>Add to cart</Button>
                                </div>
                                <div>
                                  <CardDescription>{selectedItem?.description}</CardDescription>
                                </div>
                                <div className='mt-4'>
                                  <h1 className='text-2xl font-light text-white'>{((selectedItem?.price) / 100).toFixed(2)} /-</h1>
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
                    </div>
                  )}
                </div>
                
              </>

            ) : (
              <p className='text-white'>No professionals available for this service</p>
            )}
          </div>
          
        </>
        
      )}
      
    </div>
  )
}

export default page
