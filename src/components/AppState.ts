import {Action} from "./store/useCreateStore";
import {produce} from "immer";
import {data} from "../data";
import invariant from "tiny-invariant";

export interface Product {
    internalCode: string;
    name: string;
    unit: string
    unitType: string;
    barcode: string;
    price: string;
    shelfLife: string;
    shelfLifeType: string;
    category: string
}

export interface CartItem extends Product {
    total: number
}

export interface CardInfo {
    cardNumber: string;
    validUntil: string;
    cardHolderName: string;
}

export interface Address {
    firstName: string,
    lastName: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    email: string,
    phone: string,
    note: string
}

//
// export interface Payment {
//     time: string,
//     method: 'visa' | 'master' | 'apple' | 'google',
//     referenceCode: string,
//     status: 'received' | 'void',
//     amount: string,
//     currency: string
// }

export interface Shipping {
    id: string,
    orderId: string,
    lineItem: CartItem[],
    shippingDate: string,
    status: 'Dispatched' | 'Delivered' | 'Returned',
    remarks: string[],
    captain: string,
    captainMobileNo: string
}

//
// export interface Order {
//     id: string,
//     date: string,
//     lineItem: CartItem[],
//     subTotal: string,
//     shippingAddress: Address,
//     payment: Payment,
//     shippingStatus: Shipping[]
//     status: 'Placed' | 'Accepted' | 'Dispatched' | 'Delivered' | 'Partial Delivered' | 'Canceled'
// }

export interface AppState {
    shoppingCart: CartItem[];
    shippingAddress: Address,
    cardInfo: CardInfo
}

export const storeReducer = (action: Action) => produce((oldState: AppState) => {
    if (action.type === 'add_to_cart') {
        const itemIndex = oldState.shoppingCart.findIndex(s => s.barcode === action.payload.barcode);
        const product: Product | undefined = data.find(d => d.barcode === action.payload.barcode);
        if (itemIndex >= 0) {
            oldState.shoppingCart[itemIndex].total += 1;
        } else {
            invariant(product);
            oldState.shoppingCart.push({
                ...product,
                total: 1
            })
        }
    }
    if (action.type === 'remove_from_cart') {
        const itemIndex = oldState.shoppingCart.findIndex(s => s.barcode === action.payload.barcode);
        if (itemIndex >= 0) {
            oldState.shoppingCart[itemIndex].total -= 1;
            const total = oldState.shoppingCart[itemIndex].total;
            if (total === 0) {
                oldState.shoppingCart.splice(itemIndex, 1);
            }
        }
    }
});