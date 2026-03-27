import React, {useContext, useEffect, useState} from 'react';
import {HttpCacheCompany} from 'http/index';
import {Card, CardContent, Stack, Button, Skeleton} from '@mui/material';
import {EntityWithIdAndDescription, EntityWithIdFields,} from 'types/baseEntities';
import {DialogAlert} from 'components/dialog';
import {BaseIconWrapper} from "components/icons/Icons";
import {UsersThree} from "phosphor-react";
import {TypographyBase} from "components/misc/TypographyBase";
import {useForm} from 'react-hook-form';
import NewRelatedPersonMultipleDrawer from "./NewRelatedPersonMultipleDrawer";
import {
    PersonRelationship,
    PersonRelationshipFields,
    PersonRelationshipFilter,
    PersonRelationshipFilterFields
} from 'types/person/personData';
import {RelatedPersonContext} from "hooks/contexts/RelatedPersonContext";
import RelatedPersonAccordion from './RelatedPersonAccordion';
import {PlusIcon, ShareIcon, ListFilterIcon, UsersRoundIcon} from 'lucide-react';
import EmptyStateBox, {EmptyStateBoxVariant} from "components/misc/EmptyStateBox";
import RelatedPersonExportDialog from "./RelatedPersonExportDialog";
import ButtonMultiselect from "components/forms/ButtonMultiselect";


export const CompanyRelatedPersonTableContext = React.createContext({
    editing: false,
    reloadRelatedPerson: (
        relationshipsFilter: PersonRelationshipFilter,
    ) => {
    },
});

interface RelatedPersonTableProps {
    legalPerson?: boolean;
}

