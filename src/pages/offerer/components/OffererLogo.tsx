import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {Badge, Box, Stack, StackProps, SxProps} from '@mui/material';
import { Theme } from '@mui/material/styles';
import {
  FileBlobResponse,
  FileBlobResponseFields,
} from 'types/files/filesData';
import {ButtonIconFile} from "components/buttons/ButtonIconFile";
import {Skeleton} from "@mui/lab";
import {themeColorDefinition} from "util/themes/definitions";
import {TypographyBase, TypographyBaseProps} from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";
import {
    CompanyLogoById, CompanyLogoByIdProps, sizeMap as sizeCompanyMap, borderRadiusMap as borderRadiusCompanyMap
} from 'pages/company/components/CompanyLogo';

type SizeOffererLogo = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

const sizeMap: Record<string, string> = {
    xs: '16px',
    sm: '24px',
    md: '36px',
    lg: '48px',
    xl: '56px',
};

const borderRadiusMap: Record<string, string> = {
    xs: '271px',
    sm: '273px',
    md: '273px',
    lg: '273px',
    xl: '318.5px',
};

const boxShadowThicknessMap: Record<string, string> = {
    xs: '0.67px',
    sm: '1px',
    md: '1px',
    lg: '1px',
    xl: '1.17px',
};

interface OffererLogoProps {
  offererId?: number;
  offererUrlLogo?: string;
  size?: SizeOffererLogo;
  sx?: SxProps<Theme>;
  onSaveLogo?: (file: File) => void;
}

function OffererLogo({ offererId, offererUrlLogo, sx, size = 'lg', onSaveLogo }: OffererLogoProps) {
    const stylesBySize = useMemo(() => {
        if (typeof size === 'number') {
            return {
                size: `${size}px`,
                borderRadius: borderRadiusMap['md'],
                shadowThickness: boxShadowThicknessMap['md']
            }
        }
        
        return {
            size: sizeMap[size],
            borderRadius: borderRadiusMap[size],
            shadowThickness: boxShadowThicknessMap[size]
        }
    }, [size]);
    
    const [isLoadingLogo, setLoadingLogo] = useState<boolean>(true);
    const [offererLogo, setOffererLogo] = useState<string>(offererUrlLogo || '/images/companyFiles/noImage.jpg');
    
    const sxBox = {
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        //backgroundSize: 'cover',
        backgroundImage: `url(${offererLogo})`,
        backgroundSize: 'contain',
        zIndex: 1,
        height: `${stylesBySize.size} !important`,
        minHeight: `${stylesBySize.size} !important`,
        width: `${stylesBySize.size} !important`,
        minWidth: `${stylesBySize.size} !important`,
        borderRadius: stylesBySize.borderRadius,
        objectFit: 'cover',
        boxShadow: `0 0 0 ${stylesBySize.shadowThickness} ${themeColorDefinition.UIElements.borders.secondary}`,
        ...sx,
    };  
    
    const loadLogo = async () => {
        if (offererUrlLogo) {
            setOffererLogo(stringFormatter.normalizeUrl(offererUrlLogo));
            setLoadingLogo(false);
        } else if (offererId) {
            setLoadingLogo(true);
            try {
                const { HttpOffererLogo } = await import('http/offerer/httpOffererLogo');
                const blobResponse: FileBlobResponse = await HttpOffererLogo.getByOffererId(offererId);
                const image = blobResponse[FileBlobResponseFields.File];
                image.size && setOffererLogo(URL.createObjectURL(image));
            } finally {
                setLoadingLogo(false);
            }
        } else {
            setLoadingLogo(false);
        }
    };
    
    const handleSaveLogo = (file: File) => {
        const imageObjectURL = file.size
            ? URL.createObjectURL(file)
            : '/images/companyFiles/noImage.jpg';
        setOffererLogo(imageObjectURL);
        onSaveLogo && onSaveLogo(file);
    };

    const LogoComponent = () => (
        <Box component="div"
             alt="offererLogo"
             sx={sxBox}
             position={'relative'}
        />
    )
    
    useEffect(() => {
        loadLogo();
    }, [offererId, offererUrlLogo]);

    return !isLoadingLogo ? (
        <React.Fragment>
            {
                onSaveLogo ?
                    <Badge overlap={'circular'}
                           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                           sx={{ backgroundColor: 'transparent', width: 'fit-content' }}
                           badgeContent={<ButtonIconFile onChange={handleSaveLogo}
                                                         cropSize={{ width: 150, height: 150 }}
                                                         borderRadius={320}
                                                         shape={'round'}
                                                         inBadge />}
                    >
                        <LogoComponent />
                    </Badge>
                    :
                    <LogoComponent />
            }
        </React.Fragment>
    ) : (
        <Skeleton variant={'rounded'}
                  sx={{
                      width: `${stylesBySize.size} !important`,
                      minWidth: `${stylesBySize.size} !important`,
                      height: `${stylesBySize.size} !important`,
                      minHeight: `${stylesBySize.size} !important`,
                      borderRadius: stylesBySize.borderRadius,
                      ...sx
                  }}
        />
    );
}

