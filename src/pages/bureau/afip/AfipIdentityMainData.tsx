import { Fragment } from 'react';
import {Card, CardContent, CardHeader, Grid} from '@mui/material';
import {Skeleton} from "@mui/lab";
import { Identity, IdentityFields } from 'types/nosis/nosisData';
import { PersonTypes } from 'types/person/personEnums';
import { AddressFormatter } from 'util/formatters/addressFormatter';
import {
  EntityAddress,
  EntityAddressFields,
} from 'types/general/generalReferentialData';
import { dateFormatter } from 'util/formatters/dateFormatter';
import {PublicEntityEnums} from "util/typification/publicEntityEnums";
import {TextFieldBase} from "components/forms/TextFieldBase";

interface AfipIdentityMainDataProps {
  identity?: Identity;
  loading: boolean;
  error: boolean;
}

function AfipIdentityMainData({
  identity,
  loading,
  error,
}: AfipIdentityMainDataProps) {
    const address = AddressFormatter.toFullAddress({
        [EntityAddressFields.Street]: identity?.[IdentityFields.FiscalAddressStreet], 
        [EntityAddressFields.StreetNumber]: identity?.[IdentityFields.FiscalAddressNumber], 
        [EntityAddressFields.Floor]: identity?.[IdentityFields.FiscalAddressFloor], 
        [EntityAddressFields.Apartment]: identity?.[IdentityFields.FiscalAddressApartment], 
        [EntityAddressFields.PostalCode]: identity?.[IdentityFields.FiscalAddressZipCode], 
        [EntityAddressFields.MunicipalityDesc]: identity?.[IdentityFields.FiscalAddressMunicipality], 
        [EntityAddressFields.ProvinceDesc]: identity?.[IdentityFields.FiscalAddressProvince],
    } as EntityAddress);
    
    const isLegalPerson = identity?.[IdentityFields.PersonTypeCode] === PersonTypes.Legal;
    
    return (
        <Card>
            <CardHeader title={'General'} subheader={'Datos fiscales y societarios básicos de tu PyME, tal como figuran en los registros de ARCA.'} />
            
            <CardContent>
                <Grid container spacing={4}>
                    {identity && !loading ? (
                        <Fragment>
                            <Grid item xs={12} md={6}>
                                <TextFieldBase label={'CUIT'}
                                               value={identity[IdentityFields.Identification]}
                                               disabled 
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextFieldBase label={'Razón Social'}
                                               value={identity[IdentityFields.BusinessName]}
                                               disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextFieldBase label={'Domicilio Fiscal'}
                                               value={address}
                                               disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextFieldBase label={'Tipo Persona'}
                                               value={isLegalPerson ? 'Jurídica' : 'Humana'}
                                               disabled
                                />
                            </Grid>
                            {isLegalPerson ? (
                                <Grid item xs={12} md={6}>
                                    <TextFieldBase label={'Fecha Contrato Social'}
                                                   value={dateFormatter.toShortDate(
                                                       identity[IdentityFields.SocialContractDate],
                                                   )}
                                                   disabled
                                    />
                                </Grid>
                            ) : (
                                <Grid item xs={12} md={6}>
                                    <TextFieldBase label={'Fecha de Nacimiento'}
                                                   value={dateFormatter.toShortDate(
                                                       identity[IdentityFields.Birthdate],
                                                   )}
                                                   disabled
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12} md={6}>
                                <TextFieldBase label={`Fecha de inscripción en ${PublicEntityEnums.ARCA}`}
                                               value={dateFormatter.toShortDate(
                                                   identity[IdentityFields.AfipRegistrationDate],
                                               )}
                                               disabled
                                />
                            </Grid>
                        </Fragment>
                    ) : (
                        <Fragment>
                            {
                                Array.from({ length: 4 }).map((_, idx) => (
                                    <Grid item xs={12} md={6} key={`afipIdentityMainDataLoading_${idx}`} >
                                        <Skeleton />
                                    </Grid>
                                ))
                            }
                        </Fragment>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
}

export default AfipIdentityMainData;
