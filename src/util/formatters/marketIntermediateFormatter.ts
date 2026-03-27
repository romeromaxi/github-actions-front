import {IntermediateDataView, IntermediateDataViewFields} from "../../types/market/marketIntermediateData";
import {ItemFilterDropdown, ItemFilterDropdownFields} from "../../components/forms/ControlledFilterDropdown";


export function convertToItemFilterDropdown(
    data: IntermediateDataView[]
): ItemFilterDropdown[] {
    return data.map(item => ({
        id: item.id,
        descripcion: item.descripcion,
        [ItemFilterDropdownFields.Disabled]: !item[IntermediateDataViewFields.AllowSelect]
    }));
}
