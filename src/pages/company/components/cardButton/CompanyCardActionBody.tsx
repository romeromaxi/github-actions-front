import React, {useMemo} from "react";
import {Grid, Stack, TypographyProps} from "@mui/material";
import {CompanyViewDTO, CompanyViewDTOFields} from "types/company/companyData";
import {WrapperIcons} from "components/icons/Icons";
import {TypographyBase} from "components/misc/TypographyBase";
import {UserFocusIcon} from "@phosphor-icons/react"
import { ClipboardIcon, ClockFadingIcon, SendIcon } from "lucide-react";

interface CompanyCardActionBodyProps {
    company: CompanyViewDTO;
}

function CompanyCardActionBody(props: CompanyCardActionBodyProps) {
    const isFileCompleted = useMemo(() =>
        props.company[CompanyViewDTOFields.HasCompleteCompanyFileData], [props.company]);

    const solicitationToSend = useMemo(() => 
        !!props.company[CompanyViewDTOFields.SolicitationsReadyToSend] ?
            props.company[CompanyViewDTOFields.SolicitationsReadyToSend]?.toString() : "Sin"
        , [props.company]);
    
    const solicitationInProgess = useMemo(() =>
            !!props.company[CompanyViewDTOFields.SolicitationsInProgress] ?
                props.company[CompanyViewDTOFields.SolicitationsInProgress]?.toString() : "Sin"
        , [props.company]);
    
    return (
        <Grid container spacing={2} paddingY={1} sx={{ marginLeft: '-16px !important', marginTop: '-16px !important' }}>
            <Grid item xs={12} md={6}>
                <CompanyCardActionBodyTypography Icon={UserFocusIcon}>
                    {props.company[CompanyViewDTOFields.UserCompanyRelationshipTypeDesc]}
                </CompanyCardActionBodyTypography>
            </Grid>
            <Grid item xs={12} md={6}>
                {/*<CompanyCardActionBodyTypography Icon={ClipboardIcon}
                                                 color={isFileCompleted ? 'success' : 'warning'}
                >
                    {`Legajo ${isFileCompleted ? "completo" : "pendiente"}`}
                </CompanyCardActionBodyTypography>*/}
            </Grid>
            <Grid item xs={12} md={6}>
                <CompanyCardActionBodyTypography Icon={ClockFadingIcon}>
                    {`${solicitationInProgess} Solicitudes en curso`}
                </CompanyCardActionBodyTypography>
            </Grid>
            {
                !!props.company[CompanyViewDTOFields.SolicitationsReadyToSend] &&
                    <Grid item xs={12} md={6}>
                        <CompanyCardActionBodyTypography Icon={SendIcon}>
                            {`${solicitationToSend} Solicitudes para enviar`}
                        </CompanyCardActionBodyTypography>
                    </Grid>
            }
        </Grid>
    )
}

interface CompanyCardActionBodyTypographyProps extends TypographyProps {
    Icon: React.ElementType
}

function CompanyCardActionBodyTypography({ Icon, color, ...props}: CompanyCardActionBodyTypographyProps) {
    const typographyColor = useMemo(() => {
        if (!color) return 'text.main';
        
        return `${color}.main`
    }, [color]);
    
    return (
        <Stack direction={'row'} 
               spacing={0.5}
        >
            <WrapperIcons Icon={Icon} 
                          size={'sm'}
                          color={color}
                          style={{ marginTop: '1px' }}
            />

            <TypographyBase {...props} 
                            variant={'body3'}
                            color={typographyColor}
            />
        </Stack>
    )
}

export default CompanyCardActionBody;