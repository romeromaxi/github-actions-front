import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {Stack, Button} from '@mui/material';
import {TypographyBase} from 'components/misc/TypographyBase';
import {OffererContext} from '../../components/OffererContextProvider';
import {HttpSolicitation} from 'http/index';
import {
    EntityListWithPagination,
    EntityListWithPaginationFields,
    EntityWithIdFields
} from 'types/baseEntities';
import {SolicitationFilterFields, SolicitationViewDTO} from 'types/solicitations/solicitationData';
import {useNavigate} from 'react-router-dom';
import OffererSolicitationCard from '../../solicitation/components/OffererSolicitationCard';
import OffererSolicitationCardSkeleton from '../../solicitation/components/OffererSolicitationCardSkeleton';
import EmptyStateBox, {EmptyStateBoxVariant} from 'components/misc/EmptyStateBox';
import {SolicitationStatusType} from 'types/solicitations/solicitationEnums';

function HomeSolicitationsReview() {
    const offerer = useContext(OffererContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [solicitations, setSolicitations] = useState<SolicitationViewDTO[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);

    useEffect(() => {
        if (offerer && !!offerer[EntityWithIdFields.Id]) {
            setLoading(true);
            HttpSolicitation.getByOffererId(offerer[EntityWithIdFields.Id], {
                [SolicitationFilterFields.SolicitationFilterCode]: 7,
                [SolicitationFilterFields.SolicitationFilterContent]: [
                    SolicitationStatusType.GeneralOffererSolicitationIncoming,
                    SolicitationStatusType.GeneralOffererAdmission,
                    SolicitationStatusType.GeneralOffererAdmissionApproval,
                    SolicitationStatusType.AssistedSearchOffererSolicitationIncoming,
                    SolicitationStatusType.SolicitationReceptionOrienteer,
                    SolicitationStatusType.BetweenOfferersReception,
                ],
                [SolicitationFilterFields.PageSize]: 6,
                [SolicitationFilterFields.CurrentPage]: 1
            })
                .then((res: EntityListWithPagination<SolicitationViewDTO>) => {
                    const list = res[EntityListWithPaginationFields.List] || [];
                    setHasMore(list.length > 5);
                    setSolicitations(list.slice(0, 5));
                })
                .finally(() => setLoading(false));
        }
    }, [offerer]);
    
    return (
        <Stack spacing={2} width="100%">
            <Stack direction={{ xs: 'column', md: 'row' }} 
                   justifyContent="space-between"
                   alignItems={{ xs: 'flex-start', md: 'baseline' }}
                   spacing={{ xs: 2, md: 0 }}
            >
                <TypographyBase variant="h4">
                    Solicitudes a revisar
                </TypographyBase>
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate('/offerer/solicitations')}
                    minPadding
                >
                    {hasMore ? 'Ver todas' : 'Ir a Solicitudes'}
                </Button>
            </Stack>

            <Stack spacing={2} sx={{width: '100%', minWidth: 0, alignItems: 'stretch'}}>
                {
                    (loading || !solicitations) ? (
                        Array.from(new Array(3)).map((_, i) => <OffererSolicitationCardSkeleton key={i}/>)
                    ) :
                        !!solicitations.length ?
                            solicitations.map(solicitation => (
                                <OffererSolicitationCard key={solicitation[EntityWithIdFields.Id]} 
                                                         solicitation={solicitation}
                                />
                            ))
                            :
                            <Stack alignItems="center" justifyContent="center" py={{xs: 2, md: 3}}>
                                <EmptyStateBox variant={EmptyStateBoxVariant.Solicitations}
                                               text={'Aún no tenés solicitudes pendientes a revisar'}
                                               ImageProps={{sx: {maxWidth: 100, opacity: 0.56}}}
                                />
                            </Stack>
                }
            </Stack>
        </Stack>
    );
}

export default HomeSolicitationsReview;
