import React from 'react';
import MarketGuidGondola from './MarketGuidGondola';

interface MarketGuidTabContentProps {
  guid: string;
}

const MarketGuidTabContent: React.FC<MarketGuidTabContentProps> = ({ guid }) => {
  return <MarketGuidGondola guid={guid} />;
};

export default MarketGuidTabContent;
