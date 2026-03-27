import React, {ReactNode, useContext, useState} from 'react';
import {Button, Card, CardContent, Stack} from '@mui/material';
import CardBaseStyles from '../../components/cards/CardBase.styles';
import {ButtonExportDropdown} from '../../components/buttons/ButtonExportDropdown';
import UploadIcon from '@mui/icons-material/Upload';
import CompanyBureauDocsDialog from './CompanyBureauDocsDialog';
import {
  BureauInformationContext
} from "../../hooks/contexts/BureauInformationContext";
import CompanyBureauInfoSelector from "./components/CompanyBureauInfoSelector";

interface CompanyBureuInfoProps {
  children: ReactNode;
  dataId?: number;
  hideActions?: boolean;
  hideSelector?: boolean;
}

function CompanyBureauInfo({
  children,
  hideActions = true,
  hideSelector = false,
  dataId
}: CompanyBureuInfoProps) {
  const classes = CardBaseStyles();
  const { selectedQueryId } = useContext(BureauInformationContext);
  
  const [open, setOpen] = useState<boolean>(false);
  
  return (
        <Card className={classes.cardWithShadow}>
          <CardContent>
            <Stack gap={5}>
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <CompanyBureauInfoSelector hideSelection={hideSelector}/> 

                {!hideActions && (
                  <Stack direction="row" spacing={3} alignItems={'center'}>
                    <ButtonExportDropdown />
                    <Button
                      endIcon={<UploadIcon />}
                      onClick={() => {
                        setOpen(true);
                      }}
                      color={'primary'}
                      variant={'contained'}
                    >
                      Subir Archivo{' '}
                    </Button>
                  </Stack>
                )}
              </Stack>
              {children}
            </Stack>
            {
              dataId &&
              <CompanyBureauDocsDialog
                open={open}
                companyId={dataId}
                onClose={() => setOpen(false)}
                nosisQueryId={selectedQueryId}
              />
            }
          </CardContent>
        </Card>
  );
}

export default CompanyBureauInfo;
