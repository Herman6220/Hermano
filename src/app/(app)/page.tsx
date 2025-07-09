'use client'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from "sonner";
import "aos/dist/aos.css";
import AOS from "aos";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function page() {
  const [servicesSummary, setServicesSummary] = useState([])
  const [isServSummloading, setIsServSummLoading] = useState(true)
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  const handleNavigation = (categoryId: string, categoryTitle: string) => {
    router.push(`/${categoryId}/${categoryTitle}`)
  }

  const handleServicesNavigation = async (serviceId: string, serviceTitle: string) => {
    router.push(`/services/${serviceId}/${serviceTitle}`)
  }

  const handleGetAllServices = async () => {
    router.push(`/allServices`)
  }

  const fetchCategory = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/category')
      setCategories(response.data.message || [])
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to fetch categories"
      })
    } finally {
      setIsLoading(false)
    }
  }, [setCategories, setIsLoading])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  const fetchServicesSummary = useCallback(async () => {
    try {
      const response = await axios.get("/api/getServicesSummary")
      setServicesSummary(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to fetch categories"
      })
    } finally {
      setIsServSummLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServicesSummary()
  }, [fetchServicesSummary])

  useEffect(() => {
    AOS.init({
      once: true, // animation triggers only once
    });
  }, []);

  return (
    <>
      <div className="bg-[#0d0012]">
        <div className="min-h-[36rem] w-full overflow-hidden">
          <div>
            <div className='w-full h-[36rem] relative'>
              <div className='bg-blue-500 w-1/3 h-full absolute right-0'>
                <img
                  src="https://res.cloudinary.com/herman000/image/upload/v1751431197/wallpapersden.com_better-call-saul-season-6_3840x2160_vyatrn.jpg"
                  alt='lawyer-image'
                  className='w-full h-full object-cover'
                />
              </div >
              <div style={{
                animation: "slideRight 1.5s ease-out forwards",
              }}>
                <div
                  className='bg-red-500 w-1/4 absolute right-70 transform -skew-x-[8deg]  overflow-hidden'>
                  <div className='transform -skew-x-[-8deg] w-120'>
                    <img
                      src="https://res.cloudinary.com/herman000/image/upload/v1751431196/john-wick-the-boogeyman-in-action-1w4a5ggq6uamgvf3-1w4a5ggq6uamgvf3_nlpasz.jpg"
                      alt='assasin-image'
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>
              </div>
              <div style={{
                animation: "slideRight 3.0s ease-out forwards",
              }}>
                <div className='bg-orange-500 w-5xl absolute right-140 transform -skew-x-[8deg] overflow-hidden'>
                  <div className='transform -skew-x-[-8deg] w-[1320px]'>
                    <img
                      src="https://res.cloudinary.com/herman000/image/upload/v1751431195/wallpaperflare.com_wallpaper_o5nnxq.jpg"
                      alt='assasin-image'
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>
              </div>
              <div
                // data-aos="fade-right"
                className="absolute inset-0 bg-violet-950 [mask-image:linear-gradient(to_right,black,80%,transparent)]"
                style={{ animation: "slideRightBlur 3.0s ease-out forwards" }}
              ></div>
              <h1
                data-aos="fade-right"
                className="absolute top-56 left-28 text-7xl text-white font-extrabold">Hermano.</h1>
              <p className="absolute text-white italic font-light top-74 left-29"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                Legal muscle. Tactical defense. Precision drivers. Silent operators. One call. One code.
              </p>
            </div>
            <style>
              {`
      @keyframes slideRight {
        from {
          transform: translateX(-20px);
        }
        to {
          transform: translateX(0);
        }
      }

      @keyframes slideRightBlur {
        from {
          transform: translateX(-800px);
        }
        to {
        transform: translateX(0)
        }
      }
    `}
            </style>
          </div>
        </div>
        <div className=" text-white py-16 px-6 text-center bg-gradient-to-br from-blue-950 via-black to-blue-500 animate-gradient">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-wide">
            Need Something Done Off the Record?
          </h2>

          <p className="max-w-3xl mx-auto text-lg md:text-xl font-light text-gray-300 mb-12">
            From digital wipes to discreet extractions, we offer elite-grade solutions for those who value privacy, precision, and plausible deniability. No paper trails. No questions asked.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-10 text-center max-w-6xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">99%</div>
              <div className="text-sm text-gray-400">Missions Completed Silently</div>
            </div>
            <div className="w-px h-10 bg-gray-300 hidden sm:block" />
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">40+</div>
              <div className="text-sm text-gray-400">Special Ops Experts</div>
            </div>
            <div className="w-px h-10 bg-gray-300 hidden sm:block" />
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">25+</div>
              <div className="text-sm text-gray-400">High-Risk Services</div>
            </div>
            <div className="w-px h-10 bg-gray-300 hidden sm:block" />
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">10Y</div>
              <div className="text-sm text-gray-400">Untraceable Experience</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full py-5 pb-15 min-h-[80vh] mt-4">
          {isServSummloading ? (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-blue-300" />
            </>
          ) : (
            <>
              {servicesSummary.length > 0 ? (
                <>
                  <div
                    data-aos="fade-up"
                    className="w-full px-24 flex items-center justify-between">
                    <h1 className="text-2xl text-white">Services</h1>
                    <Button
                      type="button"
                      onClick={() => handleGetAllServices()}
                      variant="secondary"
                      className="hover:bg-blue-700 text-white bg-blue-500">See All</Button>
                  </div>
                  <div className="px-12 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 w-full place-items-center">
                    {(servicesSummary as any).map((service: any) => (
                      <div
                        data-aos="fade-up"
                      >
                        <Card
                          key={service._id}
                          className="w-100 h-60 border-none bg-blue-500 hover:scale-105 transition-transform duration-300 rounded-3xl shadow-none px-6"
                          onClick={() => handleServicesNavigation(service._id, service.title)}>
                          <CardTitle className="text-white">{service.title}</CardTitle>
                        </Card>
                      </div>

                    ))}
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>

        <div className="px-8 mx-auto"><Separator className="bg-blue-500" /></div>


        <div className="flex flex-col justify-center items-center w-full py-5 pb-15 min-h-[80vh] mt-4">
          {isLoading ? (
            <Loader2 className="w-10 h-10 animate-spin text-blue-300" />
          ) : (
            <>
              {categories.length > 0 ? (
                <>
                  <div
                    data-aos="fade-up"
                    className="w-full px-12">
                    <h1 className="text-2xl text-white">Categories</h1>
                  </div>
                  <div className="px-12 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 w-full place-items-center">
                    {(categories as any).map((category: any) => (
                      <div
                        data-aos="fade-up"
                      >
                        <Card
                          key={category._id}
                          className="w-100 h-60 bg-blue-500 border-none hover:scale-105 transition-transform duration-300 rounded-3xl shadow-none relative px-6 overflow-hidden group"
                          onClick={() => handleNavigation(category._id, category.title)}>
                          {category.image ? (
                            <>
                              <div className="absolute top-0 left-0 w-full h-full rounded-3xl overflow-hidden">
                                <img
                                  src={category.image}
                                  className="w-full h-full object-cover border-none group-hover:scale-105 group-hover:opacity-70 transition-all duration-400"
                                />
                              </div>
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-in-out" />
                              <div className="absolute flex flex-col gap-2 bottom-5 opacity-0 group-hover:opacity-100 group-hover:bottom-8 transition-all duration-400">
                                <CardTitle className="text-white">{category.title}</CardTitle>
                                {category.description ? (
                                  <CardDescription className="text-white">{category.description}</CardDescription>
                                ) : (null)}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
                              <CardTitle className="text-white">{category.title}</CardTitle>
                              <CardDescription className="text-blue-950">{category.description}</CardDescription>
                            </div>
                          )}
                        </Card>
                      </div>

                    ))}
                  </div>
                </>
              ) : (
                <p>No categories found.</p>
              )}

            </>
          )}
        </div>
      </div>
    </>
  )
}

export default page
