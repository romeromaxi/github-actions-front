import React from "react";
import {Box} from "@mui/material";
import TrafficBarCurrentValue from "./TrafficBarCurrentValue";
import {TypographyBase} from "components/misc/TypographyBase";
import {themeColorDefinition} from "util/themes/definitions";
import {Skeleton} from "@mui/lab";

export interface TrafficBarRange {
    min: number,
    max: number,
    color: string
}

interface TrafficBarProps {
    value: number,
    ranges: TrafficBarRange[],
    marks?: number[],
    loading?: boolean
}

function TrafficBar({ value, ranges, marks, loading }: TrafficBarProps) {
    const minRangeValue = Math.min(...ranges.map(range => range.min));
    const maxRangeValue = Math.max(...ranges.map(range => range.max));
    const valueBetweenRange = Math.min(Math.max(value, minRangeValue), maxRangeValue); 
    const valueToPercent = (valueToPercent: number) =>
        ((valueToPercent - minRangeValue) / (maxRangeValue - minRangeValue)) * 100;
    
    const colorValue = 
        ranges.find(x => x.min <= value && value <= x.max)?.color 
        || themeColorDefinition.UIElements.texts.main;
    const valuePercent = valueToPercent(value)

    const marksToShow: number[] = !!marks && !!marks.length ?
        marks :
        [
            Math.min(...ranges.map(r => r.min)),
            ...ranges.map(r => r.max),
        ]
    
    if (loading) 
        return (
            <Box width={'95% !important'}
                 mt={'64px !important'}
                 alignSelf={'center'}>
                <Skeleton width={'95%'} />
            </Box>
        )
    
    return (
        <Box width={'95% !important'}
             mt={'64px !important'}
             alignSelf={'center'}
        >
            <TrafficBarCurrentValue color={colorValue}
                                    value={valueBetweenRange}
                                    valueAsPercent={valuePercent}
            />
            
            <Box position={'relative'}
                 height={'16px'}
                 borderRadius={'84px'}
            >
                <Box display={'flex'}
                     height={'100%'}>
                    {
                        ranges.map((range, index) => {
                            const width = 
                                ((range.max - range.min + 1) / (maxRangeValue - minRangeValue + 1)) * 100;
                            
                            return (
                                <Box key={`trafficBarProgressRange_${index}`} 
                                     width={`${width}%`}
                                     sx={{ backgroundColor: range.color }}
                                />
                            );
                        })
                    }
                </Box>

                {
                    marksToShow.map((mark) => {
                        const left = valueToPercent(mark);
    
                        return (
                            <Box key={`trafficBarProgressDotMark_${mark}`} 
                                 position={'absolute'}
                                 boxShadow={`0 0 0 3px #FFFFFF`}
                                 left={`${left}%`}
                                 top={'50%'}
                                 width={17}
                                 height={17}
                                 borderRadius={'50%'}
                                 zIndex={2} 
                                 sx={{
                                     backgroundColor: themeColorDefinition.UIElements.texts.main,
                                     transform: "translate(-50%, -50%)",
                                 }}
                            />
                        );
                    })
                }
            </Box>

            <Box position={'relative'}
                 height={20}
                 mt={1}
            >
                {
                    marksToShow.map(mark => {
                        const left = valueToPercent(mark);
                        
                        return (
                            <TypographyBase key={`trafficBarProgressTextMark_${mark}`}
                                            variant={'body3'}
                                            fontWeight={600}
                                            position={'absolute'}
                                            color={'#5B6560'}
                                            sx={{ left: `${left}%`, transform: "translateX(-50%)"}}
                            >
                                {mark}
                            </TypographyBase>
                        )
                    })
                }
            </Box>
        </Box>
    )
}

export default TrafficBar;