import React, {useContext, useEffect, useState} from 'react';
import {OffererContext} from '../components/OffererContextProvider';
import {AddButton} from 'components/buttons/Buttons';
import {HttpOffererTemplates} from 'http/offerer/httpOffererTemplates';
import {
    EntityWithIdAndDescription,
    EntityWithIdFields,
} from 'types/baseEntities';
import {PersonTypes} from 'types/person/personEnums';
import {FileSolicitationTemplate} from 'types/files/filesDataCache';
import {Box, Card, CardContent, Stack} from '@mui/material';
import {useForm, useWatch} from 'react-hook-form';
import NewTemplateDialog from './NewTemplateDialog';
import {SafetyComponent} from "components/security";
import {OffererButtonSecObjects, SecurityComponents} from "types/security";
import {TypographyBase} from "components/misc/TypographyBase";
import {ListFilterIcon} from "lucide-react";
import ButtonMultiselect from "components/forms/ButtonMultiselect";
import OffererTemplateComponent from "./OffererTemplateComponent";

export interface OffererTemplateListFilter {
    lstCodsPersonaTipo: number[];
}

const HomeOffererTemplates = () => {
    const offerer = useContext(OffererContext);
    const [templates, setTemplates] = useState<FileSolicitationTemplate[]>();
    const [openNew, setOpenNew] = useState<boolean>(false);
    const [filter, setFilter] = useState<OffererTemplateListFilter>({
        lstCodsPersonaTipo: [],
    });

    const tiposPersona: EntityWithIdAndDescription[] = [
        {id: PersonTypes.Physical, descripcion: 'Física'},
        {id: PersonTypes.Legal, descripcion: 'Jurídica'},
    ];

    const getTemplates = (filter: OffererTemplateListFilter) => {
        HttpOffererTemplates.getByOffererId(
            offerer[EntityWithIdFields.Id],
            filter,
        ).then((r) => {
            setTemplates(r);
        });
    };

    const {control} =
        useForm<OffererTemplateListFilter>();

    const watchPersonTypeCodes = useWatch({
        control: control,
        name: 'lstCodsPersonaTipo',
        defaultValue: [],
    });

    useEffect(() => {
        const filterSearch: OffererTemplateListFilter = {
            lstCodsPersonaTipo: watchPersonTypeCodes!,
        };
        setFilter(filterSearch);
        getTemplates(filterSearch);
    }, [offerer]);

    const onReload = () => {
        getTemplates(filter);
    };

    useEffect(() => {
        const data: OffererTemplateListFilter = {
            lstCodsPersonaTipo: watchPersonTypeCodes
        }
        getTemplates(data)
    }, [watchPersonTypeCodes]);

    return (
        <Stack spacing={2}>
            <Card>
                <CardContent>
                    <Stack spacing={4}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between'>
                            <Stack spacing={1}>
                                <TypographyBase variant='h4'>Archivos a solicitar</TypographyBase>
                                <TypographyBase variant='body2' color={'text.lighter'}>Preconfigurá los documentos que
                                    vas a solicitar a las PyMEs en futuras solicitudes.</TypographyBase>
                            </Stack>
                            <Stack direction="row" alignItems='center' spacing={2}>
                                <ButtonMultiselect
                                    control={control}
                                    name={'lstCodsPersonaTipo'}
                                    label={'Filtrar'}
                                    startIcon={<ListFilterIcon size={18}/>}
                                    options={tiposPersona}
                                />
                                <SafetyComponent componentName={SecurityComponents.HomeOffererTemplates}
                                                 objectName={OffererButtonSecObjects.OffererButtonTemplatesNewDocuments}>
                                    <AddButton size={'small'}
                                               onClick={() => setOpenNew(true)}>
                                        Nuevo archivo
                                    </AddButton>
                                </SafetyComponent>
                            </Stack>
                        </Stack>
                        <Stack spacing={3}>

                            {
                                templates && templates.length > 0 ? (
                                        templates.map((template, idx) => (
                                            <OffererTemplateComponent key={`template_${idx}`}
                                                                      offererId={offerer[EntityWithIdFields.Id]}
                                                                      template={template}
                                                                      onReload={onReload}
                                            />
                                        ))
                                    )
                                    :
                                    <Box sx={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        display: 'flex',
                                        paddingY: 4
                                    }}>
                                        <TypographyBase variant={'caption'} color={'text.lighter'} textAlign='center'>
                                            No hay archivos para solicitar a las PyMEs
                                        </TypographyBase>
                                    </Box>
                            }
                        </Stack>
                    </Stack>
                </CardContent>
                
                {
                    openNew && (
                        <NewTemplateDialog open={openNew} 
                                           onClose={() => setOpenNew(false)} 
                                           offererId={offerer[EntityWithIdFields.Id]} 
                                           onReload={onReload}
                        />
                )}
            </Card>
        </Stack>
    );
};

export default HomeOffererTemplates;
