import React, { useState } from "react";
import { ProductLineFields, ProductLineView } from "types/lines/productLineData";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Chip,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {EntityWithIdFields} from "types/baseEntities";
import ProductLineSummaryComponent from "../components/ProductLineSummaryComponent";
import {useAction} from "hooks/useAction";
import {DialogAlert} from "components/dialog";
import {groupBy} from "util/helpers";

interface ShoppingCartAccordionProps {
  title: string;
  companyId: number;
  lines: ProductLineView[];
  onReload: () => void;
  uniqueLineGrouping?: boolean;
  onlySingleSelection?: boolean;
  handleCheckBoxClick: (productLine: ProductLineView) => void;
  selectedLines: any[];
}

function ShoppingCartAccordion({ title, companyId, lines, onReload, uniqueLineGrouping, onlySingleSelection, handleCheckBoxClick, selectedLines }: ShoppingCartAccordionProps) {
  const { showLoader, hideLoader, removeLineFromShoppingCart } = useAction();
  const [expanded, setExpanded] = useState<boolean>(true);
  const [lineToBeDelete, setLineToBeDelete] = useState<ProductLineView>();
  const linesGroupedBySublabel = groupBy(lines,
      [ProductLineFields.SubGroupedCartLabel]);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const handleCloseDelete = () => setLineToBeDelete(undefined);

  const handleReloadAndHideLoader = () => {
    hideLoader();
    onReload();
  };

  const handleDeleteLine = () => {
    if (lineToBeDelete) {
      showLoader();
      removeLineFromShoppingCart(lineToBeDelete[ProductLineFields.Id], companyId, handleReloadAndHideLoader);
    }

    setLineToBeDelete(undefined);
  };

  const handleExpanded = () => {
    if (!uniqueLineGrouping) setExpanded(!expanded);
  };

  const renderLinesBySubgroup = () => {
    const linesGroupedKeys = Object.keys(linesGroupedBySublabel);

    return (
        <Stack spacing={4} sx={{ width: '100%', backgroundColor: 'transparent' }}>
          {linesGroupedKeys.map((key, index) => {
            const subGroupLines = linesGroupedBySublabel[key];

          return (
            <React.Fragment key={`linesSubgroup_${key}`}>
              <Card sx={{ 
                width: '100%', 
                padding: 3, 
                marginBottom: 4, 
                backgroundColor: 'white', 
                boxShadow: 3,
              }}>
                <Stack spacing={2}>
                  {key !== 'null' && (
                    <>
                      <Typography fontSize={'h5'} fontWeight={500} color={'text.lighter'}>
                        {key}
                      </Typography>
                    </>
                  )}
                  
                  {subGroupLines.map((line, idx) => (
                    <React.Fragment key={`shoppingCartAccordionLineDetail_${line[EntityWithIdFields.Id]}_${idx}`}>
                      <ProductLineSummaryComponent
                        productLine={line}
                        handleDeleteClick={setLineToBeDelete}
                        handleCheckboxClick={handleCheckBoxClick}
                        checked={selectedLines.some(selectedLine => selectedLine[ProductLineFields.SolicitationId] === line[ProductLineFields.SolicitationId])}
                        allowsModifyMessage
                      />
                    </React.Fragment>
                  ))}
                </Stack>
              </Card>
            </React.Fragment>
          );
        })}
      </Stack>
    );
  };

  return (
    <React.Fragment>
      {lines.length > 0 && (
        <Accordion sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} expanded={expanded}>
          {onlySingleSelection ? (
            <AccordionSummary>
              <Stack spacing={0} sx={{ width: '100%' }}>
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                  onClick={handleExpanded}
                  sx={{ cursor: uniqueLineGrouping ? 'default' : 'pointer' }}
                >
                  {!isMobile && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography fontSize={24} fontWeight={500}>
                        {title}
                      </Typography>
                      <Chip
                        size="small"
                        label={`${lines.length} ${lines.length === 1 ? 'línea' : 'lineas'}`}
                        color="default"
                      />
                    </Stack>
                  )}
                </Stack>
                <Typography variant="caption" color="text.lighter">
                  Tené en cuenta que solo podés iniciar el proceso de solicitud con una línea de búsqueda asistida a la vez
                </Typography>
              </Stack>
            </AccordionSummary>
          ) : (
            <Box sx={{ padding: 0 }}>
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                onClick={handleExpanded}
                sx={{ cursor: uniqueLineGrouping ? 'default' : 'pointer' }}
              >
                {!isMobile && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography fontSize={24} fontWeight={500}>
                      {title}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${lines.length} ${lines.length === 1 ? 'línea' : 'lineas'}`}
                      color="default"
                    />
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          <AccordionDetails sx={{ backgroundColor: 'transparent' }}>
            <Stack spacing={3}>
              {renderLinesBySubgroup()}
              {/*
                <CompanyFileWithPercentage percentage={percentageCompletenessFileType}
                                            goto={goToCompanyFile}
                                            hideTitle
                                            description={'Podrás aplicar a estas líneas con tu legajo de contacto, que cargas una vez, queda guardada y es posible actualizar, ahorrándote el trabajo de carga al comienzo de cada operación.  Asegurate de que esté completo y actualizado.'}
                />
                */
              }
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
      <DialogAlert
        open={!!lineToBeDelete}
        textContent={`¿Querés eliminar la linea ${lineToBeDelete?.[ProductLineFields.Line] ?? 'actual'} de la selección de tu empresa?`}
        textClose="Cancelar"
        onClose={handleCloseDelete}
        textConfirm="Eliminar"
        onConfirm={handleDeleteLine}
      />
    </React.Fragment>
  );
}

export default ShoppingCartAccordion;