import {Box, Stack} from "@mui/material";
import React from "react";
import {WrapperIcons} from "../icons/Icons";
import { themeColorDefinition } from "util/themes/definitions";
import {PlusIcon} from "lucide-react";
import {TypographyBase} from "./TypographyBase";


interface BoxListNewEntityProps {
    title: string;
    subtitle?: string;
    onClickNew: () => void;
    disabled?: boolean;
}

const BoxListNewEntity = ({
                          title,
                          subtitle,
                          onClickNew,
                          disabled
                      }: BoxListNewEntityProps) => {
    return (
        <Box p={'10px 16px'}
             borderRadius={'14px'}
            sx={{
                backgroundColor: 'white',
                boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}`,
                '&:hover': {
                    cursor: disabled ? 'not-allowed' : 'pointer',
                }
            }}
             onClick={!disabled ? onClickNew : undefined}
        >
            <Stack direction={'row'} 
                   alignItems={'center'}
                   spacing={1}
            >
                <WrapperIcons Icon={PlusIcon} size={'md'} color={'primary'} />
                
                <Stack>
                    <TypographyBase variant={'eyebrow1'} color={'primary'}>
                        {title}
                    </TypographyBase>

                    {
                        !!subtitle &&
                            <TypographyBase variant={'body4'} color={'text.lighter'} fontStyle={'italic'}>
                                {subtitle}
                            </TypographyBase>
                    }
                </Stack>
            </Stack>
        </Box>
    );
};

export default BoxListNewEntity;
