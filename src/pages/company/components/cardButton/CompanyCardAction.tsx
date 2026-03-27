import React, {ReactElement, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {EntityWithIdFields} from 'types/baseEntities';
import {CompanyUserState,} from 'types/company/companyEnums';
import {CompanyFields, CompanyViewDTO, CompanyViewDTOFields,} from 'types/company/companyData';
import {Button, Card, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import {CompanyLogoById} from "../CompanyLogo";
import {TypographyBase} from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";
import {DialogAlertLUC} from "components/dialog/DialogAlertLUC";
import {PersonTypes, ValidationStatesType} from "types/person/personEnums";
import CompanyCardActionStyles from "./CompanyCardAction.styles";
import CompanyCardActionBody from "./CompanyCardActionBody";

interface CompanyCardActionProps {
  company: CompanyViewDTO;
  children?: ReactElement | undefined;
  showParentTooltip: boolean;
  setShowParentTooltip: (a: boolean) => void
}

function CompanyCardAction({ company, children, showParentTooltip, setShowParentTooltip }: CompanyCardActionProps) {
  const classes = CompanyCardActionStyles();
  
  const navigate = useNavigate();
  const [openFailRedirect, setOpenFailRedirect] = useState<boolean>(false)
  const temporaryAccess = company[CompanyViewDTOFields.AllowCompanyAccess] && !company[CompanyViewDTOFields.AllowFullAccess];
  const blocked =
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
      CompanyUserState.Blocked;
  const tempSuspended =
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
      CompanyUserState.WaitAssignmentDefinitiveRole;
  const handleToDetailCompany = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (company[CompanyViewDTOFields.AllowCompanyAccess]) {
        navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}?tab=summary`);
        /*if (company[CompanyViewDTOFields.AllowFullAccess])
        navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}?tab=summary`);
      else navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}?tab=sentSolicitations`);*/
    }
  };
  
  const handleParentMouseEnter = () => setShowParentTooltip(true);
  const handleParentMouseLeave = () => setShowParentTooltip(false);
  
  const onOpenFailRedirect = () => {
    setOpenFailRedirect(true)
  }
  
  const onCloseFailRedirect = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    setOpenFailRedirect(false)
  }
  
  const handleNavigateSolicitation = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}?tab=sentSolicitations&alert=true`)
  }

  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down('sm'));

  const onClickCompany =
    company[CompanyViewDTOFields.AllowCompanyAccess] ?  handleToDetailCompany  : onOpenFailRedirect;
  
  return (
    <React.Fragment>
      <Card id={"company-enter-stack-btn"}
            variant={'card-button'}
            className={classes.root}
            onClick={onClickCompany}
      >
        <Stack spacing={1.875}
               justifyContent={'space-between'}
               height={1}
        >
          <Stack spacing={2}>
              <Stack direction={{ xs: 'column-reverse', md: 'row' }}
                     justifyContent={'space-between'}
                     spacing={1}
              >
                  <Stack direction={'row'} spacing={1.875}>
                      <CompanyLogoById companyId={company[EntityWithIdFields.Id]}
                                       isPhysicalPerson={company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Physical}
                                       size={'lg'}
                      />
                  </Stack>

                  {
                      !!children &&
                      <Stack alignItems={{ xs: 'center', md: 'end' }}>
                          {children}
                      </Stack>
                  }
              </Stack>

              <Stack spacing={0.5}>
                  <TypographyBase variant={'h5'} tooltip maxLines={1}>
                      {stringFormatter.toTitleCase(company[CompanyFields.BusinessName])}
                  </TypographyBase>
                  <TypographyBase variant={'subtitle1'} fontWeight={400}>
                      {stringFormatter.formatCuit(company[CompanyFields.CUIT])}
                  </TypographyBase>
              </Stack>
          </Stack>  
           
          <Stack spacing={1}>              
              {/*<CompanyCardActionBody company={company} />*/}

              <Button id={"company-enter-stack-btn"}
                      color={'secondary'}
                      variant={'outlined'}
                      size={'small'}
                      onClick={onClickCompany}
                      fullWidth
              >
                  Ver mi PyME
              </Button>
          </Stack>  
        </Stack>
      </Card>

      {
        openFailRedirect &&
          <DialogAlertLUC open={openFailRedirect}
                          title={'No tenés acceso a esta MiPyME'}
                          onClose={onCloseFailRedirect}
          >
              <Typography color={'text.lighter'} variant={'caption'}>
                  No podés acceder a la cuenta MiPyME dado que te encontrás pendiente de validación
              </Typography>
          </DialogAlertLUC>
      }
    </React.Fragment>
  );
}

export default CompanyCardAction;