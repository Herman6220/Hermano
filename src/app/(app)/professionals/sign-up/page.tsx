'use client'

import { professionalSignUpSchema } from "@/schemas/professionalSignUpSchema"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Loader2, X, Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"


function page() {

    const [displayServices, setDisplayServices] = useState<any[]>([])
    const [profilePreview, setProfilePreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [files, setFiles] = useState<FileList | null>(null)
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
    const [isAdding, setIsAdding] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof professionalSignUpSchema>>({
        resolver: zodResolver(professionalSignUpSchema),
        defaultValues: {
            email: "",
            password: "",
            fullname: "",
            phone: "",
            // services: [{
            //     serviceId: "",
            //     price: 0,
            //     description: "",
            //     images: [],
            //     averageRating: 0,
            //     reviewsCount: 0,
            //     isServiceActive: true
            // }],
            services: [],
            description: "",
            experience: 0,
            location: "",
            profilePicture: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof professionalSignUpSchema>) => {
        if(file){
            if(!form.getValues("profilePicture")){
                toast("Upload the image or deselect the file.")
                return
            }
        }
        setIsSubmitting(true)
        try {
            // console.log("whole form", form.getValues())
            // console.log("data", data)
            const finalData = form.getValues()
            const response = await axios.post<ApiResponse>("/api/professional/sign-up", data)
            toast("success", {
                description: response.data.message
            })
            // console.log(response)
            router.replace(`/professionals`)
            setIsSubmitting(false)
        } catch (error) {
            // console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message
            toast("Sign up failed", {
                description: errorMessage
            })
            setIsSubmitting(false)
        }
    }

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
    }, [setSubcategories])

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
        fetchSubCategory(categoryValue)
        fetchService(subCategoryValue, categoryValue)
    }, [fetchCategory, fetchSubCategory, categoryValue, subCategoryValue])


    const handleServiceImagesUpload = useCallback(async () => {
        if (!files) {
            return
        }
        // console.log(files)
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
            return;
        }

        setIsAdding(true)

        try {
            const imageUrls = await handleServiceImagesUpload()

            append({
                serviceId: serviceValue,
                price: servicePriceInput,
                description: serviceDescInput || "",
                images: imageUrls || [],
                averageRating: 0,
                reviewsCount: 0,
                isServiceActive: true
            });

            const test = form.getValues("services")
            // console.log(test)
            setDisplayServices(test)

            setServiceValue("");
            setServicePriceInput(0);
            setServiceDescInput("");
            // setFiles(null);

        } catch (error) {
            toast("Failed to add service");
            // console.error(error);
        } finally {
            setIsAdding(false)
        }
    }

    const handleDeleteService = (serviceToDeleteId: string) => {
        const newServices = form.getValues("services")
        // console.log("newService", newServices)
        const updatedServices = newServices.filter((n) => n.serviceId !== serviceToDeleteId)
        // console.log("deletedService", updatedServices)
        if (updatedServices) {
            form.setValue("services", updatedServices)
            setDisplayServices(updatedServices)
        } else {
            return
        }
    }

    const handleProfilePictureUpload = useCallback(async () => {
        setIsUploading(true)
        if (!file) return

        // console.log(file)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await axios.post('/api/upload', formData);
            const url = response.data.message
            form.setValue("profilePicture", url, { shouldDirty: true })
            const test = form.getValues("profilePicture")
            // console.log(test)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("Error", {
                description: axiosError.response?.data.message
            })
        }finally{
            setIsUploading(false)
        }
    }, [file, form])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        const file = files?.[0]

        if (file) {
            const previewUrl = URL.createObjectURL(file)

            if (name === "profilePicture") {
                setProfilePreview(previewUrl)
            }
        }
    }

    useEffect(() => {
        return (() => {
            if (profilePreview) URL.revokeObjectURL(profilePreview)
        })
    }, [profilePreview])


    useEffect(() => {
        // console.log("Form errors:", form.formState.errors);
    }, [form.formState.errors]);

    useEffect(() => {
        if (displayServices.length > 0) {
            // console.log(displayServices)
        }

    }, [displayServices])




    return (
        <div className="flex justify-center items-center min-h-screen bg-[#0d0012]">
            <ScrollArea className="w-full  max-w-[800px] p-6 bg-gradient-to-br from-violet-900/20 to-blue-700/80 border border-blue-950 rounded-lg shadow-md max-h-[90vh] overflow-hidden flex flex-col ">
                <div className="m-2">
                    <div className="text-center">
                        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-2 text-blue-400">
                            Sign Up as Professional
                        </h1>
                        <p className="mb-4 text-white">
                            Enter your details
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email" className="text-white !placeholder-gray-400" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" className="text-white !placeholder-gray-400" placeholder="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Full Name" className="text-white !placeholder-gray-400" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="phone" className="text-white !placeholder-gray-400" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="description" className="text-white !placeholder-gray-400" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="experience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Experience</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(value) => field.onChange(Number(value))}
                                                defaultValue={field.value !== undefined ? String(field.value) : undefined}>
                                                <SelectTrigger className="w-[180px] text-gray-400">
                                                    <SelectValue placeholder="Select experience" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-black/50 backdrop-blur-[5px] text-white">
                                                    <SelectGroup >
                                                        <SelectLabel className="">Select Experience</SelectLabel>
                                                        <SelectItem value="0" className="text-white">Less than 1</SelectItem>
                                                        <SelectItem value="1" className="text-white">1</SelectItem>
                                                        <SelectItem value="2" className="text-white">2</SelectItem>
                                                        <SelectItem value="3" className="text-white">3</SelectItem>
                                                        <SelectItem value="4" className="text-white">4</SelectItem>
                                                        <SelectItem value="5" className="text-white">More than 5</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="location" className="text-white !placeholder-gray-400" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="profilePicture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Profile Picture</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="file"
                                                    name="profilePicture"
                                                    onChange={(e) => {
                                                        handleImageChange(e);
                                                        setFile(e.target.files?.[0] || null)
                                                    }}
                                                    className="text-gray-400 file:text-white"
                                                />
                                                <Button
                                                    type="button"
                                                    disabled={isUploading}
                                                    onClick={() => {handleProfilePictureUpload()}}
                                                    className="bg-blue-500 hover:bg-blue-700"
                                                >
                                                    {isUploading ? (
                                                        <>
                                                        <Loader2 className="mr-2 w-4 animate-spin" /> Please wait
                                                        </>
                                                    ) : (
                                                        <>Upload</>  
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {profilePreview &&
                                <img
                                    src={profilePreview}
                                    alt="profile-picture"
                                    className="w-40 rounded-md"
                                />
                            }
                            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 hover:bg-blue-700">
                                {
                                    isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                        </>
                                    ) : ("Signup")
                                }
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4 text-white">
                        <p>
                            Already a member?{" "}
                            <Link href="/professionals/sign-in" className="text-blue-500 hover:text-blue-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
                <ScrollBar 
                 
                />
            </ScrollArea>
        </div>
    )
}

export default page