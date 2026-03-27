import {Fragment} from "react";
import {EntityListWithPagination, EntityListWithPaginationFields, EntityPaginationFields, EntityWithIdFields} from "types/baseEntities";
import {SolicitationViewDTO} from "types/solicitations/solicitationData";
import {Pagination, Stack,} from "@mui/material";
import UserSolicitationsNotFound from "./UserSolicitationsNotFound";
import SolicitationCard from "./SolicitationCard";
import SolicitationCardSkeleton from "./cards/SolicitationCardSkeleton";

interface UserSolicitationsTableProps {
    solicitations?: EntityListWithPagination<SolicitationViewDTO>,
    loading: boolean,
    onPaging: (page: number) => void,
    hideCompanyInfo?: boolean,
    withAlert?: boolean;
    selectedIds: number[];
    selectedCompanyId?: number;
    onToggleSelection: (id: number, companyId: number) => void;
    onlyActiveStates?: boolean;
    comboSelectedCompany?: boolean;
}

const UserSolicitationsTable = ({
    solicitations,
    loading,
    onPaging,
    hideCompanyInfo,
    withAlert,
    selectedIds,
    selectedCompanyId,
    onToggleSelection,
    onlyActiveStates,
    comboSelectedCompany
} : UserSolicitationsTableProps) => {
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        onPaging(page);
    };

    return (
        <Fragment>
            {loading ? (
                <Stack spacing={2}>
                    {Array.from({length: 10}).map((_, index) => (
                        <SolicitationCardSkeleton key={`solicitationCardUserTableLoading_${index}`}
                                                  hideCompanyInfo={hideCompanyInfo}
                        />
                    ))}
                </Stack>
            ) : solicitations?.[EntityListWithPaginationFields.List] && solicitations[EntityListWithPaginationFields.List].length > 0 ? (
                <Fragment>
                    <Stack spacing={2} sx={{ width: '100%', alignItems: { xs: 'stretch', md: 'flex-start' } }}>
                        {solicitations[EntityListWithPaginationFields.List].map((solicitation) => 
                            <SolicitationCard key={solicitation[EntityWithIdFields.Id]} 
                                              solicitation={solicitation} 
                                              hideCompanyInfo={!!hideCompanyInfo}
                                              selectedIds={selectedIds}
                                              selectedCompanyId={selectedCompanyId}
                                              onToggleSelection={onToggleSelection}
                                              onReloadSolicitations={() => onPaging(1)}
                            />
                        )}
                    </Stack>

                    {solicitations[EntityListWithPaginationFields.Pagination]?.[EntityPaginationFields.CantPages] > 1 && (
                        <Stack direction="row" justifyContent="center" mt={3}>
                            <Pagination
                                count={solicitations[EntityListWithPaginationFields.Pagination][EntityPaginationFields.CantPages]}
                                page={solicitations[EntityListWithPaginationFields.Pagination][EntityPaginationFields.ActualPage]}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />
                        </Stack>
                    )}
                </Fragment>
            ) : (
                <UserSolicitationsNotFound companySelected={comboSelectedCompany}
                                           onlyActiveStates={onlyActiveStates}
                                           withAlert={withAlert}
                />
            )}
        </Fragment>
    )
}


export default UserSolicitationsTable