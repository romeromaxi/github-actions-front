import {
    EntityListWithPagination,
    EntityListWithPaginationFields,
    EntityPaginationFields,
    EntityWithIdFields
} from "../../../types/baseEntities";
import {
    OffererClientPortfolioView,
    OffererClientPortfolioFilter,
} from "../../../types/offerer/clientPortfolioData";
import {Stack, Box, CircularProgress, Pagination} from "@mui/material";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import OffererClientPortfolioCard from "./components/OffererClientPortfolioCard";

interface OffererClientPortfolioTableProps {
    loading: boolean,
    onPaging: (page: number) => void,
    prospects?: EntityListWithPagination<OffererClientPortfolioView>,
    onRefreshFolders: (filter: OffererClientPortfolioFilter) => void,
    currentFilter: OffererClientPortfolioFilter,
    onSearch: (filter: OffererClientPortfolioFilter) => void,
    activeBatchIds: string[],
    justCompletedRows: Set<string>
}

const OffererClientPortfolioTable = ({
    loading, 
    onPaging, 
    prospects,
    activeBatchIds, justCompletedRows
} : OffererClientPortfolioTableProps) => {
    const portfolioList = prospects?.[EntityListWithPaginationFields.List] || [];
    const totalElements = prospects?.[EntityListWithPaginationFields.Pagination][EntityPaginationFields.CantRecords] || 0;
    const pageSize = prospects?.[EntityListWithPaginationFields.Pagination][EntityPaginationFields.PageSize] || 10;
    const totalPages = Math.ceil(totalElements / pageSize);
    const currentPage = prospects?.[EntityListWithPaginationFields.Pagination][EntityPaginationFields.ActualPage] || 1;

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        onPaging(page);
    };
    
    return (
        <>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : portfolioList.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <TypographyBase variant="body1" color="text.lighter">
                        No hay registros disponibles
                    </TypographyBase>
                </Box>
            ) : (
                        <Stack spacing={2}>
                            {portfolioList.map((portfolio) => {
                                return (
                                    <OffererClientPortfolioCard 
                                        key={portfolio[EntityWithIdFields.Id]} 
                                        portfolio={portfolio}
                                    />
                                );
                            })}
                        </Stack>
            )}

            {!loading && portfolioList.length > 0 && totalPages > 1 && (
                <Box display="flex" justifyContent="center" sx={{mt: 3}}>
                    <Pagination 
                        count={totalPages} 
                        page={currentPage} 
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </>
    )
}

export default OffererClientPortfolioTable;