import { Card, CardContent, CardHeader, Stack } from '@mui/material';
import { FileDocumentListSectionFlow } from '../../../components/files/FileDocumentListSection';

function CompanyLibraryFile() {
  return (
    <Card>
      <CardHeader title="Legajos" />
      <CardContent>
        <Stack gap={2}>
          <FileDocumentListSectionFlow
            filesDocument={[]}
            onReload={() => {}}
            download
            delete
            share
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CompanyLibraryFile;