interface OffererLogoWithNameProps extends OffererLogoProps {
    offererBusinessName?: string,
    withTooltip?: boolean
    header?: ReactNode,
    StackProps?: StackProps,
    NameProps?: TypographyBaseProps
}

export function OffererLogoWithName({ offererBusinessName, withTooltip, header, StackProps, NameProps, ...props }: OffererLogoWithNameProps) {
    return (
        <Stack direction={'row'} alignItems={'center'} gap={1} {...StackProps}>
            <OffererLogo { ...props } />
            <Stack>
                {header && header}
                {
                    offererBusinessName ?
                        <TypographyBase variant={'caption'}
                                        fontWeight={500}
                                        tooltip={withTooltip}
                                        {...NameProps}>
                            {offererBusinessName ?? ""}
                        </TypographyBase>
                        :
                        <Skeleton variant={'text'} width={'40%'} />
                }
            </Stack>
        </Stack>
    )
}

interface OffererLogoWithCompanyLogoProps {
    backgroundColor?: string,
    offererLogoProps: OffererLogoProps,
    companyLogoProps: CompanyLogoByIdProps
}

export function OffererLogoWithCompanyLogo({ backgroundColor = 'white', offererLogoProps, companyLogoProps }: OffererLogoWithCompanyLogoProps) {

    const stylesBySize = useMemo(() => {
        if (!companyLogoProps.size) {
            return {
                size: sizeCompanyMap['md'],
                borderRadius: borderRadiusCompanyMap['md'],
            }
        }
        
        if (typeof companyLogoProps.size === 'number') {
            return {
                size: `${companyLogoProps.size}px`,
                borderRadius: borderRadiusCompanyMap['md'],
            }
        }
        
        return {
            size: sizeCompanyMap[companyLogoProps.size],
            borderRadius: borderRadiusCompanyMap[companyLogoProps.size],
        }
    }, [companyLogoProps]);

    return (
        <Badge overlap={'rectangular'}
               anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
               sx={{ 
                   backgroundColor: backgroundColor, 
                   width: 'fit-content',
                   borderRadius: offererLogoProps.sx?.borderRadius,
                   '& > span': {
                       bottom: '5px',
                       right: '5px',
                       height: `${stylesBySize.size} !important`,
                       minWidth: `${stylesBySize.size} !important`,
                       width: `${stylesBySize.size} !important`,
                       borderRadius: `${stylesBySize.borderRadius} !important`
                   }
               }}
               badgeContent={<CompanyLogoById { ...companyLogoProps } />}
        >
            <OffererLogo { ...offererLogoProps } />
        </Badge>
    )
}

export default OffererLogo;
