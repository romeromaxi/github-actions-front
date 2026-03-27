import {Autocomplete, Card, CardContent, Stack, TextField, Typography, Skeleton} from "@mui/material";
import {BaseIconWrapper} from "../../components/icons/Icons";
import React, {useContext} from "react";
import {MagnifyingGlass} from "@phosphor-icons/react";
import {
    EntityWithIdAndDescription,
    EntityWithIdAndDescriptionFields,
} from "../../types/baseEntities";
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";



interface CompanyBureauTabHeadersProps {
    isPhysicalPerson?: boolean
}

const CompanyBureauTabHeaders = ({isPhysicalPerson} : CompanyBureauTabHeadersProps) => {
    const {loading, options, selectedQueryId, setSelectedQueryId} = useContext(BureauInformationContext);
    
    return (
        <Card>
            <CardContent>
                <Stack spacing={3}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2} justifyContent={'space-between'}>
                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                            <BaseIconWrapper Icon={MagnifyingGlass} size={'md'} bg={'#F7FAFC'}/>
                            <Typography variant={'h4'} fontWeight={500}>Ver cómo me ven</Typography>
                        </Stack>
                        {!isPhysicalPerson && (
                            loading ? <Skeleton sx={{width: '100% !important'}}/>
                                :
                                <Autocomplete
                                    value={options.find(
                                        (option) => option.id === selectedQueryId,
                                    )}
                                    onChange={(
                                        event: any,
                                        newValue: EntityWithIdAndDescription | null,
                                    ) => {
                                        setSelectedQueryId(
                                            newValue?.[EntityWithIdAndDescriptionFields.Id] ||
                                            selectedQueryId || 0,
                                        );
                                    }}
                                    id="controllable-states-demo"
                                    options={options}
                                    getOptionLabel={(option) =>
                                        option[EntityWithIdAndDescriptionFields.Description]
                                    }
                                    size={'small'}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Seleccionar empresa o accionistas" />
                                    )}
                                    sx={{
                                        width: '50%'
                                    }}
                                />
                        )
                        }
                    </Stack>
                    <Typography color={'text.lighter'} variant={'subtitle1'}>
                        Tus clientes, proveedores y las entidades financieras y de cobertura de riesgo pueden acceder a información de tu empresa a través de bases públicas y de bureau de crédito
                        disponibles en el mercado. LUC te acerca esa información para que puedas ver cómo te ven y utilizarla en beneficio de tu empresa. Además, para las personas jurídicas podrás
                        encontrar indicadores construidos a partir del último estado contable cargado en el perfil de la empresa. Asegurate de completarlo y mantenerlo actualizado
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    )
}



export default CompanyBureauTabHeaders