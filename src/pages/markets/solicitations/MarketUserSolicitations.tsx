import {Grid, Stack} from "@mui/material";
import UserSolicitationsForm from "./components/UserSolicitationsForm";
import {useEffect, useState} from "react";
import {HttpCompany, HttpSolicitation} from "../../../http";
import {
    GeneralSolicitationFilter, GeneralSolicitationFilterFields,
    SolicitationFilterFields,
    SolicitationViewDTO
} from "../../../types/solicitations/solicitationData";
import { EntityListWithPagination, EntityListWithPaginationFields } from "../../../types/baseEntities";
import {CompanyViewDTO, CompanyViewDTOFields} from "../../../types/company/companyData";
import UserSolicitationsTable from "./components/UserSolicitationsTable";
import CompanyNewCardOptions, {CompanyNewCardOptionsMarket} from "../../company/components/CompanyNewCardOptions";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {useNavigate} from "react-router-dom";

const MarketUserSolicitations = () => {
    const routerDomNavigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [solicitations, setSolicitations] = useState<EntityListWithPagination<SolicitationViewDTO>>()
    const [companies, setCompanies] = useState<CompanyViewDTO[]>()
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(undefined)
    const [allSelectedSolicitations, setAllSelectedSolicitations] = useState<SolicitationViewDTO[]>([])
    const [filter, setFilter] = useState<GeneralSolicitationFilter>({
        [GeneralSolicitationFilterFields.CompanyIds]: [],
        [GeneralSolicitationFilterFields.ProductCodes]: [],
        [GeneralSolicitationFilterFields.OnlyActiveStates]: true,
        [GeneralSolicitationFilterFields.OnlyWithAlert]: false,
        [SolicitationFilterFields.PageSize]: 10,
        [SolicitationFilterFields.CurrentPage]: 1
    })
    const [comboSelectedCompany, setComboSelectedCompany] = useState<boolean>(false)
    const [hasAnyCompanyData, setHasAnyCompanyData] = useState<boolean>(true);
        
    const clearSelection = () => {
        setSelectedIds([])
        setSelectedCompanyId(undefined)
        setAllSelectedSolicitations([])
    }
    
    const searchSolicitations = (searchFilter: GeneralSolicitationFilter) => {
        setLoading(true)
        HttpSolicitation.getSolicitationsByUser(searchFilter).then((r) => {
            setLoading(false)
            setSolicitations(r)
        })
    }
    
    const loadPage = () => {
        setLoading(true);
        Promise.all([
            HttpSolicitation.getSolicitationsByUser(filter),
            HttpCompany.getCompaniesByUser()
        ])
            .then(([responseSolicitations, responseCompanies]) => {
                setSolicitations(responseSolicitations);
                const companiesFiltered = responseCompanies.filter(x => x[CompanyViewDTOFields.AllowCompanyAccess]);
                setHasAnyCompanyData(!!companiesFiltered && !!companiesFiltered.length);
                setCompanies(companiesFiltered);
            })
            .finally(() => setLoading(false))
    }
    
    useEffect(() => {
        loadPage();
    }, []);
    
    const handleChangePage = (currentPage: number) => {
        const newFilter = {
            ...filter,
            [SolicitationFilterFields.CurrentPage]: currentPage
        }
        setFilter(newFilter)
        searchSolicitations(newFilter)
    }
    
    const handleSearchFilter = (newFilter: Partial<GeneralSolicitationFilter>) => {
        const updatedFilter = {
            ...filter,
            ...newFilter
        }
        setFilter(updatedFilter)
        clearSelection()
        searchSolicitations(updatedFilter)
    }

    const handleToggleSelection = (id: number, companyId: number) => {
        setSelectedIds((prev) => {
            const alreadySelected = prev.includes(id)
            if (alreadySelected) {
                const next = prev.filter(x => x !== id)
                if (next.length === 0) setSelectedCompanyId(undefined)
                return next
            }
            if (selectedCompanyId !== undefined && selectedCompanyId !== companyId) return prev
            if (selectedCompanyId === undefined) setSelectedCompanyId(companyId)
            return [...prev, id]
        })
        
        setAllSelectedSolicitations((prev) => {
            const alreadySelected = prev.some(s => s.id === id)
            if (alreadySelected) {
                return prev.filter(s => s.id !== id)
            }
            const solicitation = solicitations?.[EntityListWithPaginationFields.List]?.find(s => s.id === id)
            if (solicitation) {
                return [...prev, solicitation]
            }
            return prev
        })
    }

    const handleClickJoin = () => {
        routerDomNavigate({
            pathname: '/nueva-pyme',
            search: '?redirect=market/solicitudes'
        })
    }

    //const selectedSolicitations = allSelectedSolicitations
    
    return (
        <>
            {/*
                !isMediumScreen &&
                    <UserSolicitationsSummary />
            */}
            
            {
                !loading && (!hasAnyCompanyData) && (solicitations && (!solicitations.lista.length)) &&
                <Stack spacing={4.25} justifyContent='center' alignItems='center'
                       minHeight={'70dvh'}
                >
                    <TypographyBase variant={'h4'} fontWeight={600} textAlign='center'>
                        Para poder enviar solicitudes, tenés que vincular tu perfil a una PyME
                    </TypographyBase>
                    
                    <Grid container spacing={3}
                          ml={'-24px !important'}
                    >
                        <CompanyNewCardOptionsMarket
                            companies={companies}
                            hasAnyCompanyData={hasAnyCompanyData}
                            onClickJoin={handleClickJoin}
                            onReload={loadPage}
                            redirectUrl={'/nueva-pyme?redirect=market/solicitudes'}
                            onValidationRedirectUrl={'/market/solicitudes'}
                        />
                    </Grid>
                </Stack>
            }
            
            {
                (loading || hasAnyCompanyData || (!!solicitations?.lista?.length)) &&
                <Stack sx={{width: '100%'}} spacing={3} mb={2}>
                    <UserSolicitationsForm 
                        onSearch={handleSearchFilter} 
                        companies={companies} 
                        selectedSolicitations={allSelectedSolicitations}
                        selectedCompanyId={selectedCompanyId} 
                        setComboSelectedCompany={setComboSelectedCompany}
                    />
                    <UserSolicitationsTable 
                        solicitations={solicitations} 
                        loading={loading}
                        onPaging={handleChangePage}
                        withAlert={filter[GeneralSolicitationFilterFields.OnlyWithAlert]}
                        selectedIds={selectedIds}
                        selectedCompanyId={selectedCompanyId}
                        onToggleSelection={handleToggleSelection}
                        onlyActiveStates={filter[GeneralSolicitationFilterFields.OnlyActiveStates]} 
                        comboSelectedCompany={comboSelectedCompany}
                    />
                </Stack>
            }
        </>
    )
}

export default MarketUserSolicitations