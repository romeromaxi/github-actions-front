import React from 'react';
import {ShoppingBagListItem} from './ShoppingBagListItem';
import {
    CompanyLineStatusViewDTO,
    CompanyLineStatusViewDTOFields,
} from 'types/lines/productLineData';
import {EntityWithIdFields} from "types/baseEntities";
import {WrapperIcons} from "components/icons/Icons";
import {AlertTriangleIcon, FileSearchIcon, SendIcon} from 'lucide-react';

export interface CompanyLineStatusListItemProps {
    companyLineStatus: CompanyLineStatusViewDTO;
    selected?: boolean;
    onClick: (selected: boolean | null) => void;
    multiple?: boolean;
    isRestrictionValid?: boolean;
}

export function CompanyLineStatusListItem({
                                              companyLineStatus,
                                              selected,
                                              onClick, multiple,
                                              isRestrictionValid = true
                                          }: CompanyLineStatusListItemProps) {
    const inShoppingCart: boolean =
        companyLineStatus[CompanyLineStatusViewDTOFields.InShoppingCart];
    const solicitationInProgress: boolean =
        companyLineStatus[CompanyLineStatusViewDTOFields.SolicitationInProgress];
    const hasPermissions: boolean =
        companyLineStatus[CompanyLineStatusViewDTOFields.HasPermissions];

    let statusMessage: string | undefined;
    let statusColor: string | undefined;
    let StatusIcon: React.ElementType | undefined;


    if (!hasPermissions) {
        statusMessage = 'No tenés permisos suficientes';
        statusColor = 'text.lighter';
    } else if (solicitationInProgress) {
        statusMessage = 'Solicitud en curso';
        statusColor = 'success.main';
        StatusIcon = FileSearchIcon;
    } else if (!isRestrictionValid) {
        statusMessage = 'Este producto no es compatible con el perfil de esta PyME';
        statusColor = 'text.lighter';
        StatusIcon = AlertTriangleIcon;
    } else if (inShoppingCart) {
        statusMessage = 'En solicitudes';
        statusColor = 'primary.main';
        StatusIcon = SendIcon;
    }

    const messageTooltip = !hasPermissions
        ? 'No tenés permisos suficientes para ver la información de esta empresa'
        : solicitationInProgress
            ? 'Ya tenés una solicitud en curso para dicha línea'
            : inShoppingCart
                ? 'La línea ya se encuentra en tu selección lista para enviar'
                : undefined;

    return (
        <ShoppingBagListItem
            businessName={
                companyLineStatus[CompanyLineStatusViewDTOFields.BusinessName]
            }
            onClick={onClick}
            selected={!!selected}
            companyId={companyLineStatus[EntityWithIdFields.Id]}
            companyPersonType={companyLineStatus[CompanyLineStatusViewDTOFields.PersonTypeCode]}
            hasPermissions={
                companyLineStatus[CompanyLineStatusViewDTOFields.HasPermissions]
            }
            allowChoose={!solicitationInProgress && !inShoppingCart && isRestrictionValid}
            tooltip={messageTooltip}
            multiple={multiple}
            statusMessage={statusMessage}
            statusColor={statusColor}
            statusIcon={StatusIcon ? <WrapperIcons Icon={StatusIcon} size={'xs'}/> : undefined}
        />
    );
}
