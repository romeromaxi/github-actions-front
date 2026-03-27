import React from "react";
import {Box, Button, Card, CardContent, Skeleton, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import ScoreComponent from "./ScoreComponent";
import ScoreReferences from "./ScoreReferences";

interface ScoreCardProps {
    title?: string,
    description?: string,
    scoring?: number,
    onClick?: () => void,
    loading?: boolean,
    includeReferences?: boolean
}

function ScoreCard(props: ScoreCardProps) {
    return (
        <Card variant={'infoBureau'}>
            <CardContent>
                <Stack spacing={1}>
                    <Stack spacing={1}>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            {
                                (props.loading && !props.title) ?
                                    <Skeleton width={'30%'} />
                                    :
                                    <TypographyBase variant={'h5'}>
                                        { props.title || 'Score crediticio' }
                                    </TypographyBase>
                            }

                            {
                                props.onClick &&
                                    <Button variant={'text'}
                                            size={'small'}
                                            onClick={props.onClick}
                                            minPadding
                                    >
                                        Saber más
                                    </Button>
                            }
                        </Stack>

                        {
                            props.description &&
                                <TypographyBase variant={'body3'} color={'text.lighter'}>
                                    {props.description}
                                </TypographyBase>
                        }
                    </Stack>

                    <Box>
                        <ScoreComponent scoring={props.scoring || 0}
                                        loading={props.loading}
                        />
                    </Box>

                    {
                        props.includeReferences && 
                            <ScoreReferences />
                    }
                </Stack>
            </CardContent>
        </Card>
    )
}

export default ScoreCard;