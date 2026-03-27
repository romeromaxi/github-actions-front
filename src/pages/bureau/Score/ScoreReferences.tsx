import {Box, Grid, Stack } from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {BureauScoreRange} from "util/helpers/bureauHelper";

function ScoreReferences() {
    return (
        <Stack spacing={1}>
            <TypographyBase variant={'h6'} color={'text.lighter'}>
                Referencias
            </TypographyBase>

            <Grid container spacing={1}>
                {
                    BureauScoreRange.map((range, i) => (
                        <Grid item xs={12} sm={6} md={3}
                              key={`scoreReferencesRange_${i}`}
                        >
                            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                <Box borderRadius={'34px'}
                                     width={'1.125rem'}
                                     height={'1.125rem'}
                                     sx={{ backgroundColor: range.color.main }}
                                />

                                <TypographyBase variant={'body3'}
                                                color={'text.lighter'}
                                                fontWeight={600}
                                >
                                    {`De ${range.min} a ${range.max}`}
                                </TypographyBase>
                            </Stack>
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
    )
}

export default ScoreReferences;