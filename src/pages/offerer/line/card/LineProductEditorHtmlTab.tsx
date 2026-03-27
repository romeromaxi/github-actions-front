import React, { createRef } from 'react';
import { useFormContext } from 'react-hook-form';

import {Alert, Grid} from '@mui/material';

import { EditorHtml } from 'components/forms/EditorHtml';
import HelperInputText from 'components/text/HelperInputText';
import { useProductLineDetail } from '../../../lines/ProductLineDetailContext';

export interface LineProductEditorHtmlTabProps {
  name: string;
  helperText?: string;
  showInAlert?: boolean;
}

function LineProductEditorHtmlTab({
  name,
  helperText,
  showInAlert
}: LineProductEditorHtmlTabProps) {
  const { allowEdit } = useProductLineDetail();
  const { watch, setValue } = useFormContext();
  const editor = createRef<any>();

  return (
    <Grid container spacing={2}>
      {helperText && (
          showInAlert ?
              <Alert color='info' severity='info'>
                {helperText}
              </Alert>
              :
              <Grid item xs={12}>
                <HelperInputText text={helperText} />
              </Grid>
      )}

      <Grid item xs={12}>
        <EditorHtml
          textHtml={watch(name)}
          ref={editor}
          name={name}
          setValue={setValue}
          disabled={!allowEdit}
        />
      </Grid>
    </Grid>
  );
}

export default LineProductEditorHtmlTab;
