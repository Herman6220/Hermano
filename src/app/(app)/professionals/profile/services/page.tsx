"use client"

import * as z from "zod"
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Check, ChevronsUpDown, Loader2, Star, X } from 'lucide-react'
import React, { Profiler, useCallback, useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import { professionalServiceCreationSchema } from "@/schemas/professionalServiceCreationSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

function page() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [displayServices, setDisplayServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)
  const [professionalServices, setProfessionalServices] = useState([])
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [subCategoryOpen, setSubCategoryOpen] = useState(false)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [categoryValue, setCategoryValue] = useState("")
  const [categories, setCategories] = useState([])
  const [subCategoryValue, setSubCategoryValue] = useState("")
  const [subCategories, setSubcategories] = useState([])
  const [serviceValue, setServiceValue] = useState("")
  const [services, setServices] = useState([])
  const [servicePriceInput, setServicePriceInput] = useState<number>(0)
  const [serviceDescInput, setServiceDescInput] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const { reset } = useForm()

  const form = useForm<z.infer<typeof professionalServiceCreationSchema>>({
    resolver: zodResolver(professionalServiceCreationSchema),
    defaultValues: {
      services: []
    }
  })

  const onSubmit = async (data: z.infer<typeof professionalServiceCreationSchema>) => {

    console.log("services before submit", form.getValues("services"));
    setIsSubmitting(true)
    try {
      console.log("data", data)
      const response = await axios.post<ApiResponse>("/api/create-professionalServices", data)
      toast("Success", {
        description: response.data.message
      })
      console.log("services after submit", form.getValues("services"));
      fetchProfessionalServicesForProfessional()
    } catch (error) {
      console.error("Error in creation of services", error)
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message
      toast("Service creation failed", {
        description: errorMessage
      })
    } finally {
      setIsSubmitting(false)
      form.setValue("services", [])
      setDisplayServices([])
      console.log("finally block getValues", form.getValues("services"))
    }
  }

  const handleToggleIsServiceActive = async (professionalServiceId: string) => {
    setIsToggling(true)
    try {
      const response = await axios.patch("/api/professional/toggleIsServiceActive", { professionalServiceId })
      fetchProfessionalServicesForProfessional()
      console.log(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message
      })
    } finally {
      setIsToggling(false)
    }
  }

  const fetchProfessionalServicesForProfessional = useCallback(async () => {
    try {
      const response = await axios.get("/api/professionalServicesForProfessional")
      setProfessionalServices(response.data.message || null)
      console.log(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message
      })
    } finally {
      setIsLoading(false)
    }
  }, [setProfessionalServices, setIsLoading])


  useEffect(() => {
    fetchProfessionalServicesForProfessional()
  }, [fetchProfessionalServicesForProfessional])



  const fetchCategory = useCallback(async () => {
    try {
      const response = await axios.get('/api/category')
      setCategories(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message
      })
    }
  }, [setCategories])

  const fetchSubCategory = useCallback(async (categoryValue: string) => {
    try {
      if (categoryValue.length <= 0) {
        setSubCategoryValue("")
        return
      }
      const response = await axios.get(`/api/category/${categoryValue}/subCategory`)
      setSubcategories(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message
      })
    }
  }, [setSubcategories, categories])

  const fetchService = useCallback(async (subCategoryValue: string, categoryValue: string) => {
    try {
      if (subCategoryValue.length <= 0 || categoryValue.length <= 0) {
        setServiceValue("")
        return
      }
      const response = await axios.get(`/api/category/${categoryValue}/subCategory/${subCategoryValue}/services`)
      setServices(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message
      })
    }
  }, [setServices])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  useEffect(() => {
    if (categoryValue.length !== 0) {
      console.log("Category value is set now", categoryValue)
      fetchSubCategory(categoryValue)
    }
  }, [fetchSubCategory, categoryValue])

  useEffect(() => {
    if (subCategoryValue.length !== 0) {
      console.log("Category and subCategory value is set now", categoryValue, subCategoryValue)
      fetchService(subCategoryValue, categoryValue)
    }
  }, [subCategoryValue, categoryValue])


  const handleServiceImagesUpload = useCallback(async () => {
    if (!files) {
      return
    }
    console.log(files)
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
    }
    try {
      const response = await axios.post('/api/upload', formData);
      return response.data.message

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message
      })
      throw error;
    }
  }, [files, form])

  const { fields, append } = useFieldArray({
    name: "services",
    control: form.control
  })

  const handleAddService = async () => {
    if (!serviceValue) {
      toast("Select a service")
      return
    }

    if (!servicePriceInput) {
      toast("Price is required")
      return
    }

    if (fields.some(f => f.serviceId === serviceValue)) {
      toast("service already exists")
      console.log("serviceValue", serviceValue)
      console.log("serviceId", fields.some(f => f.serviceId))
      return;
    }

    setIsAdding(true)

    try {
      const imageUrls = await handleServiceImagesUpload()

      append({
        serviceId: serviceValue,
        price: Math.round((servicePriceInput) * 100),
        description: serviceDescInput || "",
        images: imageUrls || [],
      });

      const test = form.getValues("services")
      console.log(test)
      setDisplayServices(test)

      setServiceValue("");
      setServicePriceInput(0);
      setServiceDescInput("");

    } catch (error) {
      toast("Failed to add service");
      console.error(error);
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteService = async (professionalServiceId: string) => {
    try {
      const response = await axios.delete("/api/deleteProfessionalService", { data: { professionalServiceId } })
      toast("Success", {
        description: response.data.message
      })
      fetchProfessionalServicesForProfessional()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message
      })
    }
  }

  const handleDeleteDisplayedService = (serviceToDeleteId: string) => {
        const newServices = form.getValues("services")
        console.log("newService", newServices)
        const updatedServices = newServices.filter((n) => n.serviceId !== serviceToDeleteId)
        console.log("deletedService", updatedServices)
        if (updatedServices) {
            form.setValue("services", updatedServices)
            setDisplayServices(updatedServices)
        } else {
            return
        }
    }




  return (
    <>
      <div className='flex items-center justify-center min-h-[80vh] bg-[#0d0012]'>
        {isLoading ? (
          <Loader2 className='w-10 h-10 animate-spin' />
        ) : (
          <>
            <div className='flex flex-col gap-8 items-center w-5xl min-h-[80vh]'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Card className='w-5xl min-h-50 p-6 rounded-3xl flex flex-col gap-2 bg-blue-300 border-none shadow-none'>
                            <div className='w-full h-30 bg-blue-400 rounded-xl px-14 py-4' style={{ boxShadow: "inset 0 0 5px 2px rgba(0, 0, 0, 0.2)" }}>
                              <div className='flex items-center justify-between gap-8 h-full'>
                                <div>
                                  <div className='flex justify-between items-center'>
                                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          aria-expanded={categoryOpen}
                                          className="w-[200px] justify-between overflow-hidden"
                                        >
                                          {categoryValue.length > 0
                                            ? (categories as any).find((category: any) => category._id === categoryValue)?.title
                                            : "Select category..."}
                                          <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                          <CommandInput placeholder="Search category..." className="h-9" />
                                          <CommandList>
                                            <CommandEmpty>No category found.</CommandEmpty>
                                            <CommandGroup>
                                              {(categories as any).map((category: any) => (
                                                <CommandItem
                                                  key={category._id}
                                                  value={category._id}
                                                  onSelect={(currentValue) => {
                                                    setCategoryValue(currentValue === categoryValue ? "" : currentValue)
                                                    setCategoryOpen(false)
                                                  }}
                                                >
                                                  {category.title}
                                                  <Check
                                                    className={cn(
                                                      "ml-auto",
                                                      categoryValue === category._id ? "opacity-100" : "opacity-0"
                                                    )}
                                                  />
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>

                                    <Popover open={subCategoryOpen} onOpenChange={setSubCategoryOpen}>
                                      <PopoverTrigger asChild>
                                        <Button
                                          disabled={!categoryValue}
                                          variant="outline"
                                          role="combobox"
                                          aria-expanded={subCategoryOpen}
                                          className="w-[200px] justify-between overflow-hidden"
                                        >
                                          {subCategoryValue.length > 0
                                            ? (subCategories as any).find((subCategory: any) => subCategory._id === subCategoryValue)?.title
                                            : "Select sub category..."}
                                          <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                          <CommandInput placeholder="Search sub category..." className="h-9" />
                                          <CommandList>
                                            <CommandEmpty>No sub category found.</CommandEmpty>
                                            <CommandGroup>
                                              {(subCategories as any).map((subCategory: any) => (
                                                <CommandItem
                                                  key={subCategory._id}
                                                  value={subCategory._id}
                                                  onSelect={(currentValue) => {
                                                    setSubCategoryValue(currentValue === subCategoryValue ? "" : currentValue)
                                                    setSubCategoryOpen(false)
                                                  }}
                                                >
                                                  {subCategory.title}
                                                  <Check
                                                    className={cn(
                                                      "ml-auto",
                                                      subCategoryValue === subCategory._id ? "opacity-100" : "opacity-0"
                                                    )}
                                                  />
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>

                                    <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
                                      <PopoverTrigger asChild>
                                        <Button
                                          disabled={!subCategoryValue || !categoryValue}
                                          variant="outline"
                                          role="combobox"
                                          aria-expanded={serviceOpen}
                                          className="w-[200px] justify-between overflow-hidden"
                                        >
                                          {serviceValue.length > 0
                                            ? (services as any).find((service: any) => service._id === serviceValue)?.title
                                            : "Select service..."}
                                          <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                          <CommandInput placeholder="Search service..." className="h-9" />
                                          <CommandList>
                                            <CommandEmpty>No service found.</CommandEmpty>
                                            <CommandGroup>
                                              {(services as any).map((service: any) => (
                                                <CommandItem
                                                  key={service._id}
                                                  value={service._id}
                                                  onSelect={(currentValue) => {
                                                    setServiceValue(currentValue === serviceValue ? "" : currentValue)
                                                    setServiceOpen(false)
                                                  }}
                                                >
                                                  {service.title}
                                                  <Check
                                                    className={cn(
                                                      "ml-auto",
                                                      serviceValue === service._id ? "opacity-100" : "opacity-0"
                                                    )}
                                                  />
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                  </div>

                                  <div className="flex flex-wrap gap-2 justify-between my-1">
                                    <Input
                                      type="number"
                                      placeholder="price"
                                      value={servicePriceInput}
                                      onChange={(e) => setServicePriceInput(Number(e.target.value))}
                                      className="w-[200px] bg-white"
                                    />
                                    <Input
                                      placeholder="description"
                                      value={serviceDescInput}
                                      onChange={(e) => setServiceDescInput(e.target.value)}
                                      className="w-[200px] bg-white"
                                    />
                                    <Input
                                      type="file"
                                      name="serviceImages"
                                      multiple
                                      placeholder="Images"
                                      className="w-[200px] bg-white"
                                      onChange={(e) => setFiles(e.target.files)}
                                    />
                                  </div>
                                </div>
                                <div className='w-4 h-full flex justify-center items-center'>
                                  <Separator orientation="vertical" />
                                </div>
                                <div className="flex flex-col gap-2 items-center justify-center">
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      handleAddService()
                                    }}
                                    disabled={isAdding}
                                    className="bg-orange-400 hover:bg-orange-500"
                                  >
                                    {isAdding ? (
                                      <>
                                        <Loader2 className="w-2 animate-spin" />
                                        <p>Adding</p>
                                      </>
                                    ) : (
                                      <p>
                                        Add
                                      </p>
                                    )}
                                  </Button>
                                  <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-500 hover:bg-blue-700"
                                  >
                                    {isSubmitting ? (
                                      <>
                                        <Loader2 className="w-2 animate-spin" />
                                        <p>Saving</p>
                                      </>
                                    ) : (
                                      <p>Save</p>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                {displayServices.length > 0 ? (
                                  (displayServices as any).map((display: any) =>
                                    <>
                                    <div>
                                    <Card className="relative group md:h-14 px-4 overflow-hidden rounded-xl ">
                                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:place-items-center place-content-center">
                                        <CardTitle className="truncate max-w-full">{display.serviceId}</CardTitle>
                                        <div className="truncate max-w-full">{display.description}</div>
                                        <div className="truncate max-w-full">{((display.price)/100).toFixed(2)}</div>
                                        <div className="flex -space-x-5">
                                          {display.images ? (
                                            <>
                                              {display.images.map((image: string) => 
                                                <>
                                                  <img 
                                                    src={image}
                                                    alt="service-images"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                  />
                                                </>
                                              )}
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                      </div>
                                      <Button
                                        type="button"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        onClick={() => handleDeleteDisplayedService(display.serviceId)}
                                      >
                                        <X />
                                      </Button>
                                    </Card>
                                    </div>
                                    </>
                                  )

                                ) : (
                                  <p>No service added</p>
                                )}
                              </div>
                          </Card>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </form>
              </Form>

              <Separator />
              {professionalServices ? (
                <div className='flex flex-col gap-3'>
                  <div className="px-4"><h1 className="text-2xl text-white">Your services ( <span className="text-xl">{professionalServices.length}</span> )</h1></div>
                  {professionalServices.map((professionalService: any) =>
                    <Card key={professionalService?._id} className={`h-50 p-4 w-5xl rounded-3xl grid grid-cols-5 overflow-hidden border-none shadow-none bg-gradient-to-br from-blue-400 to-blue-300`}>
                      <div className='h-full aspect-square overflow-hidden rounded-xl'>
                        <img
                          src={professionalService?.images[0]}
                          alt='service image'
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div className='col-span-3 flex flex-col justify-between'>
                        <div>
                          <h3 className="text-white font-bold">{professionalService?.matchedServices?.title}</h3>
                          <CardDescription className='line-clamp-3 text-blue-950'>{professionalService?.description}</CardDescription>
                        </div>
                        <div className='flex gap-2 items-center'>
                          <div className='flex'>
                            {[1, 2, 3, 4, 5].map((star) =>
                              <Star className='w-3' stroke="white" fill={professionalService?.averageRating >= star ? "black" : "none"} />
                            )}
                          </div>
                          <div><p className="text-white">{professionalService?.reviewsCount}</p></div>
                        </div>
                      </div>
                      <div className='flex flex-col items-end justify-between h-full'>
                        <Switch
                          checked={professionalService.isServiceActive}
                          onCheckedChange={() => handleToggleIsServiceActive(professionalService._id)}
                          disabled={isToggling}
                          className='data-[state=checked]:bg-blue-500'
                        />
                        <div className="flex gap-2 items-center">
                          <h1 className='text-2xl font-light'>{((professionalService?.price)/100).toFixed(2)} /-</h1>
                          <button
                            onClick={() => handleDeleteService(professionalService._id)}
                            className="flex items-center justify-center p-2 bg-red-500 rounded-full hover:bg-red-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-4">
                              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <h1>No services added yet.</h1>
                  </div>
                </>
              )}
            </div>
          </>
        )
        }
      </div >
    </>
  )
}

export default page
