import {
    SolicitationAccessView,
    SolicitationAccessViewFields
} from "../../../../../types/solicitations/solicitationData";
import {Chip, Divider, Stack, Typography} from "@mui/material";
import {EntityWithIdFields} from "../../../../../types/baseEntities";
import {DataWithLabel} from "../../../../../components/misc/DataWithLabel";
import {dateFormatter} from "../../../../../util/formatters/dateFormatter";
import {SolicitationAccessStateTypeCodes} from "../../../../../types/solicitations/solicitationEnums";


interface OffererSolicitationExternalAccessCollapsibleContentProps {
    items: SolicitationAccessView[]
}


const OffererSolicitationExternalAccessCollapsibleContent = ({items} : OffererSolicitationExternalAccessCollapsibleContentProps) => {
    
    const getChipState = (s: SolicitationAccessView) => 
        s[SolicitationAccessViewFields.HasDefinedResult] ?
            s[SolicitationAccessViewFields.SolicitationAccessStateCode] === SolicitationAccessStateTypeCodes.Interested ?
                <Chip color={'success'} label={s[SolicitationAccessViewFields.SolicitationAccessStateDesc]} />
                :
                <Chip color={'error'} label={s[SolicitationAccessViewFields.SolicitationAccessStateDesc]} />
            :
            <Chip color='warning' label={s[SolicitationAccessViewFields.SolicitationAccessStateDesc]} />
    
    return (
        <Stack mt={2} spacing={2}>
            <Typography fontSize={15} fontWeight={600} fontStyle={'italic'}>Accesos realizados</Typography>
            {
                items.map((i) =>
                    <Stack spacing={1} key={`itemSolicitudExterna_${i[EntityWithIdFields.Id]}`}>
                        <Stack direction='row' alignItems={'center'} justifyContent={'space-between'}>
                            <DataWithLabel label={'Fecha de envío'} data={dateFormatter.toShortDate(i[SolicitationAccessViewFields.DateSent])}
                                           rowDirection
                            />
                            {getChipState(i)}
                        </Stack>
                        <Stack direction='row' alignItems={'center'} justifyContent={'space-between'}>
                            <DataWithLabel label={'Fecha de últ. acceso'}
                                           data={dateFormatter.toShortDate(i[SolicitationAccessViewFields.DateLastSolicitationAccessState])}
                                           rowDirection
                            />
                            <DataWithLabel label={'Mail de invitado'} data={i[SolicitationAccessViewFields.MailInvitationAccess]} rowDirection />
                        </Stack>
                        <DataWithLabel label={'Observaciones'}
                                       data={i[SolicitationAccessViewFields.ObservationsAccessState] ?? '-'}
                                       fullWidth={!!i[SolicitationAccessViewFields.ObservationsAccessState]} rowDirection
                        />
                        <Divider />
                    </Stack>
                )
                
            }
        </Stack>
    )
}


export default OffererSolicitationExternalAccessCollapsibleContent