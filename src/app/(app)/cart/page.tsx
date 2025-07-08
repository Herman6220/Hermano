'use client'

import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import { Loader2, Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSession, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'
import { getLocalCart, removeFromLocalCart, updateLocalCartQuantity } from '@/lib/localCart'
import { useRouter } from 'next/navigation'
import { Customer } from '@/model/Customer'

function page() {
  const [isLoading, setIsLoading] = useState(true)
  const [cart, setCart] = useState<any>([])
  const [transformedSubTotal, setTransformedSubTotal] = useState(0)
  const [taxes, setTaxes] = useState(0)
  const [total, setTotal] = useState(0)

  const router = useRouter()

  const { data: session, status } = useSession()
  const user: User = session?.user as User


  const fetchCart = useCallback(async () => {
    setIsLoading(true)

    console.log(session)

    if (status === "loading") return

    if (session && session.user.activeRole === "CUSTOMER") {
      try {
        const response = await axios.get('/api/customer/cart/get')
        setCart(response.data.message?.[0]?.cartItems || null)
        console.log(response.data.message?.[0]?.cartItems)
        console.log("cart", cart)

      } catch (error) {
        console.log(error)
        const axiosError = error as AxiosError<ApiResponse>
        toast("Error", {
          description: axiosError.response?.data.message
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      const response = getLocalCart();
      console.log(response)
      setCart(response)
      setIsLoading(false)
    }
  }, [setCart, setIsLoading, status])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])


  const handleDeleteItem = async (professionalServiceId: string) => {
    if (session && session.user.activeRole === "CUSTOMER") {
      try {
        const response = await axios.delete('/api/customer/cart/remove', { data: { professionalServiceId } })
        toast("Success", {
          description: response.data.message
        })
        fetchCart();
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast("Error", {
          description: axiosError.response?.data.message
        })
      }
    } else {
      removeFromLocalCart(professionalServiceId);
      setCart((prev: any) => prev.filter((item: any) => item.professionalService._id !== professionalServiceId))
    }
  }

  const handleQuantityUpdate = async (professionalServiceId: string, adjustment: number) => {
    console.log(professionalServiceId, adjustment)
    console.log(session)
    if (session && session.user.activeRole === "CUSTOMER") {
      try {
        const response = await axios.patch('/api/customer/cart/update', { professionalServiceId, adjustment })
        toast("Success", {
          description: response.data.message
        })
        fetchCart();
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast("Error", {
          description: axiosError.response?.data.message
        })
      }
    } else {
      updateLocalCartQuantity(professionalServiceId, adjustment);
      console.log(adjustment)
      setCart((prev: any) => prev.map((item: any) =>
        item.professionalService._id === professionalServiceId
          ? { ...item, quantity: item.quantity + adjustment }
          : item
      ).filter((item: any) => item.quantity > 0)
      )
    }

  }

  useEffect(() => {
    if (cart && cart.length > 0) {
      const subTotal = cart.reduce((sum: number, cartItem: any) => sum + (cartItem.professionalService.price * cartItem.quantity), 0)
      const tax = subTotal * 0.10
      setTransformedSubTotal(Number((subTotal / 100).toFixed(2)))
      setTaxes(Number(((subTotal * 0.10) / 100).toFixed(2)))
      setTotal(Number(((subTotal + tax) / 100).toFixed(2)))
    }
  }, [cart])


  const fetchCustomer = async () => {
    try {
      const response = await axios.get("/api/customer/profile")
      console.log("customer fetched", response.data.message)
      return response.data.message;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message
      })
    }
  }


  const handlePurchase = async (cart: any) => {
    if (!session || session.user.activeRole !== "CUSTOMER") {
      toast("Error", {
        description: "Please login as a customer to make a purchase."
      })
      router.push("/sign-in");
      return;
    }

    const items = cart.map((item: any) => ({
      professionalServiceId: item.professionalService._id,
      quantity: item.quantity
    }))

    const fetchedCustomer = await fetchCustomer()

    const serviceLocation = fetchedCustomer.address;

    const cartForCheckout = {
      items: items,
      serviceLocation: serviceLocation
    }

    // cartForCheckout.push({ serviceLocation: serviceLocation })

    console.log("cart for checkout", cartForCheckout)

    try {
      const response = await axios.post("/api/orders", {cartForCheckout})

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response.data.message.amount,
        currency: "INR",
        name: "Hermano",
        description: "",
        order_id: response.data.message.orderId,
        handler: function () {
          toast("Success", {
            description: "Payment successfull"
          })
        },
        prefill: {
          email: session.user.email
        }
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.open()
    } catch (error) {
      console.error("An error occurred", error)
    }
  }





  return (
    <div className='flex justify-center w-full py-4 px-5 min-h-[80vh]'>
      <div className='w-full max-w-6xl'>
        <h1 className='text-3xl px-4 pb-4'>Cart</h1>
        {isLoading ? (
          <div className='flex justify-center items-center w-full h-full'>
            <Loader2 className='w-10 h-10 animate-spin' />
          </div>
        ) : (
          <>
            {session && session.user.activeRole === "CUSTOMER" ? (
              <>
                {cart && cart.length > 0 ? (
                  <div className='flex gap-4 pb-10'>
                    <div className='flex flex-col gap-2 w-200'>
                      <Separator className='w-full'></Separator>
                      {(cart as any).map((cartItem: any) => (
                        <>
                          <Card key={cartItem._id} className='w-full h-24 border-none shadow-none overflow-hidden p-2'>
                            <div className='grid grid-cols-5 gap-2 w-full h-full'>
                              <div className='flex border items-center justify-center overflow-hidden h-full w-30 rounded-lg'>
                                <img src={cartItem.professionalService.images[0]} alt="Service" className='w-full h-full object-cover' />
                              </div>
                              <div className='flex flex-col justify-between'>
                                <CardTitle>{cartItem.professionalService.matchedServices.title}</CardTitle>
                                <div className='flex gap-2 items-center'>
                                  <div className='overflow-hidden'>
                                    <img
                                      src={cartItem.professionalService.matchedProfessionals.profilePicture}
                                      alt='profile picture'
                                      className='w-7 h-7 rounded-full object-cover'
                                    />
                                  </div>
                                  <p>{cartItem.professionalService.matchedProfessionals.fullname}</p>
                                </div>
                              </div>
                              <div className='flex items-center'>
                                <h3 className='font-light'>{((cartItem.professionalService.price) / 100).toFixed(2)} /-</h3>
                              </div>
                              <div className='flex items-center justify-center gap-2'>
                                <div className='flex justify-center items-center bg-gray-300 w-5 h-5 rounded-sm shadow-sm'>
                                  <button onClick={() => handleQuantityUpdate(cartItem.professionalService._id, -1)}>
                                    <Minus className='w-3 h-3' />
                                  </button>
                                </div>
                                <h1 className='text-2xl font-light'>{cartItem.quantity}</h1>
                                <div className='flex justify-center items-center bg-gray-300 w-5 h-5 rounded-sm shadow-sm'>
                                  <button onClick={() => handleQuantityUpdate(cartItem.professionalService._id, 1)}>
                                    <Plus className='w-3 h-3' />
                                  </button>
                                </div>
                              </div>
                              <div className='flex flex-col justify-between items-end'>
                                <button onClick={() => handleDeleteItem(cartItem.professionalService._id)}>
                                  <X className='w-4' />
                                </button>
                                <div>
                                  <h3 className='font-light'>{((cartItem.professionalService.price * cartItem.quantity) / 100).toFixed(2)} /-</h3>
                                </div>
                              </div>
                            </div>
                          </Card>
                          <Separator className='w-full'></Separator>
                        </>
                      ))}

                    </div>
                    <div className='sticky top-22 self-start'>
                      <Card className='w-100 h-full flex flex-col gap-2 px-6 justify-between'>
                        <div className='flex flex-col items-center justify-center w-full h-40'>
                          <p className='text-sm'>Total amount</p>
                          <h1 className='text-2xl font-bold'>{total}</h1>
                        </div>
                        <Separator />
                        <div>
                          <p className='text-[12px] text-gray-700 font-semibold'>Order summary</p>
                          <div className='py-1'>
                            {cart.map((cartItem: any) =>
                              <div className='flex justify-between items-center'>
                                <p className='text-xs text-gray-700'>{cartItem.professionalService.matchedServices.title}</p>
                                <p className='text-xs text-gray-700'>{(((cartItem.professionalService.price) * cartItem.quantity) / 100).toFixed(2)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <Separator />
                        <div className='flex justify-between items-center'>
                          <p className='text-xs text-gray-700'>Subtotal</p>
                          <p className='text-xs text-gray-700'>
                            {transformedSubTotal}
                          </p>
                        </div>
                        <div className='flex justify-between items-center'>
                          <p className='text-xs text-gray-700'>Taxes</p>
                          <p className='text-xs text-gray-700'>
                            {taxes}
                          </p>
                        </div>
                        <Separator />
                        <div className='flex justify-between items-center py-3'>
                          <h4 className='text-sm font-semibold'>Total</h4>
                          <h4 className='text-sm font-semibold'>{total}</h4>
                        </div>
                        <div className='w-full'>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePurchase(cart);
                            }}
                            className='w-full bg-blue-500 hover:bg-blue-700'>Checkout</Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className='flex flex-col gap-2 justify-center items-center w-full h-[50vh]'>
                      <p>Your bag feels light, Fill it up with services.</p>
                      <Link href='/'>
                        <Button className='bg-blue-500 hover:bg-blue-700 w-38'>Browse services</Button>
                      </Link>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {cart && cart.length > 0 ? (
                  <>
                    <div className='flex gap-4 pb-10'>
                      <div className='flex flex-col gap-2 w-200'>
                        <Separator className='w-full'></Separator>
                        {(cart as any).map((cartItem: any) => (
                          <>
                            <Card key={cartItem._id} className='w-200 h-24 border-none shadow-none overflow-hidden p-2'>
                              <div className='grid grid-cols-5 gap-2 w-full h-full'>
                                <div className='flex border items-center justify-center overflow-hidden h-full w-30 rounded-md'>
                                  <img src={cartItem.professionalService.images[0]} alt="Service" className='w-full h-full object-cover' />
                                </div>
                                <div className='flex flex-col justify-between'>
                                  <CardTitle>{cartItem.professionalService.matchedServices.title}</CardTitle>
                                  <div className='flex gap-2 items-center'>
                                    <img
                                      className='w-7 h-7 rounded-full object-cover'
                                      src={cartItem.professionalService.matchedProfessionals.profilePicture}
                                    />
                                    <p>{cartItem.professionalService.matchedProfessionals.fullname}</p>
                                  </div>
                                </div>
                                <div className='flex items-center'>
                                  <h3 className='font-light'>{((cartItem.professionalService.price) / 100).toFixed(2)} /-</h3>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                  <div className='flex justify-center items-center bg-gray-300 w-5 h-5 rounded-sm shadow-sm'>
                                    <button onClick={() => handleQuantityUpdate(cartItem.professionalService._id, -1)}>
                                      <Minus className='w-3 h-3' />
                                    </button>
                                  </div>
                                  <h1 className='text-2xl font-light'>{cartItem.quantity}</h1>
                                  <div className='flex justify-center items-center bg-gray-300 w-5 h-5 rounded-sm shadow-sm'>
                                    <button onClick={() => handleQuantityUpdate(cartItem.professionalService._id, 1)}>
                                      <Plus className='w-3 h-3' />
                                    </button>
                                  </div>
                                </div>
                                <div className='flex flex-col justify-between items-end'>
                                  <button
                                    onClick={() => handleDeleteItem(cartItem.professionalService._id)}
                                    className='hover:bg-gray-200 p-2 rounded-full'
                                  >
                                    <X className='w-4 h-4' />
                                  </button>
                                  <div>
                                    <h3 className='font-light'>{((cartItem.professionalService.price * cartItem.quantity) / 100).toFixed(2)} /-</h3>
                                  </div>
                                </div>
                              </div>
                            </Card>
                            <Separator></Separator>
                          </>
                        ))}
                      </div>
                      <div className='sticky top-22 self-start'>
                        <Card className='w-100 h-full flex flex-col gap-2 px-6 justify-between'>
                          <div className='flex flex-col items-center justify-center w-full h-40'>
                            <p className='text-sm'>Total amount</p>
                            <h1 className='text-2xl font-bold'>{total}</h1>
                          </div>
                          <Separator />
                          <div>
                            <p className='text-[12px] text-gray-700 font-semibold'>Order summary</p>
                            <div className='py-1'>
                              {cart.map((cartItem: any) =>
                                <div className='flex justify-between items-center'>
                                  <p className='text-xs text-gray-700'>{cartItem.professionalService.matchedServices.title}</p>
                                  <p className='text-xs text-gray-700'>{(((cartItem.professionalService.price) * cartItem.quantity) / 100).toFixed(2)}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <Separator />
                          <div className='flex justify-between items-center'>
                            <p className='text-xs text-gray-700'>Subtotal</p>
                            <p className='text-xs text-gray-700'>
                              {transformedSubTotal}
                            </p>
                          </div>
                          <div className='flex justify-between items-center'>
                            <p className='text-xs text-gray-700'>Taxes</p>
                            <p className='text-xs text-gray-700'>
                              {taxes}
                            </p>
                          </div>
                          <Separator />
                          <div className='flex justify-between items-center py-3'>
                            <h4 className='text-sm font-semibold'>Total</h4>
                            <h4 className='text-sm font-semibold'>{total}</h4>
                          </div>

                          <div className='w-full'>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePurchase(cart);
                              }}
                              className='w-full bg-blue-500 hover:bg-blue-700'>Login to Checkout</Button>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex flex-col justify-center items-center w-full h-full'>
                      <p>Your bag feels light, Fill it up with services.</p>
                      <p>Add services or Login.</p>
                      <div className='flex gap-4 m-2'>
                        <Link href='/'>
                          <Button className='bg-blue-500 hover:bg-blue-700 w-38'>Browse services</Button>
                        </Link>
                        <Link href='/sign-in'>
                          <Button variant='outline' className='w-38'>Login</Button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default page