import React, {useEffect, useMemo, useState} from 'react';
import { Theme } from '@mui/material/styles';
import { Skeleton } from "@mui/lab";
import { Badge, Box, SxProps } from '@mui/material';
import { ButtonIconFile } from 'components/buttons/ButtonIconFile';
import {HttpCompany} from "../../../http";
import {FileBlobResponse, FileBlobResponseFields} from "../../../types/files/filesData";

export type SizeCompanyLogo = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export const sizeMap: Record<string, string> = {
    xs: '16px',
    sm: '24px',
    md: '36px',
    lg: '48px',
    xl: '56px',
};

export const borderRadiusMap: Record<string, string> = {
    xs: '3px',
    sm: '5px',
    md: '8px',
    lg: '8px',
    xl: '9.33px',
};

interface CompanyLogoProps {
    companyLogo?: any;
    loading: boolean;
    size?: SizeCompanyLogo;
    onSaveLogo?: (file: File) => void;
    sx?: SxProps<Theme> | undefined;
    isPhysicalPerson?: boolean;
}

function CompanyLogo({
    loading,
    companyLogo,
    sx,
    onSaveLogo,
    size = 'lg',
    isPhysicalPerson
}: CompanyLogoProps) {
    const defaultLogo = useMemo(() => (
        isPhysicalPerson ? '/images/homeCompanies/company-logo-default-physical.svg' : '/images/homeCompanies/company-logo-default-legal.svg'
    ), [isPhysicalPerson]);

    const stylesBySize = useMemo(() => {
        if (typeof size === 'number') {
            return {
                size: `${size}px`,
                borderRadius: borderRadiusMap['md'],
            }
        }

        return {
            size: sizeMap[size],
            borderRadius: borderRadiusMap[size],
        }
    }, [size]);    
    
    const sizeLogo = sizeMap[size];
    const borderRadiusLogo = borderRadiusMap[size];
    
    const sxBox = {
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        //backgroundSize: 'cover',
        backgroundImage: `url(${companyLogo || defaultLogo})`,
        backgroundSize: 'contain',
        zIndex: 1,
        height: `${stylesBySize.size} !important`,
        minHeight: `${stylesBySize.size} !important`,
        width: `${stylesBySize.size} !important`,
        minWidth: `${stylesBySize.size} !important`,
        borderRadius: stylesBySize.borderRadius, 
        objectFit: 'cover',
        ...sx,
    };
  
  const LogoComponent = () => (
      <Box component="div"
           alt="companyLogo"
           sx={sxBox}
           position={'relative'}
      />
  )
    
  return !loading ? (
    <React.Fragment>
        {
            onSaveLogo ?
                <Badge overlap={'circular'}
                       anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                       sx={{ backgroundColor: 'transparent' }}
                       badgeContent={<ButtonIconFile onChange={onSaveLogo}
                                                     cropSize={{ width: 150, height: 150 }}
                                                     borderRadius={10}
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
                    width: `${sizeLogo} !important`,
                    minWidth: `${sizeLogo} !important`,
                    height: `${sizeLogo} !important`,
                    minHeight: `${sizeLogo} !important`,
                    borderRadius: borderRadiusLogo,
                    ...sx
                }}
      />
  );
}

export interface CompanyLogoByIdProps extends Omit<CompanyLogoProps, 'companyLogo' | 'loading'>{
    companyId?: number,
}

function CompanyLogoById ({companyId, isPhysicalPerson, sx, size, onSaveLogo }: CompanyLogoByIdProps) {
    const defaultLogo = useMemo(() => (
        isPhysicalPerson ? '/images/homeCompanies/company-logo-default-physical.svg' : '/images/homeCompanies/company-logo-default-legal.svg'
    ), [isPhysicalPerson]);

    const [isLoadingLogo, setLoadingLogo] = useState<boolean>(true);
    const [companyLogo, setCompanyLogo] = useState<any>(defaultLogo);

    const loadLogo = () => {
        if (companyId) {
            setLoadingLogo(true);
            HttpCompany.getCompanyLogo(companyId ?? 0).then(
                (blobResponse: FileBlobResponse) => {
                    var image = blobResponse[FileBlobResponseFields.File];
                    const imageObjectURL = image.size
                        ? URL.createObjectURL(image)
                        : defaultLogo;
    
                    setCompanyLogo(imageObjectURL);
                    setLoadingLogo(false);
                },
            );
        }
    };

    const handleSaveLogo = (file: File) => {
        const imageObjectURL = file.size
            ? URL.createObjectURL(file)
            : defaultLogo;
        setCompanyLogo(imageObjectURL);
        onSaveLogo && onSaveLogo(file);
    };

    useEffect(() => {
        loadLogo();
    }, [companyId]);

    return (
        companyLogo && (
            <CompanyLogo companyLogo={companyLogo}
                         loading={isLoadingLogo}
                         onSaveLogo={onSaveLogo ? handleSaveLogo : undefined}
                         size={size}
            />
        )
    );
}

export {
    CompanyLogo,
    CompanyLogoById
};
