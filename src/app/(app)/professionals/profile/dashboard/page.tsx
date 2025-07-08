'use client'

import { Professional } from '@/model/Professional'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

function page() {
    const {data: session} = useSession()
    const user:User = session?.user as User
    const [isLoading, setIsLoading] = useState(true)
    const [isToggling, setIsToggling] = useState(false)
    const [professional, setProfessional] = useState<Professional | null>(null)

    const handleToggleIsActive = async() => {
      setIsToggling(true)
      try {
        const response = await axios.patch('/api/professional/toggleIsActive')
        fetchProfessionalProfile();
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
            toast("Error", {
                description: axiosError.response?.data.message
            })
      }finally{
        setIsToggling(false)
      }
    }

    const fetchProfessionalProfile = useCallback(async () => {
        try {
            const response = await axios.get('/api/professional/profile')
            setProfessional(response.data.message || null)
            console.log(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("Error", {
                description: axiosError.response?.data.message
            })
        } finally {
            setIsLoading(false)
        }
    }, [setIsLoading, setProfessional])

    useEffect(() => {
        fetchProfessionalProfile()
    }, [fetchProfessionalProfile])


    return (
        <div className='flex items-center justify-center min-h-[80vh]'>
            {isLoading ? (
                <Loader2 className="w-10 animate-spin" />
            ) : ( 
                <>
                    {!session || session.user.activeRole !== "PROFESSIONAL" ? (
                        <>
                            <div className='flex flex-col items-center gap-2'>
                                <p>Please Login to get your profile.</p>
                                <Link href="/professionals/sign-in">
                                    <Button className='bg-blue-700 hover:bg-blue-800'>Login</Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                <div className='w-full h-full flex justify-center items-center'>
                    <div className='w-5xl min-h-[80vh] py-4'>
                            <Card className='grid grid-cols-5 items-center min-h-50 overflow-hidden p-4 rounded-3xl'>
                              <div className='h-45 aspect-square rounded-xl overflow-hidden'>
                                <img 
                                  src={professional?.profilePicture}
                                  alt='profile picture' 
                                  className='object-cover w-full h-full'
                                />
                              </div>
                              <div className='flex flex-col gap-2 items-start h-full col-span-3'>
                                <div>
                                  <CardTitle className='text-2xl'>{professional?.fullname}</CardTitle>
                                <CardDescription>{professional?.description}</CardDescription>
                                </div>
                                <div>
                                  <p className='text-sm inline-block border-b text-gray-500'>Contacts</p>
                                  <p className='text-sm'>{professional?.phone}</p>
                                </div>
                                <div>
                                  <p className='text-sm inline-block border-b text-gray-500'>Locations</p>
                                  <p className='text-sm'>{professional?.location}</p>
                                </div>
                                
                              </div>
                              <div className='flex flex-col items-end justify-between h-full'>
                                <div>
                                  <Switch 
                                  checked={professional?.isActive}
                                  onCheckedChange={() => handleToggleIsActive()}
                                  disabled={isToggling}
                                  className='data-[state=checked]:bg-blue-500'
                                />
                                </div>
                                <div className={`rounded-full p-1 px-4 ${professional?.status === "REJECTED" ? "bg-red-800" : professional?.status === "ACTIVE" ? "bg-green-500" : professional?.status === "SUSPENDED" ? "bg-orange-500" : "bg-blue-500"}`}>
                                  <h3 className={`text-white ${professional?.status === "REJECTED" ? "line-through" : ""}`}>{professional?.status}</h3>
                                </div>
                              </div>
                            </Card>
                            {/* <div>
                              <h1 className='text-5xl'>Services</h1>
                              <div>

                              </div>
                            </div> */}
                    </div>
                </div>
                </>
                    )}
                </>
                
            )}
        </div>
    )
}

export default page