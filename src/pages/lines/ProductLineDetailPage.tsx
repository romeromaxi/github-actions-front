import React, {ReactNode} from 'react';
import { useFormContext } from 'react-hook-form';
import { useAction } from 'hooks/useAction';

import {NavsTabVertical} from 'components/navs/NavsTab';

import ProductLineDetailHeader, {ProductLineEditActionButtons} from './ProductLineDetailHeader';
import { useProductLineDetail } from './ProductLineDetailContext';
import ProductLineDetailChatPage from './chat/ProductLineDetailChatPage';
import ProductLineDetailApprovalPage from './approval/ProductLineDetailApprovalPage';
import ProductLineDetailPublicationPage from './publication/ProductLineDetailPublicationPage';
import {
    ProductLineFields,
    ProductLineFormData,
} from 'types/lines/productLineData';
import ProductLineRequiredByPage from './required-by/ProductLineRequiredByPage';
import ProductLineLibraryPage from './library/ProductLineLibraryPage';
import ProductLineDetailStatusTimeline from "./components/ProductLineDetailStatusTimeline";
import {Stack} from "@mui/material";
import ProductLineDetailCommercialDescription from "./publication/ProductLineDetailCommercialDescription";
import LineProductAttributesTab from "../offerer/line/card/LineProductAttributesTab";
import LineProductRequisitesTab from "../offerer/line/card/LineProductRequisitesTab";
import LineProductOffererRelatedTab from "../offerer/line/card/LineProductOffererRelatedTab";
import LineCardEditSelectFileTypeTabs from "../offerer/line/card/LineCardEditSelectFileTypeTabs";
import LineGuaranteesEditorCard from "../offerer/line/card/LineGuaranteesEditorCard";
import LineDisclaimerEditorTab from "../offerer/line/card/LineDisclaimerEditorTab";

function ProductLineDetailPage() {
  const { setTitle } = useAction();
  
  const {
    lineId,
    offerer
  } = useProductLineDetail();
  const methods = useFormContext<ProductLineFormData>();
  const offererId = methods.watch(ProductLineFields.OffererId);
  const offererWorkTeamsName = methods.watch(
    ProductLineFields.OffererWorkTeamsName,
  );
  
  setTitle(
    `Detalle de Línea #${lineId || ''}`,
    undefined,
    offerer && !!offererWorkTeamsName ? `Equipo: ${offererWorkTeamsName}` : '',
  );

  return (
      <Stack gap={2}>
        <ProductLineDetailHeader />
        <NavsTabVertical
          lstTabs={[
            {
              label: 'Editar línea',
              tabList: [
                  {
                      label: 'Clasificación',
                      content: <ProductLineEditWrapper><ProductLineDetailPublicationPage /></ProductLineEditWrapper>,
                      queryParam: 'publication',
                      default: true
                  },
                  {
                      label: 'Descripción comercial',
                      content: <ProductLineEditWrapper><ProductLineDetailCommercialDescription /></ProductLineEditWrapper>,
                      queryParam: 'commercialDesc'
                  },
                  {
                      label: 'Características',
                      content: <ProductLineEditWrapper><LineProductAttributesTab /></ProductLineEditWrapper>,
                      queryParam: 'features'
                  },
                  {
                      label: 'PyMEs destinatarias',
                      content: <ProductLineEditWrapper><LineProductRequisitesTab /></ProductLineEditWrapper>,
                      queryParam: 'destinationPymes'
                  },
                  {
                      label: 'Garantías',
                      content: <ProductLineEditWrapper><LineGuaranteesEditorCard /></ProductLineEditWrapper>,
                      queryParam: 'guarantees'
                  },
                  {
                      label: 'Entidades compatibles',
                      content: <ProductLineEditWrapper><LineProductOffererRelatedTab /></ProductLineEditWrapper>,
                      queryParam: 'compatibleEntities'
                  },
                  {
                      label: 'Legajo solicitado',
                      content: <ProductLineEditWrapper><LineCardEditSelectFileTypeTabs /></ProductLineEditWrapper>,
                      queryParam: 'requestedFileType'
                  },
                  {
                      label: 'Notas',
                      content: <ProductLineEditWrapper><LineDisclaimerEditorTab /></ProductLineEditWrapper>,
                      queryParam: 'notes'
                  }
              ]
            },
            {
                tabList: [
                    ...(offerer
                        ? [
                            {
                                label: 'Documentación relacionada',
                                content: (
                                    <ProductLineLibraryPage
                                        lineId={lineId}
                                        offererId={offererId}
                                    />
                                ),
                                queryParam: 'documents',
                            },
                        ]
                        : [])
                ]  
            },
            {
                tabList: [
                    ...(offerer
                        ? [
                            {
                                label: 'Registro interno',
                                content: <ProductLineRequiredByPage lineId={lineId} />,
                                queryParam: 'required-by',
                            },
                        ]
                        : [])
                ]  
            },
            {
              tabList: [
                {
                  label: 'Solicitud de Publicación',
                  content: <ProductLineDetailApprovalPage />,
                  queryParam: 'approval',
                }
              ],
            }, 
            {
                tabList: [
                    {
                        label: offerer ? 'Chat con LUC' : 'Chat con el Oferente',
                        content: <ProductLineDetailChatPage />,
                        queryParam: 'chat',
                    }
                ]
            },
            {
                tabList: [
                    {
                        label: 'Historial',
                        content: <ProductLineDetailStatusTimeline />,
                        queryParam: 'history'
                    }
                ]  
            }
          ]}
          tabSize={3.5}
        />
      </Stack>
  );
}


interface ProductLineEditWrapperProps {
    children: ReactNode
}

const ProductLineEditWrapper = ({children} : ProductLineEditWrapperProps) => {
    
    return (
        <Stack spacing={2}>
            <ProductLineEditActionButtons />
            
            {children}
        </Stack>
    )
}

export default ProductLineDetailPage;
