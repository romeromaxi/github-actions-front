import React, {useMemo} from "react";
import {Card, Stack} from "@mui/material";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {
    SolicitationOffererResultViewFields
} from "types/solicitations/solicitationData";
import {TextFieldBase} from "components/forms/TextFieldBase";
import {TypographyBase} from "components/misc/TypographyBase";
import {dateFormatter} from "util/formatters/dateFormatter";
import {WrapperIcons} from "components/icons/Icons";
import {BanIcon, MailIcon} from "lucide-react";

function OffererSolicitationResultMinimal() {
    const {solicitation, loadingSolicitation, offererResult} = useSolicitation();

    const resultColor = useMemo(() => {
        if (!offererResult) return '';

        return offererResult[SolicitationOffererResultViewFields.IsPositiveResult] ? '#26825A' : '#720800';
    }, [offererResult]);

    if (!solicitation || loadingSolicitation || !offererResult)
        return null;

    return (
        <Card sx={{ padding: '16px', border: `1px solid ${resultColor}`}}>
            <Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }}
                       justifyContent={'space-between'}
                       alignItems={'center'}
                >
                    <Stack direction={'row'} 
                           alignItems={'center'}
                           spacing={1.25}
                    >
                        <WrapperIcons Icon={offererResult[SolicitationOffererResultViewFields.IsPositiveResult] ? MailIcon : BanIcon} 
                                      color={resultColor} 
                                      size={'md'}
                        />

                        <TypographyBase variant={'button2'}>
                            {offererResult[SolicitationOffererResultViewFields.ResultMessage]}
                        </TypographyBase>
                    </Stack>

                    <TypographyBase variant={'body3'} color={'text.lighter'}>
                        {dateFormatter.toShortDate(offererResult[SolicitationOffererResultViewFields.ResultDate])}
                    </TypographyBase>
                </Stack>
            </Stack>
            
            {
                !!offererResult[SolicitationOffererResultViewFields.MessageCompany] &&
                    <TextFieldBase
                        value={offererResult[SolicitationOffererResultViewFields.MessageCompany]}
                        disabled
                    />
            }
        </Card>
    )
}

export default OffererSolicitationResultMinimal;