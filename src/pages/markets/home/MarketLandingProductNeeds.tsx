import React, {useEffect, useState} from "react";
import {FilterProductLineSearchFields, ProductLineView} from "../../../types/lines/productLineData";
import {HttpMarketIntermediate} from "../../../http/market";
import {Alert, Box, Button, Card, CardContent, CardHeader, Chip, Stack, Typography} from "@mui/material";
import CardLoading from "../../../components/cards/CardLoading";
import {EntityWithIdFields} from "../../../types/baseEntities";
import ProductLineCard from "../lines/components/ProductLineCard";
import {DefaultStylesButton} from "../../../components/buttons/Buttons";
import {SearchRounded} from "@mui/icons-material";
import {AppRouteSecObjects, SecurityComponents} from "../../../types/security";
import {createSearchParams, URLSearchParamsInit, useNavigate} from "react-router-dom";
import {marketFilterStorage, MarketLandingFilter} from "../../../util/sessionStorage/marketFiltersStorage";
import FailRedirectMarketDialog from "./components/FailRedirectMarketDialog";
import useSecurityObject from "../../../hooks/useSecurityObject";

function MarketLandingProductNeeds() {
    const navigate = useNavigate();
    const { hasReadPermission } = useSecurityObject();
    const [failRoute, setFailRoute] = useState<boolean>(false);

    const goToSearchProductLine = (listParams: URLSearchParamsInit | undefined, landingFilter: MarketLandingFilter) => {
        if (
            !hasReadPermission(
                SecurityComponents.AppRoutes,
                AppRouteSecObjects.MarketProductLineSearchRoute,
            )
        ) {
            setFailRoute(true);
            return;
        }
        
        let searchParams = createSearchParams(listParams);
        marketFilterStorage.clearSearchFilter();
        marketFilterStorage.clearStackedFilters();
        marketFilterStorage.saveLandingFilter(landingFilter);
        navigate(`/market/lines?${searchParams}`);
    };
    
    const onSearchWorkingCapital = () => {
        let listParams: URLSearchParamsInit | undefined = [];
        listParams.push(['destiny', 5]);
        let landingFilter = {
            [FilterProductLineSearchFields.CodsProduct]: [],
            [FilterProductLineSearchFields.CodsProductDestiny]: [5],
            [FilterProductLineSearchFields.CodsProductService]: [],
            [FilterProductLineSearchFields.CodsProductInstrument]: [],
            [FilterProductLineSearchFields.CodsProductInstrumentType]: []
        };
        goToSearchProductLine(listParams, landingFilter);
    }
    const onSearchInvestment = () => {
        let listParams: URLSearchParamsInit | undefined = [];
        listParams.push(['service', 2]);
        let landingFilter = {
            [FilterProductLineSearchFields.CodsProduct]: [],
            [FilterProductLineSearchFields.CodsProductDestiny]: [],
            [FilterProductLineSearchFields.CodsProductService]: [2],
            [FilterProductLineSearchFields.CodsProductInstrument]: [],
            [FilterProductLineSearchFields.CodsProductInstrumentType]: []
        };
        goToSearchProductLine(listParams, landingFilter);
    }
    
    const onSearchGuarantors = () => {
        let listParams: URLSearchParamsInit | undefined = [];
        listParams.push(['destiny', 6]);
        let landingFilter = {
            [FilterProductLineSearchFields.CodsProduct]: [],
            [FilterProductLineSearchFields.CodsProductDestiny]: [6],
            [FilterProductLineSearchFields.CodsProductService]: [],
            [FilterProductLineSearchFields.CodsProductInstrument]: [],
            [FilterProductLineSearchFields.CodsProductInstrumentType]: []
        };
        goToSearchProductLine(listParams, landingFilter);
    }
    
    const onSearchOpeningAccounts = () => {
        let listParams: URLSearchParamsInit | undefined = [];
        listParams.push(['service', 4]);
        let landingFilter = {
            [FilterProductLineSearchFields.CodsProduct]: [],
            [FilterProductLineSearchFields.CodsProductDestiny]: [],
            [FilterProductLineSearchFields.CodsProductService]: [4],
            [FilterProductLineSearchFields.CodsProductInstrument]: [],
            [FilterProductLineSearchFields.CodsProductInstrumentType]: []
        };
        goToSearchProductLine(listParams, landingFilter);
    }
    const onSearchInsurance = () => {
        let listParams: URLSearchParamsInit | undefined = [];
        listParams.push(['service', 6]);
        let landingFilter = {
            [FilterProductLineSearchFields.CodsProduct]: [],
            [FilterProductLineSearchFields.CodsProductDestiny]: [],
            [FilterProductLineSearchFields.CodsProductService]: [6],
            [FilterProductLineSearchFields.CodsProductInstrument]: [],
            [FilterProductLineSearchFields.CodsProductInstrumentType]: []
        };
        goToSearchProductLine(listParams, landingFilter);
    }

    const needs = [
        {
            "descripcion": "Pago de Salarios",
            "destino": onSearchWorkingCapital,
            "mostrar": true
        },
        {
            "descripcion": "Compra de Insumos",
            "destino": onSearchWorkingCapital,
            "mostrar": true
        },
        {
            "descripcion": "Pago de Impuestos",
            "destino": onSearchWorkingCapital,
            "mostrar": true
        },
        {
            "descripcion": "Cancelacion de Deuda",
            "destino": onSearchWorkingCapital,
            "mostrar": true
        },
        {
            "descripcion": "Cubrir Descubiertos",
            "destino": onSearchWorkingCapital,
            "mostrar": true
        },
        {
            "descripcion": "Renovacion Mobiliario",
            "destino": onSearchWorkingCapital,
            "mostrar": true
        },
        {
            "descripcion": "Reparacion Edilicia",
            "destino": onSearchInvestment,
            "mostrar": true
        },
        {
            "descripcion": "Oportunidad Financiera",
            "destino": onSearchWorkingCapital,
            "mostrar": true
        },
        {
            "descripcion": "Compra de Maquinaria Productiva",
            "destino": onSearchInvestment,
            "mostrar": true
        },
        {
            "descripcion": "Reposicion Maquinaria",
            "destino": onSearchInvestment,
            "mostrar": true
        },
        {
            "descripcion": "Ampliacion de Planta",
            "destino": onSearchInvestment,
            "mostrar": true
        },
        {
            "descripcion": "Importacion",
            "destino": onSearchInvestment,
            "mostrar": true
        },
        {
            "descripcion": "Exportacion",
            "destino": onSearchWorkingCapital,
            "mostrar": true
        },
        {
            "descripcion": "Garantias / Avales",
            "destino": onSearchGuarantors,
            "mostrar": true
        },
        {
            "descripcion": "Linea de Credito Abierta",
            "destino": onSearchGuarantors,
            "mostrar": true
        },
        {
            "descripcion": "Garantias para descontar facturas",
            "destino": onSearchGuarantors,
            "mostrar": true
        },
        {
            "descripcion": "Garantias para descontar cheques",
            "destino": onSearchGuarantors,
            "mostrar": true
        },
        {
            "descripcion": "Garantias para acceder a Creditos",
            "destino": onSearchGuarantors,
            "mostrar": true
        },
        {
            "descripcion": "Garantias para Exportaciones",
            "destino": onSearchGuarantors,
            "mostrar": true
        },
        {
            "descripcion": "Cuenta para operaciones Corrientes",
            "destino": onSearchOpeningAccounts,
            "mostrar": true
        },
        {
            "descripcion": "Descubiertos en cuenta",
            "destino": onSearchOpeningAccounts,
            "mostrar": true
        },
        {
            "descripcion": "Seguros de Causion",
            "destino": onSearchInsurance,
            "mostrar": true
        },
        {
            "descripcion": "Seguros comerciales",
            "destino": onSearchInsurance,
            "mostrar": true
        }
    ]
    
    return (
        <Card>
            <CardHeader title={"¿Qué buscas?"} />
            
            <CardContent>
                <Stack spacing={1}>
                    {
                        needs.map((x, idx) => (
                            x.mostrar ?
                                <Chip label={x.descripcion} onClick={x.destino} 
                                      sx={{
                                          backgroundColor: '#f5f5f5', // Color de fondo sobrio
                                          color: '#333', // Color del texto elegante
                                          '&:hover': {
                                              backgroundColor: '#e0e0e0', // Color de fondo al pasar el cursor
                                          },
                                          '& .MuiChip-label': {
                                              fontWeight: 'bold', // Texto en negrita
                                          },
                                      }}
                                />
                                :
                                null
                        ))
                    }
                </Stack>
            </CardContent>
            
            <FailRedirectMarketDialog
                open={failRoute}
                onClose={() => {
                    setFailRoute(false);
                }}
            />
        </Card>
    );
}

export default MarketLandingProductNeeds;