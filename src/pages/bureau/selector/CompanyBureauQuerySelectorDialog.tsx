import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent, Divider,
    FormControlLabel,
    Link,
    Radio,
    RadioGroup,
    Stack
} from "@mui/material";
import {CompanyLogo} from "pages/company/components/CompanyLogo";
import {NosisQuery, NosisQueryFields} from "types/nosis/nosisData";
import {PersonTypes} from "types/person/personEnums";
import {TypographyBase} from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";
import {EntityWithIdFields} from "types/baseEntities";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {useAppNavigation} from "hooks/navigation";
import {PymeRoute} from "routes/pyme/routeAppPymeData";

interface CompanyBureauQuerySelectorDialogProps {
    open: boolean,
    options: NosisQuery[],
    onClose: () => void,
    onSubmit: (nosisQueryId: number) => void,
    companyId?: number,
    defaultValue?: number
}

function CompanyBureauQuerySelectorDialog(props: CompanyBureauQuerySelectorDialogProps) {
    const { navigate } = useAppNavigation();
    const [nosisQueryIdSelected, setNosisQueryIdSelected] = useState<number>(props.defaultValue || 0);
    
    const handleCloseDialog = () => {
        props.onClose();
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setNosisQueryIdSelected(parseInt(event.target.value || '0'));
    
    const handleSubmit = () => {
        if (!!nosisQueryIdSelected)
            props.onSubmit(nosisQueryIdSelected)
    }

    const handleGoToRelatedPerson = () => {
        if (props.companyId)
            navigate(
                PymeRoute.PymeCompanyRelatedPersonList,
                { companyId: props.companyId },
                undefined,
                { replace: true }
            )
    }
    
    useEffect(() => {
        if (props.open && !!props.defaultValue)
            setNosisQueryIdSelected(props.defaultValue)
    }, [props.open, props.defaultValue]);
    
    return (
        <Dialog open={props.open}
                onClose={handleCloseDialog}
                maxWidth={'sm'}
                fullWidth
        >            
            <BaseDialogTitle title={'Ver información de Personas Relacionadas'}
                             subtitle={
                                <React.Fragment>
                                    Esta PyME tiene personas relacionadas. Podes gestionarlas desde <Link onClick={handleGoToRelatedPerson}>Personas Relacionadas</Link> dentro de los Datos de esta PyME
                                </React.Fragment>
                             }
                             onClose={handleCloseDialog}
            />
            
            <DialogContent>
                <Stack spacing={3}>
                    <RadioGroup value={nosisQueryIdSelected} 
                                onChange={handleChange}
                                style={{ gap: '24px' }}
                    >
                        {
                            props.options.map((nosisQuery, index) => (
                                <React.Fragment>
                                    <FormControlLabel key={`companyBureauQuerySelectorOption_${nosisQuery[EntityWithIdFields.Id]}`}
                                                      value={nosisQuery[EntityWithIdFields.Id]}
                                                      control={<Radio />}
                                                      label={
                                                          <Stack direction={'row'}
                                                                 spacing={1.25}
                                                                 alignItems={'center'}
                                                          >
                                                              <CompanyLogo size={'lg'}
                                                                           loading={false}
                                                                           isPhysicalPerson={nosisQuery[NosisQueryFields.PersonTypeCode] === PersonTypes.Physical}
                                                              />

                                                              <Stack spacing={0.375}>
                                                                  <TypographyBase variant={'button1'}>
                                                                      {nosisQuery[NosisQueryFields.BusinessName]}
                                                                  </TypographyBase>
                                                                  <TypographyBase variant={'body3'} color={'text.lighter'}>
                                                                      {stringFormatter.formatCuit(nosisQuery[NosisQueryFields.CUIT])}
                                                                  </TypographyBase>
                                                              </Stack>
                                                          </Stack>
                                                      }
                                    />

                                    {
                                        index === 0 && (
                                            <Divider />
                                        )
                                    }
                                    
                                </React.Fragment>
                            ))
                        }
                    </RadioGroup>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button variant={'contained'}
                        color={'primary'}
                        size={'medium'}
                        onClick={handleSubmit}
                        fullWidth
                >
                    Cambiar visualización
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CompanyBureauQuerySelectorDialog;