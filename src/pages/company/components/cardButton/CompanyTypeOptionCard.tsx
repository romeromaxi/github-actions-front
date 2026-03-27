import {Box, Button, Stack} from "@mui/material";
import clsx from 'clsx';
import {TypographyBase} from "components/misc/TypographyBase";
import CompanyTypeOptionCardStyles from "./CompanyTypeOptionCard.styles";
import {stringFormatter} from "../../../../util/formatters/stringFormatter";

interface CompanyTypeOptionCardBaseProps {
  onClick?: () => void,
  transparent?: boolean,
  userName?: string;
  userCuit?: string;
}

interface CompanyTypeOptionCardProps extends CompanyTypeOptionCardBaseProps {
  title: string,
  description?: string,
  srcIcon?: string,
  onClick?: () => void,
  buttonTxt?: string,
}

function CompanyTypeOptionCard(props: CompanyTypeOptionCardProps) {
  const classes = CompanyTypeOptionCardStyles();  
  
  return (
    <Box className={clsx(classes.root)}
         onClick={props.onClick}
    >
      <Stack justifyContent="space-between" alignItems="center" sx={{width: '100%', height: '100%'}}>
        <Stack spacing={2}
               alignItems={'center'}
               textAlign={'center'}>
  
          <Box component="img"
               src={props.srcIcon}
               width={'48px'}
               height={'48px'}
          />
          
          <Stack spacing={1}>
            <TypographyBase variant={'h5'}>
              {props.title}
            </TypographyBase>
            {
              props.description &&
              <TypographyBase variant={'subtitle1'}>
                {props.description}
              </TypographyBase>
            }
          </Stack>
        </Stack>
        <Button variant="contained" onClick={props.onClick} sx={{alignSelf: 'center'}} fullWidth>
          {props.buttonTxt || "Crear"}
        </Button>
      </Stack>
    </Box>
  )
}

function CompanySelfEmplyedOptionCard(props: CompanyTypeOptionCardBaseProps) {
  return (
    <CompanyTypeOptionCard title={props.userName ?? ''} 
                           description={stringFormatter.formatCuit(props.userCuit)}
                           srcIcon={"/images/homeCompanies/company-logo-default-physical.svg"}
                           buttonTxt={"Activar mi cuenta"}
                           {...props}
    />
  )
}

function CompanyJoinExistingOptionCard(props: CompanyTypeOptionCardBaseProps) {
  return (
    <CompanyTypeOptionCard title={"Creá o vinculate a otra cuenta PyME ya existente en LUC"}
                           srcIcon={"/images/homeCompanies/existing-company.svg"}
                           buttonTxt={"Vincularme a una PyME"}
                           {...props}
    />
  )
}

export {
  CompanySelfEmplyedOptionCard,
  CompanyJoinExistingOptionCard
};