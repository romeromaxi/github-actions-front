import {ProductServiceTypes} from "../../types/product/productdestinyData";
import {ElementType} from "react";
import {UserCirclePlus, Coins, Files, SealCheck, ShieldCheck} from "@phosphor-icons/react";

export const MarketServiceIconMap: Record<ProductServiceTypes, ElementType> = {
    [ProductServiceTypes.Endorsements]: SealCheck,
    [ProductServiceTypes.Financing]: Coins,
    [ProductServiceTypes.DiscountDocuments]: Files,
    [ProductServiceTypes.AccountOpening]: UserCirclePlus,
    [ProductServiceTypes.Insurance]: ShieldCheck
}


export const getServiceIconByCode = (code: number) => MarketServiceIconMap[code as ProductServiceTypes] ?? Coins;