import { redirect } from 'next/navigation';

export default function CustomerHome() {
  redirect('/professionals/profile/dashboard');
}



// 'use client'

// import { Professional } from '@/model/Professional'
// import { ApiResponse } from '@/types/ApiResponse'
// import axios, { AxiosError } from 'axios'
// import React, { useCallback, useEffect, useState } from 'react'
// import { toast } from 'sonner'
// import { Loader2 } from 'lucide-react'
// import { useSession } from 'next-auth/react'
// import { User } from 'next-auth'
// import { Button } from '@/components/ui/button'
// import Link from 'next/link'

// function page() {
//     const {data: session} = useSession()
//     const user:User = session?.user as User
//     const [isLoading, setIsLoading] = useState(true)
//     const [professional, setProfessional] = useState<Professional | null>(null)

//     const fetchProfessionalProfile = useCallback(async () => {
//         try {
//             const response = await axios.get('/api/professional/profile')
//             setProfessional(response.data.message || null)
//             console.log(response.data.message)
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>
//             toast("Error", {
//                 description: axiosError.response?.data.message
//             })
//         } finally {
//             setIsLoading(false)
//         }
//     }, [setIsLoading])

//     useEffect(() => {
//         fetchProfessionalProfile()
//     }, [fetchProfessionalProfile])


//     return (
//         <div className='flex items-center justify-center min-h-[30rem]'>
//             {isLoading ? (
//                 <Loader2 className="w-10 animate-spin" />
//             ) : ( 
//                 <>
//                     {!session || session.user.activeRole !== "PROFESSIONAL" ? (
//                         <>
//                             <div className='flex flex-col items-center gap-2'>
//                                 <p>Please Login to get your profile.</p>
//                                 <Link href="/professionals/sign-in">
//                                     <Button className='bg-blue-700 hover:bg-blue-800'>Login</Button>
//                                 </Link>
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                 <div className='w-full h-full flex justify-end p-5'>
//                     <div className='w-5xl min-h-[30rem]'>
//                         <div className='flex items-center gap-4'>
//                             <div className='w-16 h-16 overflow-hidden'>
//                                 <img
//                                     src={professional?.profilePicture}
//                                     alt='Professional profile picture'
//                                     className='w-full h-full rounded-full object-cover'
//                                 />
//                             </div>
//                             <div>
//                                 <h1 className='font-semibold'>{professional?.fullname}</h1>
//                                 <p>{professional?.description}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 </>
//                     )}
//                 </>
                
//             )}
//         </div>
//     )
// }

// export default page