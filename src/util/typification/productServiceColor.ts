import { ProductServiceTypes } from 'types/product/productdestinyData';

export interface productServiceColor {
  light: string;
  dark: string;
}

export const ProductServiceColorMap: Record<
  ProductServiceTypes,
  productServiceColor
> = {
  [ProductServiceTypes.Endorsements]: {
    light: 'rgba(67, 206, 215, 0.2)',
    dark: 'rgb(67, 206, 215)',
  },
  [ProductServiceTypes.Financing]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: 'rgb(169, 209, 142)',
  },
  [ProductServiceTypes.AccountOpening]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [ProductServiceTypes.DiscountDocuments]: {
    light: 'rgba(241, 65, 108, 0.2)',
    dark: 'rgb(241, 65, 108)',
  },
  [ProductServiceTypes.Insurance]: {
    light: 'rgba(255, 199, 0, 0.2)',
    dark: 'rgb(255, 199, 0)',
  },
};
