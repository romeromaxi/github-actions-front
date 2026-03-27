import React, { Fragment, useMemo } from "react";
import { EntityListWithPagination, EntityListWithPaginationFields, EntityPaginationFields, EntityWithIdFields } from "types/baseEntities";
import { SolicitationViewDTO, SolicitationViewDTOFields } from "types/solicitations/solicitationData";
import { Pagination, Stack, Button } from "@mui/material";
import { Undo2Icon } from "lucide-react";
import OffererSolicitationCard from "./components/OffererSolicitationCard";
import OffererSolicitationCardSkeleton from "./components/OffererSolicitationCardSkeleton";
import OffererSolicitationGroup from "./components/OffererSolicitationGroup";
import { SolicitationClassificationStatusType } from "types/solicitations/solicitationEnums";
import EmptyStateBox, {EmptyStateBoxVariant} from "../../../components/misc/EmptyStateBox";

interface OffererSolicitationTableProps {
  loading: boolean,
  onPaging: (page: number) => void,
  solicitations?: EntityListWithPagination<SolicitationViewDTO>,
  offererId: number;
  hasFilter?: boolean;
  onClearFilter?: () => void;
}

const pendingSolicitationClassificationStatus: SolicitationClassificationStatusType[] = [
    SolicitationClassificationStatusType.UnderReview,
    SolicitationClassificationStatusType.ReceivedAssistedSearch,
    SolicitationClassificationStatusType.Pending,
]

const inProgressSolicitationClassificationStatus: SolicitationClassificationStatusType[] = [
    SolicitationClassificationStatusType.InProgress,
    SolicitationClassificationStatusType.AssistanceAssistedSearch,
]

interface GroupedSolicitations {
  pendingAdmission: SolicitationViewDTO[];
  inProgress: SolicitationViewDTO[];
  resolved: SolicitationViewDTO[];
}

function OffererSolicitationTable({ loading, solicitations, onPaging, hasFilter, onClearFilter }: OffererSolicitationTableProps) {
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    onPaging(page);
  };


  const groupedSolicitations = useMemo((): GroupedSolicitations => {
    const list = solicitations?.[EntityListWithPaginationFields.List] || [];
    
    return list.reduce(
      (acc, solicitation) => {
        const statusCode = solicitation[SolicitationViewDTOFields.OffererSolicitationClassificationStatusCode] as SolicitationClassificationStatusType;
        
        if (pendingSolicitationClassificationStatus.includes(statusCode)) {
          acc.pendingAdmission.push(solicitation);
        } else if (inProgressSolicitationClassificationStatus.includes(statusCode)) {
          acc.inProgress.push(solicitation);
        } else {
          acc.resolved.push(solicitation);
        }
        
        return acc;
      },
      { pendingAdmission: [], inProgress: [], resolved: [] } as GroupedSolicitations
    );
  }, [solicitations]);


  return (
    <Fragment>
      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 10 }).map((_, index) => (
            <OffererSolicitationCardSkeleton key={`offererSolicitationCardLoading_${index}`} />
          ))}
        </Stack>
      ) : solicitations?.[EntityListWithPaginationFields.List]?.length ? (
        <Fragment>
          <Stack spacing={2} sx={{ width: '100%', alignItems: { xs: 'stretch', md: 'flex-start' } }}>
            {hasFilter ? (
              solicitations[EntityListWithPaginationFields.List].map((solicitation) => (
                <OffererSolicitationCard
                  key={solicitation[EntityWithIdFields.Id]}
                  solicitation={solicitation}
                />
              ))
            ) : (
              <>
                <OffererSolicitationGroup title="Pendientes" items={groupedSolicitations.pendingAdmission} />
                <OffererSolicitationGroup title="Solicitudes en progreso" items={groupedSolicitations.inProgress} />
                <OffererSolicitationGroup title="Solicitudes resueltas" items={groupedSolicitations.resolved} />
              </>
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
        !loading && (
          <Stack alignItems="center" justifyContent="center" py={6}>
            {hasFilter ? (
                <EmptyStateBox srcCustom={'/images/search-empty.svg'}
                               text={'No hay resultados para tu búsqueda'}
                               ImageProps={{ sx: { maxWidth: 160 } }}
                >
                    <Button
                        onClick={onClearFilter}
                        variant="text"
                        size="medium"
                        startIcon={<Undo2Icon />}
                    >
                        Volver a ver todas
                    </Button>
                </EmptyStateBox>
            ) : (
                <EmptyStateBox variant={EmptyStateBoxVariant.Solicitations}
                               text={'Aún no recibiste ninguna solicitud'}
                               ImageProps={{ sx: { maxWidth: 160, opacity: 0.56 } }}
                />
            )}
          </Stack>
        )
      )}
    </Fragment>
  );
}

export default OffererSolicitationTable;