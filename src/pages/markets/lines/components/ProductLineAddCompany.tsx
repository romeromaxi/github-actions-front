import {useAction} from "../../../../hooks/useAction";
import React, {useEffect, useState} from "react";
import {
    CompanyLineStatusViewDTO,
    CompanyLineStatusViewDTOFields
} from "../../../../types/lines/productLineData";
import {CompanyTotalsShoppingCart, CompanyTotalsShoppingCartFields} from "../../../../types/market/marketData";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {HttpMarketShoppingCart} from "../../../../http/market/httpMarketShoppingCart";
import {Alert, Card, CardContent, CardHeader, Grid, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {Skeleton} from "@mui/lab";
import {CompanyLineStatusListItem} from "../shoppingbag/components/CompanyLineStatusListItem";
import {CompanyTotalsListItem} from "../shoppingbag/components/CompanyTotalsListItem";
import BoxNewEntity from "../../../../components/misc/BoxNewEntity";
import {DefaultMarketButton} from "../../../../components/buttons/Buttons";
import {NewCompanyContext} from "../../../company/components/MyCompaniesList";
import NewCompanyBaseDrawer from "../../../company/components/new/NewCompanyBaseDrawer";


interface ProductLineAddCompanyProps {
    onAddCompany: (id: number) => void,
    lineId?: number
}

const ProductLineAddCompany = ({onAddCompany, lineId} : ProductLineAddCompanyProps) => {
    const { addLineToShoppingCart } = useAction();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [companiesStatusLine, setCompaniesStatusLine] =
        useState<CompanyLineStatusViewDTO[]>();
    const [companiesTotals, setCompaniesTotals] =
        useState<CompanyTotalsShoppingCart[]>();
    const [openNewCompany, setOpenNewCompany] = useState<boolean>(false)
    const [getValues, setGetValues] = useState<boolean>(true)

    const handleListItemClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handleOnAdd = () => {
        companiesStatusLine && lineId &&
        addLineToShoppingCart(
            lineId,
            companiesStatusLine[selectedIndex][EntityWithIdFields.Id],
            () => {
                onAddCompany(companiesStatusLine[selectedIndex][EntityWithIdFields.Id])
            },
        );
    }

    useEffect(() => {
        if (lineId && getValues) {
            setCompaniesTotals(undefined);
            HttpMarketShoppingCart.getAvailabilityList(
                lineId,
            ).then((response) => {
                setCompaniesStatusLine(response);
                setSelectedIndex(
                    response.findIndex(
                        (x) =>
                            !x[CompanyLineStatusViewDTOFields.InShoppingCart] &&
                            !x[CompanyLineStatusViewDTOFields.SolicitationInProgress] &&
                            x[CompanyLineStatusViewDTOFields.HasPermissions],
                    ),
                );
            });
            setOpenNewCompany(false);
        }
    }, [lineId, getValues]);

    useEffect(() => {
        if (getValues && !lineId) {
            setCompaniesStatusLine(undefined);
            HttpMarketShoppingCart.getCompanyTotalsByUser().then((response) => {
                setCompaniesTotals(response);
                setSelectedIndex(
                    response.findIndex(
                        (x) => x[CompanyTotalsShoppingCartFields.HasPermissions],
                    ),
                );
            });
            setOpenNewCompany(false);
        }
    }, [lineId, getValues]);
    
    
    return (
        <div style={{width: '100% !important', marginBottom: '16px'}}>
            <Card>
                <CardHeader title={'¿Para qué empresa buscás asistencia?'}/>
                <CardContent>
                    <Grid xs={12}>
                        <Stack
                            direction={'column'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            spacing={4}
                        >
                            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                <List component="nav" aria-label="secondary mailbox folder">
                                    {!companiesStatusLine && !companiesTotals && <Skeleton />}
                                    {
                                        companiesStatusLine && companiesStatusLine.length == 0 &&
                                            <Alert severity='info'>No hay empresas agregadas. Puede agregar una nueva presionando en el botón de abajo</Alert>
                                    }
    
                                    {companiesStatusLine?.map((companyStatus, idx) => (
                                        <CompanyLineStatusListItem
                                            companyLineStatus={companyStatus}
                                            selected={selectedIndex === idx}
                                            onClick={() => handleListItemClick(idx)}
                                            key={`companyLineStatusListItem_${idx}`}
                                        />
                                    ))}
    
                                    {companiesTotals?.map((companyTotal, idx) => (
                                        <CompanyTotalsListItem
                                            companyTotal={companyTotal}
                                            selected={selectedIndex === idx}
                                            onClick={() => handleListItemClick(idx)}
                                            key={`companyTotalsListItem_${idx}`}
                                        />
                                    ))}
                                </List>
                                <BoxNewEntity
                                    title={'Nueva Empresa'}
                                    subtitle={
                                        'Hacé click en el botón para agregar una nueva empresa'
                                    }
                                    onClickNew={() => {
                                        setOpenNewCompany(true);
                                        setGetValues(false)
                                    }}
                                />
                            </Box>
                            <DefaultMarketButton onClick={handleOnAdd} disabled={companiesStatusLine && companiesStatusLine.length == 0}>
                                Continuar
                            </DefaultMarketButton>
                        </Stack>
                    </Grid>
                </CardContent>
            </Card>
            <NewCompanyContext.Provider
                value={{ onCloseDrawer: () => setOpenNewCompany(false) }}
            >
                <NewCompanyBaseDrawer open={openNewCompany}
                                      onReload={() => setGetValues(true)}
                                      onClose={() => {
                                          setOpenNewCompany(false)
                                      }}
                                      onSubmit={() => {
                                          setOpenNewCompany(false)
                                          setGetValues(true)
                                      }}
                />
            </NewCompanyContext.Provider>
        </div>
    )
}


export default ProductLineAddCompany 