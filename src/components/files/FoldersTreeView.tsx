import React, { ReactElement } from 'react';
import { fileFormatter } from 'util/formatters/fileFormatter';
import './FolderTreeViewStyles.css';

import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Document } from 'types/files/filesData';
import FoldersTreeViewDocuments from './FoldersTreeViewDocuments';
import { Badge, Stack, Tooltip } from '@mui/material';
import FoldersTreeViewSearchNodes from './FoldersTreeViewSearchNodes';
import {TypographyBase} from "../misc/TypographyBase";

export enum FoldersTreeItemFields {
  Id = 'id',
  Name = 'name',
  Children = 'children',
  IsFolder = 'isFolder',
  Quantity = 'quantity',
}

export interface FoldersTreeItem {
  [FoldersTreeItemFields.Id]: number;
  [FoldersTreeItemFields.Name]: string;
  [FoldersTreeItemFields.Children]: FoldersTreeItem[];
  [FoldersTreeItemFields.IsFolder]: boolean;
  [FoldersTreeItemFields.Quantity]?: number;
}

interface FoldersTreeViewProps {
  items: FoldersTreeItem[];
  currentFoldersIds: number[];
  setCurrentFoldersIds: (ids: number[]) => void;
  onClickFolder?: (id?: number) => void;
  searchFiles?: (id?: number) => Promise<Document[]>;
  renderDocument?: (document: Document) => ReactElement;
  searchTreeItemsNodes?: (id?: number) => Promise<FoldersTreeItem[]>;
  omitIds?: boolean;
  badgeText?: string;
}

const FoldersTreeView = ({
  items,
  currentFoldersIds,
  setCurrentFoldersIds,
  onClickFolder,
  searchFiles,
  renderDocument,
  searchTreeItemsNodes, omitIds,
  badgeText,
}: FoldersTreeViewProps) => {
  const collapseIcon = fileFormatter.getIconFolderThemeOpen({
    fontSize: 'medium',
  });
  const expandIcon = fileFormatter.getIconFolderTheme({ fontSize: 'medium' });

  const renderTree = (nodes: FoldersTreeItem, parentsId: number[] = []) => {
    const hierarchyIds = [...parentsId, nodes.id];
    const keyItem = hierarchyIds.map((x) => x.toString()).join('_');

    return (
      <TreeItem
        key={keyItem}
        nodeId={keyItem}
        label={
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            spacing={1}
          >
            <TypographyBase variant={'subtitle2'} fontWeight={600} maxLines={1} tooltip
                            sx={{ cursor: 'pointer !important' }}
            >
              {nodes.name}
            </TypographyBase>
            
            <Tooltip title={badgeText}>
              <Badge
                badgeContent={nodes[FoldersTreeItemFields.Quantity] ?? 0}
                color={'success'}
              />
            </Tooltip>
          </Stack>
        }
        collapseIcon={collapseIcon}
        expandIcon={expandIcon}
        onClick={() => {
          !omitIds && setCurrentFoldersIds(hierarchyIds);
          onClickFolder && onClickFolder(nodes[FoldersTreeItemFields.Id]);
        }}
      >
        {Array.isArray(nodes.children) && !!nodes.children.length ? (
          nodes.children.map((node: any) => renderTree(node, hierarchyIds))
        ) : (
          <TreeItem key={`${keyItem}_0`} nodeId={`${keyItem}_0`} label={''} />
        )}

        {searchTreeItemsNodes && !parentsId.length && (
          <FoldersTreeViewSearchNodes
            searchTreeItemsNodes={() => searchTreeItemsNodes(nodes.id)}
            render={(node) => renderTree(node, hierarchyIds)}
          />
        )}

        {searchFiles && renderDocument && (
          <FoldersTreeViewDocuments
            searchDocuments={() => searchFiles(nodes.id)}
            renderDocument={renderDocument}
          />
        )}
      </TreeItem>
    );
  };

  const getCurrentExpanded = (ids: number[]): string[] =>
    ids.map((_, index, array) => array.slice(0, index + 1).join('_'));

  return (
    <TreeView
      defaultCollapseIcon={collapseIcon}
      defaultExpandIcon={expandIcon}
      expanded={currentFoldersIds ? getCurrentExpanded(currentFoldersIds) : []}
      selected={''}
    >
      {items.map((x) => renderTree(x))}
    </TreeView>
  );
};

export default FoldersTreeView;
