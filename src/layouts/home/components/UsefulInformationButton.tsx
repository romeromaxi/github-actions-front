import React, {startTransition, useMemo, useState} from "react";
import {WrapperIcons} from "components/icons/Icons";
import {BadgeQuestionMarkIcon, CaseLowerIcon, NewspaperIcon, BookOpenTextIcon} from "lucide-react";
import {Button, IconButton, ListItemIcon, Menu, MenuItem} from "@mui/material";
import {AppRoutesDefinitions, useAppNavigation} from "hooks/navigation";
import { AppBarButton } from "components/buttons/HomeButtons";

export enum UsefulInformationButtonVariant {
    TextButton,
    IconButton,
    MenuOnly
}

export enum UsefulInformationSectionActive {
    FAQLuc,
    BlogLuc,
    GlossaryLuc
}

interface UsefulInformationButtonProps {
    variant: UsefulInformationButtonVariant
    sectionActive?: UsefulInformationSectionActive
}

function UsefulInformationButton({ variant, sectionActive }: UsefulInformationButtonProps) {
    const { navigate } = useAppNavigation();
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const handleOpenToggleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(true)
    }

    const handleCloseToggle = () => {
        setAnchorEl(null);
        setOpenMenu(false)
    }
    
    const goToFAQLuc = () => {
        startTransition(() => {
            handleCloseToggle();
            navigate(AppRoutesDefinitions.LucFAQPage);
        });
    }

    const goToBlogLuc = () => {
        startTransition(() => {
            handleCloseToggle();
            navigate(AppRoutesDefinitions.LucBlogPage);
        });
    }

    const goToGlossaryLuc = () => {
        startTransition(() => {
            handleCloseToggle();
            navigate(AppRoutesDefinitions.LucFAQPage);
        });
    }
    
    const options = useMemo(() => {
        return [
            {
                Icon: BadgeQuestionMarkIcon,
                label: 'Preguntas Frecuentes',
                onClick: goToFAQLuc,
                isActive: sectionActive === UsefulInformationSectionActive.FAQLuc
            },
            {
                Icon: NewspaperIcon,
                label: 'Blog',
                onClick: goToBlogLuc,
                isActive: sectionActive === UsefulInformationSectionActive.BlogLuc
            },
            /*{
                Icon: CaseLowerIcon,
                label: 'Glosario',
                onClick: goToGlossaryLuc,
                isActive: sectionActive === UsefulInformationSectionActive.GlossaryLuc
            }*/
        ]
    }, [sectionActive])
    
    const buttonComponent = useMemo(() => {
        switch (variant) {
            case UsefulInformationButtonVariant.TextButton:
                return (
                    <AppBarButton options={options} 
                                  isActive={sectionActive !== undefined}
                    >
                        Información Útil
                    </AppBarButton>
                );
                
            case UsefulInformationButtonVariant.IconButton:
                return (
                    <IconButton size="medium"
                                color="secondary"
                                onClick={handleOpenToggleMenu}
                                variant={'text'}
                    >
                        <WrapperIcons Icon={BookOpenTextIcon} size={'md'} />
                    </IconButton>
                );

            case UsefulInformationButtonVariant.MenuOnly:
                return (
                    <React.Fragment>
                        {
                            options.map((option, index) => (
                                <Button variant={'appbar'}
                                        key={`usefulInformationButtonMenu_${option.label}_${index}`}
                                        startIcon={option.Icon ? <option.Icon /> : undefined}
                                        onClick={option.onClick}
                                        size={'small'}
                                >
                                    {option.label}
                                </Button>
                            ))
                        }
                    </React.Fragment>
                )

            default:
                return (
                    <React.Fragment />
                )
        }
    }, [options, variant, sectionActive])
    
    return (
        <React.Fragment>
            {buttonComponent}

            <Menu open={openMenu}
                  anchorEl={anchorEl}
                  onClose={handleCloseToggle}
                  transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                  sx={{
                      marginTop: 8
                  }}
            >
                {
                    options.map((oneOption, index) => (
                        <MenuItem key={`usefulInformationButtonMenu_${oneOption.label}_${index}`}
                                  variant={'bold'}
                                  onClick={oneOption.onClick}
                        >
                            {
                                oneOption.Icon &&
                                <ListItemIcon>
                                    <WrapperIcons Icon={oneOption.Icon} />
                                </ListItemIcon>
                            }

                            {oneOption.label}
                        </MenuItem>
                    ))
                }
            </Menu>
        </React.Fragment>
    )
}

export default UsefulInformationButton;