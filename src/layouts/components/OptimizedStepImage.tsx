import Box from "@mui/material/Box";
import React from "react";

export const OptimizedStepImage = ({ 
    src, 
    mobileSrcs,
    alt = "",
    isSmallScreen 
  }: {
    src: string;
    mobileSrcs?: string[];
    alt?: string;
    isSmallScreen: boolean;
  }) => {
    return (
      <>
        <Box
          component="img"
          sx={{ width: '100%', m: '0 auto !important' }}
          src={isSmallScreen && mobileSrcs ? mobileSrcs[0] : src}
          alt={alt}
          loading="lazy" 
        />
        {isSmallScreen && mobileSrcs?.slice(1).map((mobileSrc, index) => (
          <Box
            key={index}
            component="img"
            sx={{ width: '100%', m: '0 auto !important' }}
            src={mobileSrc}
            alt={alt}
            loading="lazy"
          />
        ))}
      </>
    );
  };