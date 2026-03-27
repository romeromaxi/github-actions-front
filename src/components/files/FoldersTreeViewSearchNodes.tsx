import React, { ReactElement, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { FoldersTreeItem } from './FoldersTreeView';
import { Skeleton } from '@mui/lab';

interface FoldersTreeViewSearchNodesProps {
  searchTreeItemsNodes: () => Promise<FoldersTreeItem[]>;
  render: (node: FoldersTreeItem) => ReactElement;
}

function FoldersTreeViewSearchNodes({
  searchTreeItemsNodes,
  render,
}: FoldersTreeViewSearchNodesProps) {
  const [treeNodes, setTreeNodes] = useState<FoldersTreeItem[]>();

  useEffect(() => {
    if (!treeNodes) searchTreeItemsNodes().then(setTreeNodes);
  }, [treeNodes]);

  return treeNodes ? (
    !!treeNodes.length ? (
      <Stack mt={1} spacing={1}>
        {treeNodes.map(render)}
      </Stack>
    ) : (
      <></>
    )
  ) : (
    <Stack spacing={1}>
      {Array.from({ length: 3 }).map(() => (
        <Skeleton height={'1rem'} />
      ))}
    </Stack>
  );
}

export default FoldersTreeViewSearchNodes;
