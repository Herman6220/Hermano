import { redirect } from 'next/navigation';

export default function CustomerHome() {
  redirect('/profile/dashboard');
}




// 'use client'

// import { ApiResponse } from '@/types/ApiResponse'
// import axios, { AxiosError } from 'axios'
// import React, { useCallback, useEffect, useState } from 'react'
// import { toast } from 'sonner'
// import { Customer } from '@/model/Customer'
// import { Loader2 } from 'lucide-react'


// function page() {

//   const [activeTab, setActiveTab] = useState<"account" | "orders" | "mobile" | "address">("account")

//   const [isLoading, setIsLoading] = useState(true)
//   const [customer, setCustomer] = useState<Customer | null>(null)

//   const fetchProfile = useCallback(async () => {
//     try {
//       const response = await axios.get('/api/customer/profile')
//       setCustomer(response.data.message || null)
//       console.log(response.data.message)
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>
//       toast("Error", {
//         description: axiosError.response?.data.message
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }, [setCustomer])

//   useEffect(() => {
//     fetchProfile()
//   }, [fetchProfile])
//   return (
//     <div className="flex w-full min-h-[30rem]">
//       {isLoading ? (
//         <Loader2 className="w-10 animate-spin" />
//       ) : (
//         <>
//           <div className='flex'>
//             <aside className="w-64 bg-gray-100 p-2 py-4 border-r">
//               <nav className='flex flex-col gap-1'>
//                   <button
//                     onClick={() => setActiveTab("account")}
//                     className={`text-left p-2 rounded px-3 hover:bg-gray-300 ${activeTab === "account" ? 'font-bold bg-gray-300' : ''}`}
//                   >
//                     My Account
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("orders")}
//                     className={`text-left p-2 rounded px-3 hover:bg-gray-300 ${activeTab === "orders" ? 'font-bold bg-gray-300' : ''}`}
//                   >
//                     Orders
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("mobile")}
//                     className={`text-left p-2 rounded px-3 hover:bg-gray-300 ${activeTab === "mobile" ? 'font-bold bg-gray-300' : ''}`}
//                   >
//                     Mobile
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("address")}
//                     className={`text-left p-2 rounded px-3 hover:bg-gray-300 ${activeTab === "address" ? 'font-bold bg-gray-300' : ''}`}
//                   >
//                     Addressess
//                   </button>
//               </nav>
//             </aside>
//             <div className='flex-1 p-2'>
//               <h1 className='text-5xl font-light'>Welcome, <span className='font-medium'>{customer?.fullname}</span></h1>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default page