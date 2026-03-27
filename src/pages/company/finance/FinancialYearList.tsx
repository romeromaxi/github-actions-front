import {Fragment, useContext, useEffect, useRef, useState} from 'react';

import {Box, Card, CardContent, Skeleton, Stack} from '@mui/material';

import FinancialDrawerNew from './FinancialDrawerNew';
import FinancialYearAccordion from './components/FinancialYearAccordion';
import {BaseIconWrapper} from "components/icons/Icons";
import {CurrencyCircleDollar} from "phosphor-react";
import {TypographyBase} from "components/misc/TypographyBase";
import {DialogAlert} from "components/dialog";
import {EntityWithIdFields} from "types/baseEntities";
import {BalancesContext, BalancesSourceType} from "hooks/contexts/BalancesContext";
import {FinancialYear, FinancialYearFields} from "types/general/generalFinanceData";
import DialogLoadBalanceByOcr from "components/dialog/DialogLoadBalanceByOcr";
import DialogLoadBalanceByOcrDynamic from 'components/dialog/DialogLoadBalanceByOcrDynamic';
import {AddButton} from "components/buttons/Buttons";
import EmptyStateBox, {EmptyStateBoxVariant} from "components/misc/EmptyStateBox";


interface FinancialYearListProps {
    dataId?: number | string;
    dataSource?: BalancesSourceType;
}

function FinancialYearList({dataId, dataSource}: FinancialYearListProps) {
    const {balances, handleDelete, loading, reloadData} = useContext(BalancesContext);
    const [openDrawerNew, setOpenDrawerNew] = useState<boolean>(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
    const [financialYearDeleteId, setFinancialYearDeleteId] = useState<number>();
    const [financialYearNew, setFinancialYearNew] = useState<number>();
    const [openOcrResult, setOpenOcrResult] = useState<boolean>(false);
    const [selectedOcrItem, setSelectedOcrItem] = useState<FinancialYear | undefined>();
    const [openOcrDynamic, setOpenOcrDynamic] = useState<boolean>(false);

    const domElementRef = useRef(null);

    const handleCloseOcrResult = () => {
        setOpenOcrResult(false);
        setOpenOcrDynamic(false);
        setSelectedOcrItem(undefined);
    };

    const onHandleDelete = (id: number) => {
        setShowConfirmDelete(true);
        setFinancialYearDeleteId(id);
    };

    const onConfirmDelete = () => {
        if (financialYearDeleteId) {
            handleDelete(financialYearDeleteId);
            setShowConfirmDelete(false);
            setFinancialYearDeleteId(undefined);
        }
    };

    const onCancelDelete = () => setShowConfirmDelete(false);

    const onReloadAndEnterDetail = (year: number) => {
        setFinancialYearNew(year);
    };

    useEffect(() => {
        reloadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (balances && balances.length !== 0 && !!financialYearNew && !loading) {
            setFinancialYearNew(undefined);
        }
    }, [balances, loading, financialYearNew]);

    return (
        <Fragment>
            <Stack spacing={2}>
                <Card>
                    <CardContent>
                        <Stack direction={"row"} justifyContent={'space-between'} alignItems={'center'}>
                            <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <BaseIconWrapper Icon={CurrencyCircleDollar} size={'md'} bg={'#F7FAFC'}/>
                                <TypographyBase variant={'h4'} fontWeight={500}>
                                    Estados Contables
                                </TypographyBase>
                            </Stack>
                            <AddButton variant={"contained"} color={"primary"} onClick={() => setOpenDrawerNew(true)}
                                       size={"small"}>
                                Nuevo estado contable
                            </AddButton>
                        </Stack>
                    </CardContent>
                </Card>

                <Stack spacing={2} sx={{marginTop: '5px'}} ref={domElementRef}>
                    {loading ? (
                        Array.from({length: 4}).map((_, index) => (
                            <Card key={`financial-year-skeleton-${index}`}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Skeleton variant="rectangular" height={65}/>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))
                    ) : balances && balances.length > 0 ? (
                        balances.map((balance) => (
                            <FinancialYearAccordion
                                key={balance[EntityWithIdFields.Id]}
                                financialYear={balance}
                                dataId={dataId}
                                dataSource={dataSource}
                                reloadTable={reloadData}
                                onDelete={onHandleDelete}
                            />
                        ))
                    ) : (
                        <EmptyStateBox text={'Aún no hay información para mostrar'}
                                       variant={EmptyStateBoxVariant.InfoRelated}
                        />
                    )}
                </Stack>
            </Stack>

            {financialYearDeleteId && (
                <DialogAlert
                    open={showConfirmDelete}
                    onClose={onCancelDelete}
                    onConfirm={onConfirmDelete}
                    textContent={`¿Estás seguro de que querés eliminar este estado contable?`}
                    severity={'error'}
                />
            )}

            <FinancialDrawerNew
                open={openDrawerNew}
                onCloseDrawer={() => setOpenDrawerNew(false)}
                onAfterSubmit={onReloadAndEnterDetail}
            />

            {selectedOcrItem && (
                selectedOcrItem[FinancialYearFields.DocumentTypeCode] === 1 ? (
                    <DialogLoadBalanceByOcr
                        open={openOcrResult}
                        onClose={handleCloseOcrResult}
                        patrimonialId={selectedOcrItem[FinancialYearFields.PatrimonialStatementId]}
                        incomeId={selectedOcrItem[FinancialYearFields.IncomeStatementId]}
                        guid={selectedOcrItem[FinancialYearFields.OCRProcessGuid]}
                        documentId={selectedOcrItem[FinancialYearFields.DocumentId]}
                    />
                ) : (
                    <DialogLoadBalanceByOcrDynamic
                        open={openOcrDynamic}
                        onClose={handleCloseOcrResult}
                        patrimonialId={selectedOcrItem[FinancialYearFields.PatrimonialStatementId]}
                        incomeId={selectedOcrItem[FinancialYearFields.IncomeStatementId]}
                        guid={selectedOcrItem[FinancialYearFields.OCRProcessGuid]}
                        documentId={selectedOcrItem[FinancialYearFields.DocumentId]}
                    />
                )
            )}
        </Fragment>
    );
}

export default FinancialYearList;
