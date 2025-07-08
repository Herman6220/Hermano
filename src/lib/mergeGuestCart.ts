import axios, { AxiosError } from "axios";
import { getLocalCart, clearLocalCart } from "./localCart";
import { ApiResponse } from "@/types/ApiResponse";

export async function mergeGuestCart(){
    const localCart = getLocalCart();
    console.log(localCart)
    try {
        if(localCart.length > 0){
            const response = await axios.post("/api/customer/cart/merge", {localCart})
        }
        console.log("cart merged")
        clearLocalCart();
        console.log("cart cleared")
    } catch (error) {
        console.log("Error", error)
        const axiosError = error as AxiosError<ApiResponse>
        console.error("Error", axiosError.response?.data.message)
    }
}