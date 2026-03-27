import React, {useEffect, useState} from 'react';
import {Card, CardContent, Skeleton, Stack} from '@mui/material';

import {
    CompanyFinanceHeader,
    CompanyFinanceHeaderFields
} from 'types/company/companyFinanceInformationData';

import CompanyFinanceHeaderDrawer from '../CompanyFinanceHeaderDrawer';

import {HttpCompanyDeclarationOfAssets} from 'http/index';
import {BaseIconWrapper} from "components/icons/Icons";
import {CurrencyCircleDollar} from "phosphor-react";
import {TypographyBase} from "components/misc/TypographyBase";
import {EntityWithIdFields} from "types/baseEntities";
import {useAction} from "hooks/useAction";
import {DialogAlert} from "components/dialog";
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";
import DeclarationOfAssetsAccordion from './DeclarationOfAssetsAccordion';
import {FormProvider, useForm} from 'react-hook-form';
import {AddButton} from "components/buttons/Buttons";
import EmptyStateBox, {EmptyStateBoxVariant} from "components/misc/EmptyStateBox";

function CompanyDeclarationOfAssetsList() {
    const {companyId} = useApplicationCommon();

    const [openDrawerNew, setOpenDrawerNew] = useState<boolean>(false);
    const {snackbarSuccess, snackbarError} = useAction();
    const [loading, setLoading] = useState<boolean>(false);
    const [listDeclarationsOfAssets, setListDeclarationsOfAssets] = useState<CompanyFinanceHeader[]>();
    const [deleteItem, setDeleteItem] = useState<CompanyFinanceHeader>();

    const loadDeclarationsOfAssets = () => {
        setListDeclarationsOfAssets(undefined);
        HttpCompanyDeclarationOfAssets.getHeaderByCompany(companyId).then((res) => {
            setListDeclarationsOfAssets(res);
        });
    };

    useEffect(() => {
        loadDeclarationsOfAssets();
    }, []);

    const onNewDeclarationOfAssets = () => {
        setOpenDrawerNew(false);
        loadDeclarationsOfAssets();
    };

    const onHandleDelete = () => {
        if (deleteItem) {
            setLoading(true);
            HttpCompanyDeclarationOfAssets.delete(
                deleteItem[CompanyFinanceHeaderFields.CompanyId],
                deleteItem[EntityWithIdFields.Id],
            )
                .then(() => {
                    snackbarSuccess('La manifestación de bienes fue eliminada con éxito');
                    loadDeclarationsOfAssets();
                    setDeleteItem(undefined);
                })
                .catch(() => {
                    snackbarError('La manifestación de bienes no pudo ser eliminada');
                })
                .finally(() => setLoading(false));
        }
    };

    const methods = useForm();

    return (
        <React.Fragment>
            <FormProvider {...methods}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                    <BaseIconWrapper Icon={CurrencyCircleDollar} size={'md'} bg={'#F7FAFC'}/>
                                    <TypographyBase variant={'h4'} fontWeight={500}>
                                        Manifestación de Bienes
                                    </TypographyBase>
                                </Stack>
                                <AddButton variant="contained" color="primary" size="small"
                                           onClick={() => setOpenDrawerNew(true)}>
                                    Nueva Manifestación de Bienes
                                </AddButton>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Stack spacing={2}>
                        {loading || !listDeclarationsOfAssets ? (
                            Array.from({length: 4}).map((_, index) => (
                                <Card key={`financial-year-skeleton-${index}`}>
                                    <CardContent>
                                        <Stack spacing={2} direction={'row'} justifyContent={'space-between'}>
                                            <Skeleton variant="text" width={'50%'}/>

                                            <Skeleton variant="text" width={'5%'}/>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))
                        ) : listDeclarationsOfAssets && listDeclarationsOfAssets.length > 0 ? (
                            listDeclarationsOfAssets.map((declaration) => (
                                <DeclarationOfAssetsAccordion key={declaration[EntityWithIdFields.Id]}
                                                              declarationOfAssets={declaration}
                                                              reloadTable={loadDeclarationsOfAssets}
                                                              onDelete={setDeleteItem}
                                />
                            ))
                        ) : (
                            <EmptyStateBox text={'Aún no hay información para mostrar'}
                                           variant={EmptyStateBoxVariant.InfoRelated}
                            />
                        )}
                    </Stack>
                </Stack>
            </FormProvider>

            <CompanyFinanceHeaderDrawer
                show={openDrawerNew}
                title="Nueva manifestación de bienes"
                companyId={companyId}
                onFinishProcess={onNewDeclarationOfAssets}
                onSubmit={HttpCompanyDeclarationOfAssets.insert}
                onCloseDrawer={() => setOpenDrawerNew(false)}
            />

            {deleteItem && (
                <DialogAlert
                    onClose={() => setDeleteItem(undefined)}
                    open={!!deleteItem}
                    textContent={`¿Estás seguro que querés eliminar la manifestación al ${new Date(deleteItem[CompanyFinanceHeaderFields.Date]).toLocaleDateString()}?`}
                    onConfirm={onHandleDelete}
                    severity={'error'}
                />
            )}
        </React.Fragment>
    );
}

export default CompanyDeclarationOfAssetsList;
