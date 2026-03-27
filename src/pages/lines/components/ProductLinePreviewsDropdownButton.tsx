import React, { useState } from 'react';
import { Search, Store } from '@mui/icons-material';
import { ProductLineViewDetail } from 'types/lines/productLineData';
import { HttpProductLine } from 'http/index';
import LineMarketViewDialog from '../../offerer/line/card/LineMarketViewDialog';
import { ButtonDropdown, MenuItemDropdown } from 'components/buttons/Buttons';
import ProductLineSummaryDetailDrawer from "../../markets/lines/detail/ProductLineSummaryDetailDrawer";
import {OffererButtonSecObjects, OffererProductLineDetailPageSecObjects, SecurityComponents} from 'types/security';
import useSecurityObject from "../../../hooks/useSecurityObject";

interface ProductLinePreviewsDropdownButtonProps {
  lineId: number;
}

function ProductLinePreviewsDropdownButton({
  lineId,
}: ProductLinePreviewsDropdownButtonProps) {
  const { hasWritePermission } = useSecurityObject();  
  const [productLineDetail, setProductLineDetail] = useState<ProductLineViewDetail>();
  const [productLineDetailOpen, setProductLineDetailOpen] =
    useState<boolean>(false);
  const [marketPreviewOpen, setMarketPreviewOpen] = useState<boolean>(false);
  const hasPermission = 
      hasWritePermission(SecurityComponents.OffererProductLineDetailPage, OffererButtonSecObjects.OffererButtonPreviewLine) ||
      hasWritePermission(SecurityComponents.OffererProductLineDetailPage, OffererProductLineDetailPageSecObjects.ProductLineInternalButtonPreviewLine)
  
  const handleOnDetail = () => {
    HttpProductLine.getByProductLineId(lineId).then((productLine) => {
      setProductLineDetail(productLine);
      setProductLineDetailOpen(true);
    });
  };

  const handleOnMarketPreview = () => {
    HttpProductLine.getByProductLineId(lineId).then((productLine) => {
      setProductLineDetail(productLine);
      setMarketPreviewOpen(true);
    });
  };

  const onCloseDetailDialog = () => {
    setProductLineDetailOpen(false);
    setProductLineDetail(undefined);
  };

  const onCloseMarketDetailDialog = () => {
    setMarketPreviewOpen(false);
    setProductLineDetail(undefined);
  };

  const itemsDropdown: MenuItemDropdown[] = [
    {
      label: 'Card Tienda',
      icon: <Store fontSize={'small'} />,
      onClick: handleOnMarketPreview,
    },
    {
      label: 'Detalle Línea',
      icon: <Search fontSize={'small'} />,
      onClick: handleOnDetail,
    }
  ];

  return (
      hasPermission ?
          <React.Fragment>
              <ButtonDropdown label={'Previsualizar'} 
                              size={'small'} 
                              color={'primary'} 
                              items={itemsDropdown}
              />

              {productLineDetail && productLineDetailOpen && (
                  <ProductLineSummaryDetailDrawer
                      onClose={onCloseDetailDialog}
                      line={productLineDetail}
                      open={productLineDetailOpen}
                  />
              )}

              {productLineDetail && marketPreviewOpen && (
                  <LineMarketViewDialog
                      onClose={onCloseMarketDetailDialog}
                      line={productLineDetail}
                      open={marketPreviewOpen}
                  />
              )}
          </React.Fragment>
          :
          <React.Fragment />
  );
}

export default ProductLinePreviewsDropdownButton;
