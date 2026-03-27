import React, {useEffect, useMemo, useState} from 'react';
import {CompanyViewDTO,} from 'types/company/companyData';
import {EntityListWithPagination, EntityListWithPaginationFields, EntityWithIdFields} from "types/baseEntities";
import {HttpSolicitation} from "http/index";
import {Stack} from "@mui/material";
import UserSolicitationsTable from "../../markets/solicitations/components/UserSolicitationsTable";
import {
    GeneralSolicitationFilter,
    GeneralSolicitationFilterFields,
    SolicitationFilterFields,
    SolicitationViewDTO,
    SolicitationViewDTOFields
} from "types/solicitations/solicitationData";
import {
    SolicitationClassificationTypesStatusType,
    SolicitationTypes
} from "../../../types/solicitations/solicitationEnums";
import {SendButtonNew} from "../../../components/buttons/Buttons";
import {CompanyFileType} from "../../../types/company/companyEnums";
import {
    MarketSolicitationFields,
    marketSolicitationStorage
} from "../../../util/sessionStorage/marketSolicitationStorage";
import {useNavigate} from "react-router-dom";


interface CompanySolicitationsPageProps {
  company: CompanyViewDTO
}

function CompanySolicitationsPage({company} : CompanySolicitationsPageProps) {
    const navigate = useNavigate();
    const companyId : number = company[EntityWithIdFields.Id];  
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [allSelectedSolicitations, setAllSelectedSolicitations] = useState<SolicitationViewDTO[]>([]);
    const [paginatedSolicitationList, setPaginatedSolicitationList] = useState<EntityListWithPagination<SolicitationViewDTO>>();
    
    const canSendSelected = useMemo(() => (
        allSelectedSolicitations.length > 0 && allSelectedSolicitations.every(
            s => {
                const classType = s[SolicitationViewDTOFields.CompanySolicitationClassificationStatusTypeCod] as SolicitationClassificationTypesStatusType | undefined;
                return classType === SolicitationClassificationTypesStatusType.InCart ||
                    classType === SolicitationClassificationTypesStatusType.Active;
            })
    ), [allSelectedSolicitations]);
    
    const alertDefault = window.location.toString().includes('alert')
    
    const [solicitationFilter, setSolicitationFilter] =
        useState<GeneralSolicitationFilter>({
            [GeneralSolicitationFilterFields.CompanyIds]: [companyId],
            [GeneralSolicitationFilterFields.ProductCodes]: [],
            [GeneralSolicitationFilterFields.OnlyActiveStates]: true,
            [GeneralSolicitationFilterFields.OnlyWithAlert]: alertDefault,
            [SolicitationFilterFields.PageSize]: 10,
            [SolicitationFilterFields.CurrentPage]: 1,
        });
    
    
    const searchSolicitations = (filter: GeneralSolicitationFilter) => {
        setLoading(true);
        HttpSolicitation.getSolicitationsByUser(filter)
            .then((paginatedList) => {
                setPaginatedSolicitationList(paginatedList)
                setLoading(false)
            })
    }
    
    const handleChangePage = (currentPage: number) => {
        const newFilter = {
            ...solicitationFilter,
            [SolicitationFilterFields.CurrentPage]: currentPage
        }
        setSolicitationFilter(newFilter)
        searchSolicitations(newFilter)
    }
    
    const handleToggleSelection = (id: number, companyId: number) => {
        setSelectedIds((prev) => {
            const alreadySelected = prev.includes(id)
    
            if (alreadySelected)
                return prev.filter(x => x !== id)
            
            return [...prev, id]
        })
    
        setAllSelectedSolicitations((prev) => {
            const alreadySelected = prev.some(s => s.id === id)
            
            if (alreadySelected)
                return prev.filter(s => s.id !== id)
            
            const solicitation = paginatedSolicitationList?.[EntityListWithPaginationFields.List]?.find(s => s.id === id)
           
            if (solicitation)
                return [...prev, solicitation];
            
            return prev
        })
    }
    
    const handleSendSelected = () => {
        if (!canSendSelected || allSelectedSolicitations.length === 0) return;
        
        const solicitationIds = allSelectedSolicitations.map(s => s.id);
        const referenceSolicitation = allSelectedSolicitations[0];
        const solicitationType = referenceSolicitation[SolicitationViewDTOFields.SolicitationTypeCode] ?? SolicitationTypes.General;
        const fileType = referenceSolicitation[SolicitationViewDTOFields.FileTypeCode] ?? CompanyFileType.Short;
        
        marketSolicitationStorage.setCurrentSolicitation({
            [MarketSolicitationFields.CompanyId]: companyId,
            [MarketSolicitationFields.SolicitationIdList]: solicitationIds,
            [MarketSolicitationFields.SolicitationType]: solicitationType,
            [MarketSolicitationFields.FileType]: fileType,
        });
        
        navigate(`/market/lines/${companyId}/prequalification`);
    }
    
    useEffect(() => {
        searchSolicitations(solicitationFilter)
    }, [company]);
  
    return (
        <Stack spacing={2}>
            {
                allSelectedSolicitations.length > 0 && (
                    <Stack direction={'row'} width={1} 
                           spacing={2} 
                           justifyContent={'end'}
                    >
                        {
                            canSendSelected && (
                                <SendButtonNew size="small" onClick={handleSendSelected}>
                                    Enviar seleccionadas
                                </SendButtonNew>
                            )
                        }
                    </Stack>
            )}
        
            <UserSolicitationsTable solicitations={paginatedSolicitationList} 
                                    loading={loading} 
                                    onPaging={handleChangePage} 
                                    selectedIds={selectedIds} 
                                    onToggleSelection={handleToggleSelection}
                                    hideCompanyInfo
            />
        </Stack>
    );
}

export default CompanySolicitationsPage;
