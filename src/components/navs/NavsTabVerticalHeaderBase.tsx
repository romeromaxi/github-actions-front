import React from "react";
import {Box, Stack} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import {TypographyBase} from "components/misc/TypographyBase";

interface NavsTabVerticalHeaderBaseProps {
    title: string,
    Icon?: React.ElementType | string,
    description?: string,
    children?: React.ReactElement | React.ReactElement[]
}

function NavsTabVerticalHeaderBase(props: NavsTabVerticalHeaderBaseProps) {
    return (
        <Stack spacing={2}>
            <Stack direction={'row'} spacing={2}>
                {
                    props.Icon && 
                        <WrapperIcons Icon={props.Icon} size={'md'} color={'primary'} />
                }

                <TypographyBase variant={'h4'}>{props.title}</TypographyBase>
            </Stack>

            {
                props.description &&
                    <TypographyBase variant={'body2'} color={'text.lighter'}>
                        {props.description}
                    </TypographyBase>
            }

            {
                props.children &&
                    <Box>
                        {props.children}
                    </Box>
            }
        </Stack>
    )
}

export default NavsTabVerticalHeaderBase;