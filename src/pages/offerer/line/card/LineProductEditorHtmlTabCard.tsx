import React from 'react';

import { Card, CardContent, CardHeader } from '@mui/material';

import { useProductLineDetail } from 'pages/lines/ProductLineDetailContext';
import LineProductEditorHtmlTab, { LineProductEditorHtmlTabProps } from "./LineProductEditorHtmlTab";

interface LineProductEditorHtmlTabCardProps extends LineProductEditorHtmlTabProps {
  title: string,
  name: string;
  helperText?: string;
  showInAlert?: boolean;
}

function LineProductEditorHtmlTabCard({
  title,
  ...propsEditor
}: LineProductEditorHtmlTabCardProps) {
  const { loading } = useProductLineDetail()
  return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          {
            loading ? <></>
                :
                <LineProductEditorHtmlTab {...propsEditor} />
          }
        </CardContent>
      </Card>
  );
}

export default LineProductEditorHtmlTabCard;
