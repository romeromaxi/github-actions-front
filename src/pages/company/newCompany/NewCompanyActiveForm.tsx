import {Box, Grid, Stack, Typography} from "@mui/material";
import {WrapperIcons} from "../../../components/icons/Icons";
import {UserRoundIcon} from "lucide-react";
import {stringFormatter} from "../../../util/formatters/stringFormatter";
import {Disclaimer} from "../../../components/text/Disclaimer";
import {AsyncSelect} from "../../../components/forms";
import {
    CompanyKeyData,
    CompanyKeyDataFields,
    CompanyUnconfirmedRegisterDataFields,
} from "../../../types/company/companyData";
import {PersonTypes} from "../../../types/person/personEnums";
import {useCallback} from "react";
import * as yup from "yup";
import useAxios from "../../../hooks/useAxios";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {HttpCacheCompany, HttpCompanyRolesInvitation} from "../../../http";
import {NewCompanyBaseForm} from "../../markets/components/forms/FromMarketNewCompanyForm";
import {CompanyAlreadyValidatedFormData} from "./CompanyAlreadyValidatedForm";


interface NewCompanyActiveFormProps {
    onSubmitted: (responsible: boolean, validated: boolean) => void;
    samePerson: boolean;
    companyKeyData: CompanyKeyData;
}


const NewCompanyActiveForm = ({
                                  onSubmitted,
                                  samePerson,
                                  companyKeyData
                              }: NewCompanyActiveFormProps) => {
    const {
        [CompanyKeyDataFields.CompanyId]: companyId,
        [CompanyKeyDataFields.BusinessName]: companyName,
        [CompanyKeyDataFields.CUIT]: companyCuit,
        [CompanyKeyDataFields.PersonId]: companyPersonId,
        [CompanyKeyDataFields.PersonTypeCode]: personTypeCode,
        [CompanyKeyDataFields.ValidationStateCode]: validationStateCode,
        [CompanyKeyDataFields.IsOwnExistingCompany]: isOwnExistingCompany
    } = companyKeyData;
    const isPhysicalPerson = personTypeCode === PersonTypes.Physical

    const companySchema = yup
        .object()
        .test(
            CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode, 'Campo Obligatorio', (obj) => {
                if (samePerson || obj[CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]) return true;

                return new yup.ValidationError(
                    'Campo Obligatorio',
                    null,
                    CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode,
                );
            }
        )

    const { fetchData } = useAxios();


    const { control, handleSubmit } =
        useForm<NewCompanyBaseForm>({
            resolver: yupResolver(companySchema),
            defaultValues: {
                [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]: 0
            }
        });

    const onSubmit = (data: NewCompanyBaseForm) => {
        const submitData: CompanyAlreadyValidatedFormData = {
            [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]: data[CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]
        }
        
        fetchData(
            () => HttpCompanyRolesInvitation.insertNew(companyId, submitData),
            true
        ).then(() => onSubmitted(false, false));
    };

    const loadBondOptions = useCallback(() => {
        if (!personTypeCode) return undefined;

        return personTypeCode === PersonTypes.Legal
            ? HttpCacheCompany.getBondsForLegalPerson(false)
            : HttpCacheCompany.getBondsForPhysicalPerson(false);
    }, [personTypeCode]);
    
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} id={"new-company-active-data-form"}>
            {companyName && (
                <Grid item xs={12}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {
                            isPhysicalPerson ?
                                <Box sx={{backgroundColor: '#E1F3D6', width: '56px', height: '56px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <WrapperIcons Icon={UserRoundIcon} size={'lg'} color={'#5A9437'}/>
                                </Box>
                                :
                                <Box component="img" src={'/images/homeCompanies/company-logo-default-legal.svg'} />
                        }
                        <Stack>
                            <Typography variant="h4" color="primary" fontWeight={600}>{companyName}</Typography>
                            <Typography variant="body2" color="text.tertiary" fontFamily={'Poppins'}>
                                {`CUIT N°: ${stringFormatter.formatCuit(companyCuit)}`}
                            </Typography>
                        </Stack>
                    </Stack>
                </Grid>
            )}
            {samePerson ? (
                <Grid item xs={12} container spacing={2} alignItems={'center'} mt={1}>
                    <Grid item xs={12}>
                        {isOwnExistingCompany ? (
                            <Disclaimer
                                text={`Identificamos que sos el responsable del CUIT ${stringFormatter.formatCuit(companyCuit)} y que la cuenta MiPyME ya fue creada por otro usuario. ¿Deseás reclamar la empresa? Si elegís afirmativamente y querés que quien creó la cuenta siga utilizándola, deberás restituirle el permiso desde "Gestión de Usuario"`}
                            />
                        ) : (
                            <Disclaimer text="¿Son correctos los datos para crear la cuenta?" />
                        )}
                    </Grid>
                </Grid>
            ) : (
                <Grid item xs={12} container spacing={2} alignItems={'center'} mt={1}>
                    <Grid item xs={12}>
                        <AsyncSelect
                            loadOptions={loadBondOptions}
                            control={control}
                            name={CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode}
                            select
                            fullWidth
                            label={'¿Qué vinculo tenés con esta PyME?'}
                        />
                    </Grid>
                </Grid>
            )
            }
        </form>
    )
}


export default NewCompanyActiveForm;