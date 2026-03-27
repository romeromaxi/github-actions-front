import { ProductLineStatesType } from 'types/lines/productLineEnums';
import {ColorCustomType, ColorCustomTypeFields} from "types/baseEntities";

export const ProductLineStatesColorMap: Record<ProductLineStatesType, ColorCustomType> =
  {
    [ProductLineStatesType.Created]: {
        light: 'rgba(0, 158, 247, 0.2)',
        dark: 'rgb(0, 158, 247)',
    },
    [ProductLineStatesType.PublicationRequest]: {
        light: 'rgba(124, 211, 217, 0.2)',
        dark: 'rgb(124, 211, 217)'
    },
    [ProductLineStatesType.ApprovedPublication]: {
        [ColorCustomTypeFields.Light]: 'rgba(95,172,47, 0.2)',
        [ColorCustomTypeFields.Dark]: 'rgb(95,172,47)'
    },
    [ProductLineStatesType.Published]: {
      [ColorCustomTypeFields.Light]: 'rgba(148, 224, 96, 0.2)',
      [ColorCustomTypeFields.Dark]: 'rgb(148, 224, 96)'
    },
    [ProductLineStatesType.UnsubscribePublication]: {
        light: 'rgba(241, 65, 108, 0.2)',
        dark: 'rgb(241, 65, 108)',
    },
    [ProductLineStatesType.DisablePublishing]: {
        light: 'rgba(241, 65, 108, 0.2)',
        dark: 'rgb(241, 65, 108)',
    }, 
    [ProductLineStatesType.PublishedInModification]: {
        light: 'rgba(0, 158, 247, 0.2)',
        dark: 'rgb(0, 158, 247)',
    },
      
  };

type dotColors =
  | 'inherit'
  | 'grey'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | undefined;

export const ProductLineStatesDotColorMap: Record<
  ProductLineStatesType,
  dotColors
> = {
  [ProductLineStatesType.Created]: 'info',
  [ProductLineStatesType.PublicationRequest]: 'warning',
  [ProductLineStatesType.ApprovedPublication]: 'success',
  [ProductLineStatesType.Published]: 'success',
  [ProductLineStatesType.UnsubscribePublication]: 'error',
  [ProductLineStatesType.DisablePublishing]: 'grey',
  [ProductLineStatesType.PublishedInModification]: 'info',
};

export const ProductLineStatesColorMapByNumber = (key: number) : ColorCustomType =>
  ProductLineStatesColorMap[key as ProductLineStatesType];

export const ProductLineStatesTimeDotColorMapByNumber = (key: number) =>
  ProductLineStatesDotColorMap[key as ProductLineStatesType];
