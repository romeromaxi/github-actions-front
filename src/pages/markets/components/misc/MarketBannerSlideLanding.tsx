import {
  DynamicSearchMarketView,
  DynamicSearchMarketViewFields,
} from 'types/market/marketData';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MarketAdvertisingAnswersDialog from '../forms/MarketAdvertisingAnswersDialog';
import React, { useState } from 'react';
import { AppRouteSecObjects, SecurityComponents } from 'types/security';
import useSecurityObject from 'hooks/useSecurityObject';
import FailRedirectMarketDialog from '../../home/components/FailRedirectMarketDialog';

interface MarketBannerSlideLandingProps {
  banner: DynamicSearchMarketView;
}

const MarketBannerSlideLanding = ({
  banner,
}: MarketBannerSlideLandingProps) => {
  const navigate = useNavigate();
  const { hasReadPermission } = useSecurityObject();
  const [openAnswers, setOpenAnswers] = useState<boolean>(false);
  const [failRedirect, setFailRedirect] = useState<boolean>(false);

  const onClickImage = () => {
    if (
      !hasReadPermission(
        SecurityComponents.AppRoutes,
        AppRouteSecObjects.MarketProductLineSearchRoute,
      )
    ) {
      setFailRedirect(true);
      return;
    }

    if (banner[DynamicSearchMarketViewFields.IsBoundedSearchDestination]) {
      if (banner[DynamicSearchMarketViewFields.RequiresQuestions]) {
        setOpenAnswers(true);
      } else {
        navigate(
          `/market/lines/alterSearch?guid=${banner[DynamicSearchMarketViewFields.UniqueIdentifier]}`,
        );
      }
    } else {
      navigate('/market/lines');
    }
  };

  return (
    <div>
        <Button
            onClick={onClickImage}
            sx={{
                transition: 'transform 0.3s',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                mt: 7.5,
                width: 1,
                height: '500px',
                '&:hover': {
                    cursor: 'pointer',
                    transform: 'scale(0.99)',
                },
            }}
        >
            <img src={banner[DynamicSearchMarketViewFields.ImageURL]}
                 alt={'casfog'}
                 style={{
                     display: 'block',
                     width: '100%',
                     height: '100%',
                     objectFit: 'fill'
                 }}
            />
        </Button>

        <div>
            <MarketAdvertisingAnswersDialog
                open={openAnswers}
          onClose={() => setOpenAnswers(false)}
          onSearch={() =>
            navigate(
              `/market/lines/alterSearch?guid=${banner[DynamicSearchMarketViewFields.UniqueIdentifier]}`,
            )
          }
        />
      </div>

      <FailRedirectMarketDialog
        open={failRedirect}
        onClose={() => setFailRedirect(false)}
      />
    </div>
  );
};

export default MarketBannerSlideLanding;
