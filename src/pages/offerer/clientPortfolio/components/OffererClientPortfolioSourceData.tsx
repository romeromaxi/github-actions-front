import React from "react";
import {Stack} from "@mui/material";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { WrapperIcons } from "components/icons/Icons";
import {TypographyBase} from "components/misc/TypographyBase";
import {dateFormatter} from "util/formatters/dateFormatter";


interface OffererClientPortfolioSourceDataProps {
    source: string | undefined,
    dateUptade?: Date,
    onUpdating?: () => void,
    justifyContent?: 'flex-end' | 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
}

function OffererClientPortfolioSourceData(props: OffererClientPortfolioSourceDataProps) {
    return (
        <TypographyBase variant={'caption'} color={'text.lighter'} alignSelf={'end'}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={props.justifyContent} spacing={1}>
                <div>{props.source || ''}</div>
                
                {
                    props.dateUptade &&
                        <React.Fragment>
                            <div>/</div>
                            <div>{dateFormatter.toShortDate(props.dateUptade)}</div>
                        </React.Fragment>
                }

                {
                    props.onUpdating &&
                    <React.Fragment>
                        <div>/</div>
                        <WrapperIcons Icon={ArrowsClockwise}
                                      size={'sm'}
                        />
                    </React.Fragment>
                }
            </Stack>
        </TypographyBase>
    )
}

export default OffererClientPortfolioSourceData;