import {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {OffererFields, OffererSummaryView} from "types/offerer/offererData";
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import {Grid, Stack, ToggleButton, Typography} from "@mui/material";
import {ControlledAutocomplete} from "components/forms/ControlledAutocomplete";
import {HttpOffererRoles} from "http/index";
import {SolicitationAllowAccess, SolicitationAllowAccessFields} from "types/solicitations/solicitationData";
import CloseIcon from "@mui/icons-material/Close";

interface OffererShareSolicitationInvitationProps {
    offerer: OffererSummaryView;
}

const OffererShareSolicitationInvitation = ({offerer}: OffererShareSolicitationInvitationProps) => {
    const [mails, setMails] = useState<SolicitationAllowAccess[]>([]);
    const [selected, setSelected] = useState<boolean>(false);
    const { control, setValue } = useFormContext();

    useEffect(() => {
        if (selected) {
            HttpOffererRoles.getMailInvitations(offerer[EntityWithIdFields.Id]).then(response => {
                const shareMails = response.map(x => {
                    return {
                        [SolicitationAllowAccessFields.InvitedAccessMail]: x[EntityWithIdAndDescriptionFields.Description],
                        [SolicitationAllowAccessFields.InvitedAccessUserId]: x[EntityWithIdFields.Id],
                        [SolicitationAllowAccessFields.FinancialEntityId]: offerer[EntityWithIdFields.Id]
                    }
                });
                setMails(shareMails);
            });
        }
    }, [selected]);

    const handleChange = () => {
        if (selected) setValue(`${SolicitationAllowAccessFields.InvitedAccessMail}.${offerer[EntityWithIdFields.Id]}`, []);
        setSelected(!selected);
    }

    const renderSx = () => {
        if (selected) {
            return {
                borderColor: '#5d8cd8',
                backgroundColor: '#caddfa !important',
                borderRadius: '6px',
                textTransform: 'none',
            };
        }

        return {
            borderRadius: '6px',
            textTransform: 'none',
            color: 'black !important',
            backgroundColor: '#ededed',
        };
    };

    const onAddOption = (value: string, prevValues: any[]) => { };

    const loadMails = async () => mails;

    return (
        <Grid container spacing={2} alignItems={'center'}>
            <Grid item md={5}>
                <ToggleButton
                    value={offerer[EntityWithIdFields.Id]}
                    selected={selected}
                    onChange={handleChange}
                    sx={renderSx()}
                >
                    <Stack spacing={1} direction={'row'} alignItems={'center'}>
                        <Typography fontSize={13} fontWeight={selected ? 600 : 500}>
                            {offerer[OffererFields.BusinessName]}
                        </Typography>
                        {selected && <CloseIcon fontSize={'small'} color={'primary'} />}
                    </Stack>
                </ToggleButton>
            </Grid>
            <Grid item md={7}>
                {selected && (
                    <ControlledAutocomplete
                        label={'Seleccioná o ingresá los correos con los que quieras compartir la solicitud'}
                        control={control}
                        optionField={SolicitationAllowAccessFields.InvitedAccessMail}
                        name={`${SolicitationAllowAccessFields.InvitedAccessMail}.${offerer[EntityWithIdFields.Id]}`}
                        loadOptions={loadMails}
                        onAddOption={onAddOption}
                        multiple
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default OffererShareSolicitationInvitation;