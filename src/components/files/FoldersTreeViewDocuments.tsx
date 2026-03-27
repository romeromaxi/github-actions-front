import React, { ReactElement, useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Document } from 'types/files/filesData';
import { FileDocumentDetailLoading } from './FileDocumentDetail';

interface FoldersTreeViewDocumentsProps {
  searchDocuments: () => Promise<Document[]>;
  renderDocument: (document: Document) => ReactElement;
  disabled?: boolean;
}

function FoldersTreeViewDocuments({
  searchDocuments,
  renderDocument,
}: FoldersTreeViewDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>();

  useEffect(() => {
    if (!documents) searchDocuments().then(setDocuments);
  }, [documents]);

  return documents ? (
    !!documents.length ? (
      <Stack mt={1} spacing={1}>
        {documents.map(renderDocument)}
      </Stack>
    ) : (
      <></>
    )
  ) : (
    <Stack spacing={1}>
      {Array.from({ length: 2 }).map(() => (
        <FileDocumentDetailLoading
          key={Math.random().toString(36).substring(7)}
        />
      ))}
    </Stack>
  );
}
/*{Array.from({length: 2}).map((i) => <Skeleton /> )}*/
/*{Array.from({length: 2}).map((i) => <FileDocumentDetailLoading key={`FoldersTreeViewDocumentsLoading_${i}`} /> )}*/
export default FoldersTreeViewDocuments;
