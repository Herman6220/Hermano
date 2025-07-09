export const LOCAL_CART_KEY = "guest_cart";

export function getLocalCart(){
    if(typeof window === "undefined") return [];
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    const parsedRaw = raw ? JSON.parse(raw) : null;
    console.log("parsed raw", parsedRaw)
    return raw ? JSON.parse(raw) : [];
}

export function saveLocalCart(cart: any){
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}

const quantity = 1;

export function addToLocalCart(professionalService: any){
    const cart = getLocalCart();
    const exists = cart.find(
        (cartItem: any) => cartItem.professionalService._id.toString() === professionalService._id.toString()
    )
    if(!exists){
        cart.push({professionalService: professionalService, quantity: quantity});
        saveLocalCart(cart);
        return "Item successfully added to the cart"
    }else{
        return "Item already exists in the cart"
    }
}


export function removeFromLocalCart(professionalServiceId: string){
    const cart = getLocalCart().filter(
        (cartItem: any) => cartItem.professionalService._id.toString() !== professionalServiceId
    );
    saveLocalCart(cart)
}

export function updateLocalCartQuantity(professionalServiceId: string, adjustment: number){
    const cart = getLocalCart().map(
        (cartItem: any) => {
            if(cartItem.professionalService._id === professionalServiceId){
                return {
                    ...cartItem,
                    quantity: cartItem.quantity + adjustment,
                }
            }
            return cartItem;
        }
    ).filter((cartItem: any) => cartItem.quantity > 0);

    saveLocalCart(cart);
}

export function clearLocalCart(){
    localStorage.removeItem(LOCAL_CART_KEY);
}