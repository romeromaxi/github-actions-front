import {Card, CardContent, Divider, Grid, Stack, TextField, Typography} from '@mui/material';
import React, {useState} from 'react';
import {
    DynamicFinancialStatement, 
    DynamicBalanceSection,
    DynamicFinancialStatementFields
} from '../../../../types/general/generalFinanceData';

interface FinancialYearDynamicViewComponentProps {
  data: DynamicFinancialStatement;
  year?: number;
  editable?: boolean;
}

function FinancialYearDynamicViewComponent({
  data, year, editable = true
}: FinancialYearDynamicViewComponentProps) {
  
  const [editableData, setEditableData] = useState<DynamicFinancialStatement>(data);
  
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isSection = (value: any): boolean => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  };

  const updateValue = (path: string[], newValue: number) => {
    const updatedData = JSON.parse(JSON.stringify(editableData));
    let current: any = updatedData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = newValue;
    setEditableData(updatedData);
  };

  const renderSection = (
    section: DynamicBalanceSection | any,
    title: string,
    level: number = 0,
    pathPrefix: string[] = []
  ): JSX.Element => {
    const fields = Object.keys(section).filter(key => key !== 'Total');
    const total = section['Total'];

    return (
      <Card variant="outlined" sx={{ mb: 2, ml: level * 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: level === 0 ? 'bold' : 'normal' }}>
            {formatFieldName(title)}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1.5}>
            {fields.map((fieldKey) => {
              const value = section[fieldKey];
              
              if (isSection(value)) {
                return (
                  <div key={fieldKey}>
                    {renderSection(value, fieldKey, level + 1, [...pathPrefix, title])}
                  </div>
                );
              } else {
                return (
                  <Grid container spacing={2} key={fieldKey} alignItems="center">
                    <Grid item xs={7}>
                      <Typography variant="body2" color="text.secondary">
                        {fieldKey}
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        value={value || 0}
                        size="small"
                        fullWidth
                        disabled={!editable}
                        type="number"
                        onChange={(e) => {
                          if (editable) {
                            const newValue = parseFloat(e.target.value) || 0;
                            const path = [...pathPrefix, title, fieldKey];
                            updateValue(path, newValue);
                          }
                        }}
                        inputProps={{
                          step: "0.01",
                        }}
                      />
                    </Grid>
                  </Grid>
                );
              }
            })}
            
            {total !== undefined && (
              <>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={7}>
                    <Typography variant="body1" fontWeight="bold">
                      Total
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      value={total || 0}
                      size="small"
                      fullWidth
                      disabled={!editable}
                      type="number"
                      onChange={(e) => {
                        if (editable) {
                          const newValue = parseFloat(e.target.value) || 0;
                          const path = [...pathPrefix, title, 'Total'];
                          updateValue(path, newValue);
                        }
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontWeight: 'bold',
                        },
                      }}
                      inputProps={{
                        step: "0.01",
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  const renderSimpleField = (fieldKey: string) => {
    const excludedFields = [
      DynamicFinancialStatementFields.Date,
      DynamicFinancialStatementFields.Active,
      DynamicFinancialStatementFields.Passive,
      DynamicFinancialStatementFields.NetPatrimony
    ];
    
    if (excludedFields.includes(fieldKey as any)) {
      return <></>;
    }

    return (
      <Grid container spacing={2} key={fieldKey} alignItems="center">
        <Grid item xs={7}>
          <Typography variant="body2" color="text.secondary">
            {formatFieldName(fieldKey)}
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <TextField
            value={editableData[fieldKey] || 0}
            size="small"
            fullWidth
            disabled={!editable}
            type="number"
            onChange={(e) => {
              if (editable) {
                const newValue = parseFloat(e.target.value) || 0;
                setEditableData({
                  ...editableData,
                  [fieldKey]: newValue
                });
              }
            }}
            inputProps={{
              step: "0.01",
            }}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Stack spacing={2} sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {year ? `Ejercicio ${year}` : 'Estado Contable'}
      </Typography>
      
      {editableData[DynamicFinancialStatementFields.Date] && (
        <Typography variant="subtitle1" color="text.secondary">
          Fecha: {editableData[DynamicFinancialStatementFields.Date]}
        </Typography>
      )}

      {editableData[DynamicFinancialStatementFields.Active] && 
        renderSection(
          editableData[DynamicFinancialStatementFields.Active], 
          DynamicFinancialStatementFields.Active, 
          0, 
          []
        )}

      {editableData[DynamicFinancialStatementFields.Passive] && 
        renderSection(
          editableData[DynamicFinancialStatementFields.Passive], 
          DynamicFinancialStatementFields.Passive, 
          0, 
          []
        )}

      {editableData[DynamicFinancialStatementFields.NetPatrimony] && 
        renderSection(
          editableData[DynamicFinancialStatementFields.NetPatrimony], 
          DynamicFinancialStatementFields.NetPatrimony, 
          0, 
          []
        )}

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Estado de Resultados
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1.5}>
            {Object.keys(editableData)
              .filter(key => ![
                DynamicFinancialStatementFields.Date,
                DynamicFinancialStatementFields.Active,
                DynamicFinancialStatementFields.Passive,
                DynamicFinancialStatementFields.NetPatrimony
              ].includes(key as any))
              .map(fieldKey => renderSimpleField(fieldKey))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default FinancialYearDynamicViewComponent;
