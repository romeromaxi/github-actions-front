import {SxProps} from "@mui/material";
import {ReactNode} from "react";


export enum AppbarMenuDataItemFields {
    Id = 'id',
    Logo = 'logo',
    Title = 'titulo',
    OnClick = 'alPresionar',
    Styles = 'estilos',
    Component = 'componente'
}


export interface AppbarMenuDataItem {
    [AppbarMenuDataItemFields.Id]?: string,
    [AppbarMenuDataItemFields.Logo]?: React.ElementType,
    [AppbarMenuDataItemFields.Title]?: string,
    [AppbarMenuDataItemFields.OnClick]?: () => void,
    [AppbarMenuDataItemFields.Styles]?: SxProps,
    [AppbarMenuDataItemFields.Component]?: ReactNode
} 