function RelatedPersonTable(props: RelatedPersonTableProps) {
    const {
        relationshipLst,
        inverseRelationshipLst,
        getRelationships,
        handleDelete,
        handleExportLst,
        loading,
        hasInverseRelationships
    } = useContext(RelatedPersonContext)

    const [relationshipDelete, setRelationshipDelete] =
        useState<PersonRelationship>();
    const [openDrawerNew, setOpenDrawerNew] = useState<boolean>(false);
    const [openExportDialog, setOpenExportDialog] = useState<boolean>(false);
    const [lstTypes, setLstTypes] = useState<EntityWithIdAndDescription[]>();

    const {control, watch} = useForm<PersonRelationshipFilter>()
    const watchTypes = watch(PersonRelationshipFilterFields.ListRelationshipTypes)
    const [relationshipsFilter, setRelationshipsFilter] =
        useState<PersonRelationshipFilter>({
            [PersonRelationshipFilterFields.ListRelationshipTypes]:
            watchTypes,
        });

    const searchRelatedPerson = (
        relationshipsCodes: PersonRelationshipFilter,
    ) => {
        getRelationships(relationshipsCodes)
    };

    const buildExportButton = () =>
        relationshipLst?.length !== 0 && (
            <Button onClick={() => setOpenExportDialog(true)}
                    size={'small'}
                    startIcon={<ShareIcon size={18}/>}
                    variant="outlined"
                    color="secondary"
                    id={'entity-related-people-export-btn'}
            >
                Exportar
            </Button>
        );

    const onCancelDelete = () => setRelationshipDelete(undefined);

    const onConfirmDelete = () => {
        if (relationshipDelete) {
            handleDelete(relationshipDelete?.[EntityWithIdFields.Id])
            setRelationshipDelete(undefined);
        }
    };

    const openRelatedPersonDrawer = () => setOpenDrawerNew(true);

    const closeRelatedPersonDrawer = () => setOpenDrawerNew(false);

    const onNewPersonSubmit = () => {
        setOpenDrawerNew(false);
        searchRelatedPerson(relationshipsFilter);
    };

    const callbackRelationshipTypes = props.legalPerson
        ? HttpCacheCompany.getRelationshipTypesLegal
        : HttpCacheCompany.getRelationshipTypesPhysical;

    useEffect(() => {
        searchRelatedPerson(relationshipsFilter);
        callbackRelationshipTypes()
            .then(setLstTypes);
    }, []);

    useEffect(() => {
        if (watchTypes) {
            const filter: PersonRelationshipFilter = {
                [PersonRelationshipFilterFields.ListRelationshipTypes]:
                watchTypes,
            };
            setRelationshipsFilter(filter);
            searchRelatedPerson(filter);
        }
    }, [watchTypes]);

    return (
        <React.Fragment>
            <Stack spacing={2}>
                <Card sx={{borderRadius: 3}}>
                    <CardContent>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <BaseIconWrapper Icon={UsersThree} size={'md'} bg={'#F7FAFC'}/>
                                <TypographyBase variant={'h4'} fontWeight={500}>
                                    Personas Relacionadas
                                </TypographyBase>
                            </Stack>
                            <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
                                <ButtonMultiselect
                                    control={control}
                                    name={PersonRelationshipFilterFields.ListRelationshipTypes}
                                    label={'Filtrar'}
                                    startIcon={<ListFilterIcon size={18}/>}
                                    options={lstTypes}
                                />
                                {buildExportButton()}
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<PlusIcon size={18}/>}
                                    onClick={openRelatedPersonDrawer}
                                >
                                    Nueva persona relacionada
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Stack spacing={3}>

                    {loading ? (
                        Array.from({length: 3}).map((_, idx) => (
                            <Card key={idx} sx={{borderRadius: 2}}>
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Skeleton width="60%" height={30}/>
                                        <Skeleton width="40%" height={20}/>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))
                    ) : relationshipLst && relationshipLst.length > 0 ? (
                        relationshipLst.map((relationship) => (
                            <RelatedPersonAccordion
                                key={relationship[EntityWithIdFields.Id]}
                                relationship={relationship}
                                legalPerson={props.legalPerson}
                                reloadTable={() => searchRelatedPerson(relationshipsFilter)}
                                onDelete={(id) => setRelationshipDelete(relationship)}
                            />
                        ))
                    ) : (
                        <EmptyStateBox text={'Aún no hay información para mostrar'}
                                       variant={EmptyStateBoxVariant.InfoRelated}
                        />
                    )}
                </Stack>

                {hasInverseRelationships && inverseRelationshipLst && inverseRelationshipLst.length > 0 && (
                    <Stack spacing={2}>
                        <Card sx={{borderRadius: 3}}>
                            <CardContent>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                        <BaseIconWrapper Icon={UsersRoundIcon} size={'md'} bg={'#F7FAFC'}/>
                                        <TypographyBase variant={'h5'} fontWeight={500}>
                                            Relaciones inversas
                                        </TypographyBase>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                        <Stack spacing={2}>
                            {inverseRelationshipLst.map((relationship) => (
                                <RelatedPersonAccordion
                                    key={relationship[EntityWithIdFields.Id]}
                                    relationship={relationship}
                                    legalPerson={props.legalPerson}
                                    reloadTable={() => searchRelatedPerson(relationshipsFilter)}
                                    onDelete={(id) => setRelationshipDelete(relationship)}
                                    isInverseRelationship={true}
                                />
                            ))}
                        </Stack>
                    </Stack>
                )}
            </Stack>

            <NewRelatedPersonMultipleDrawer
                show={openDrawerNew}
                onCloseDrawer={closeRelatedPersonDrawer}
                onFinishProcess={onNewPersonSubmit}
                legalPerson={props.legalPerson}
            />

            <RelatedPersonExportDialog
                open={openExportDialog}
                onClose={() => setOpenExportDialog(false)}
                legalPerson={props.legalPerson}
            />

            <DialogAlert
                open={!!relationshipDelete}
                onClose={onCancelDelete}
                onConfirm={onConfirmDelete}
                textContent={`¿Estás seguro que deseás eliminar al integrante ${relationshipDelete?.[PersonRelationshipFields.LegalName] || ''}?`}
                severity={'error'}
            />
        </React.Fragment>
    );
}

export default RelatedPersonTable;
