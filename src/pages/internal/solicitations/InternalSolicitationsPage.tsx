import {useEffect, useState} from "react";
import {HttpSolicitationInternal} from "../../../http/solicitations/httpSolicitationInternal";
import {
    InternalSolicitationFilterFields, InternalSolicitationFilter, SolicitationFilterFields, SolicitationViewDTO
} from "../../../types/solicitations/solicitationData";
import {EntityListWithPagination} from "../../../types/baseEntities";
import {Stack} from "@mui/material";
import InternalSolicitationsForm from "./InternalSolicitationsForm";
import InternalSolicitationsTable from "./InternalSolicitationsTable";


const InternalSolicitationsPage = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [solicitations, setSolicitations] = useState<EntityListWithPagination<SolicitationViewDTO>>()
    const [filter, setFilter] = useState<InternalSolicitationFilter>({
        [InternalSolicitationFilterFields.OffererIds]: [],
        [InternalSolicitationFilterFields.CompanyBusinessName]: '',
        [InternalSolicitationFilterFields.CompanyCuit]: '',
        [SolicitationFilterFields.PageSize]: 10,
        [SolicitationFilterFields.CurrentPage]: 1
    })
    const searchSolicitations = (searchFilter: InternalSolicitationFilter) => {
        setLoading(true)
        HttpSolicitationInternal.getSolicitationsByUser(searchFilter).then((r) => {
            setLoading(false)
            setSolicitations(r)
        })
    }
    
    useEffect(() => {
        searchSolicitations(filter)
    }, []);

    const handleChangePage = (currentPage: number) => {
        const newFilter = {
            ...filter,
            [SolicitationFilterFields.CurrentPage]: currentPage
        }
        setFilter(newFilter)
        searchSolicitations(newFilter)
    }

    const handleSearchFilter = (newFilter: InternalSolicitationFilter) => {
        const updatedFilter = {
            ...filter,
            ...newFilter
        }
        setFilter(updatedFilter)
        searchSolicitations(updatedFilter)
    }
    
    return (
        <Stack spacing={3}>
            <InternalSolicitationsForm onSearch={handleSearchFilter} />
            <InternalSolicitationsTable solicitations={solicitations}
                                        loading={loading}
                                        onPaging={handleChangePage}
            />
        </Stack>
    )
}


export default InternalSolicitationsPage