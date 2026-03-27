import React, {useContext, useMemo} from "react";
import {Autocomplete, Card, CardContent, CardHeader, Stack, TextField} from "@mui/material";
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";
import {NosisQuery, NosisQueryFields} from "types/nosis/nosisData";
import {TypographyBase} from "components/misc/TypographyBase";
import { EntityWithIdAndDescriptionFields } from "types/baseEntities";

interface BureauSectionHeaderProps {
    title: string,
    subtitle?: string,
    action?: React.ReactNode,
    children?: React.ReactNode,
}

function BureauSectionHeader({ title, subtitle, action, children }: BureauSectionHeaderProps) {
    const {optionSelected, options, selectedQueryId, setSelectedQueryId, showSelectorHeader } = useContext(BureauInformationContext);

    const titleWithPerson = useMemo(() => {
        if (optionSelected && !optionSelected[NosisQueryFields.IsDefaultPerson]) {
            return (
                <TypographyBase variant={'inherit'} display={'ruby'}>
                    {`${title} de `}<TypographyBase variant={'inherit'} color={'primary'}>{optionSelected[NosisQueryFields.BusinessName]}</TypographyBase>
                </TypographyBase>
            );
        }

        return title
    }, [title, optionSelected])
    
    return (
        <Card>
            {
                showSelectorHeader && (
                    <Stack direction={'row'} 
                           justifyContent={'end'}
                           width={1}
                           mb={1}
                    >
                        <Autocomplete
                            value={options.find(
                                (option) => option.id === selectedQueryId,
                            )}
                            onChange={(
                                event: any,
                                newValue: NosisQuery | null,
                            ) => {
                                setSelectedQueryId(
                                    newValue?.[EntityWithIdAndDescriptionFields.Id] ||
                                    selectedQueryId || 0,
                                );
                            }}
                            id="controllable-states-demo"
                            options={options}
                            getOptionLabel={(option) =>
                                option[NosisQueryFields.BusinessName]
                            }
                            size={'small'}
                            renderInput={(params) => (
                                <Stack spacing={0.2}>
                                    <TypographyBase variant={'body4'} 
                                                    color={'text.lighter'}
                                                    textTransform={'uppercase'}
                                                    fontSize={'0.65rem'}
                                    >
                                        Seleccionar empresa o accionistas
                                    </TypographyBase>
                                    <TextField {...params}
                                               variant={'filled'}
                                               hiddenLabel
                                    />
                                </Stack>
                            )}
                            sx={{
                                width: '50%'
                            }}
                        />
                    </Stack>
                )
            }
            
            <CardHeader title={titleWithPerson}
                        subheader={subtitle}
                        action={action}
                        sx={{ gap: !!subtitle && !!action ? '20px' : 'auto' }}
            />

            {
                !!children &&
                    <CardContent>
                        {children}
                    </CardContent>
            }
        </Card>
    )
}

export default BureauSectionHeader;