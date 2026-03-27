import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import { MarketCategoryDTOFields, MarketCategoryViewDTO } from 'types/market/marketCategoryData';
import { EntityWithIdAndDescriptionFields, EntityWithIdFields } from 'types/baseEntities';
import { marketFilterStorage, MarketLandingFilter } from 'util/sessionStorage/marketFiltersStorage';
import MenuMarketCategoriesStyles from './MenuMarketCategories.styles';
import { FilterProductLineSearchFields } from 'types/lines/productLineData';
import {useLocation, useNavigate} from "react-router-dom";
import { ListDashes } from "phosphor-react";
import { WrapperIcons } from "../icons/Icons";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { Skeleton } from "@mui/lab";
import { AppBarButton } from "../buttons/HomeButtons";
import { ArrowOutward } from '@mui/icons-material';
import {useTheme} from "@mui/material/styles";

export enum MarketCategoryNodeFields {
  Children = 'children',
}

export interface MarketCategoryNode extends MarketCategoryViewDTO {
  [MarketCategoryNodeFields.Children]: MarketCategoryNode[];
}

export const sortedCategory = (
  a: MarketCategoryViewDTO,
  b: MarketCategoryViewDTO,
): number => {
  if (!a[MarketCategoryDTOFields.ParentId]) {
    if (!b[MarketCategoryDTOFields.ParentId])
      return a[MarketCategoryDTOFields.Order] < b[MarketCategoryDTOFields.Order]
        ? -1
        : 1;

    return -1;
  }

  if (!b[MarketCategoryDTOFields.ParentId]) return 1;

  if (
    a[MarketCategoryDTOFields.ParentId] == b[MarketCategoryDTOFields.ParentId]
  )
    return a[MarketCategoryDTOFields.Order] < b[MarketCategoryDTOFields.Order]
      ? -1
      : 1;

  return a[MarketCategoryDTOFields.ParentId] <
    b[MarketCategoryDTOFields.ParentId]
    ? -1
    : 1;
};

interface MenuMarketCategoriesProps {
  title: string;
  categoriesTree?: MarketCategoryNode[];
  onNavigate: (path: string) => void;
  onAfterClick?: () => void;
  mobileView?: boolean;
}

function MenuMarketCategories({
  title,
  categoriesTree,
  onNavigate,
  onAfterClick,
  mobileView
}: MenuMarketCategoriesProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [openCategories, setOpenCategories] = useState<{ [key: number]: boolean }>({});

  const toggleCategory = (id: number) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const findParentCategoryNode = (
    parentId: number,
    categories: MarketCategoryNode[] | null,
  ): number[] | null => {
    if (!categories || !categories.length) return null;

    for (let index = 0; index < categories.length; index++) {
      const node = categories[index];

      if (node[EntityWithIdFields.Id] == parentId) return [index];

      const childrenNode = node[MarketCategoryNodeFields.Children];
      if (childrenNode.length) {
        const leafIndexes = findParentCategoryNode(parentId, childrenNode);

        if (!!leafIndexes) return [index, ...leafIndexes];
      }
    }

    return null;
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (location.pathname !== '/market/landing')
      navigate('/market/landing', { state: { scrollToElement: 'search-by-products' } });
    else 
      document.getElementById('search-by-products').scrollIntoView({ behavior: 'smooth', block: 'start' });
    //setAnchorEl(event.currentTarget);
    //setOpen(true);
    onAfterClick && onAfterClick();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleCategoryNavigate = (category: any) => {
    const newFilter: MarketLandingFilter = {
      [FilterProductLineSearchFields.CodsProductDestiny]: [],
      [FilterProductLineSearchFields.CodsProductService]: [],
      [FilterProductLineSearchFields.CodsProductInstrument]: [],
      [FilterProductLineSearchFields.CodsProductInstrumentType]: [],
      [FilterProductLineSearchFields.CodsProduct]: [],
    };
    const BASE_URL = window.location.origin;
    let params = new URL(category[MarketCategoryDTOFields.Link], BASE_URL)
      .searchParams;
    const primaryParam = params.entries().next().value;
    params.forEach((value, key) => {
      const numberValue = parseInt(value);
      switch (key) {
        case 'destiny':
          newFilter[FilterProductLineSearchFields.CodsProductDestiny]?.push(
            numberValue,
          );
          break;
        case 'service':
          newFilter[FilterProductLineSearchFields.CodsProductService]?.push(
            numberValue,
          );
          break;
        case 'products':
          newFilter[FilterProductLineSearchFields.CodsProduct]?.push(
            numberValue,
          );
          break;
        case 'instrument':
          newFilter[FilterProductLineSearchFields.CodsProductInstrument]?.push(
            numberValue,
          );
          break;
        case 'instrumentType':
          newFilter[
            FilterProductLineSearchFields.CodsProductInstrumentType
          ]?.push(numberValue);
          break;
      }
    });
    marketFilterStorage.clearSearchFilter();
    marketFilterStorage.clearStackedFilters();
    marketFilterStorage.savePrimarySearchParam({
      name: primaryParam?.[0] || '',
      value: primaryParam?.[1] || '',
    });
    marketFilterStorage.saveLandingFilter(newFilter);
    onNavigate(category[MarketCategoryDTOFields.Link]);
  };

  const renderCategoryItems = (categories: any[], depth: number = 0) => {
    return categories.map((category) => {
      const isOpen = openCategories[category.id] || false;
  
      const fontSize = `${1.1 - depth * 0.12}rem`;
      const color = `rgba(0, 0, 0, ${1 - depth * 0.2})`;
  
      const hasChildren = category.children?.length > 0;
  
      const handleItemClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!hasChildren) {
          handleCategoryNavigate(category);
        } else {
          toggleCategory(category.id);
        }
      };
  
      return (
        <div key={category.id} style={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <MenuItem
              onClick={handleItemClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '85%',
                textAlign: 'left',
              }}
              component="div"
            >
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: color, 
                  }}
                  style={{
                    fontSize: fontSize, 
                  }}
                >
                  {category.descripcion}
                </Typography>
              </Box>
              {hasChildren && (
                <Box sx={{ marginLeft: 1 }}>
                  {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
                </Box>
              )}
            </MenuItem>
  
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryNavigate(category);
              }}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                cursor: 'pointer',
                opacity: 0.7,
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              <WrapperIcons Icon={ArrowOutward} size={16} sx={{ transition: 'transform 0.2s ease' }} />
            </Box>
          </Box>
  
          {isOpen && category.children?.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                paddingLeft: 2,
              }}
            >
              {renderCategoryItems(category.children, depth + 1)}
            </Box>
          )}
        </div>
      );
    });
  };
  
  return (
    <React.Fragment>
      {!mobileView && (
        <AppBarButton onClick={handleClick}>
          {title}
        </AppBarButton>
      )}
      {!mobileView && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            onMouseLeave: handleClose,
          }}
        >
          <Stack direction={'row'} spacing={3} p={'0.2rem 1.1rem'}>
            {categoriesTree ? categoriesTree.map((categoryNode) => (
              <MenuMarketCategoryNode
                node={categoryNode}
                leaf={0}
                onNavigate={onNavigate}
              />
            )) : (
              Array.from({ length: 5 }).map((_, index) => (
                <Stack key={index} spacing={1} sx={{ width: '20%' }}>
                  <Skeleton variant="text" height={40} width={200} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </Stack>
              ))
            )}
          </Stack>
          {!window.location.toString().includes('landing') && (
            <Stack direction={'row-reverse'} sx={{ width: '100%' }}>
              <Button variant={'text'} size={'small'} sx={{ fontSize: '1.3rem !important' }} onClick={() => navigate('/market/landing')}>
                Ir a la tienda
              </Button>
            </Stack>
          )}
        </Menu>
      )}
      {mobileView && (
        <MenuItem
          onClick={(e) => {
            handleClick(e);
            // e.stopPropagation();
            //setExpanded(!expanded);
          }}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            '&:hover': {
              backgroundColor: 'transparent !important',
              color: `${theme.palette.primary.main} !important`
            },
          }}
        >
          <Stack direction="row" justifyContent="space-between" spacing={0.5} sx={{ width: '100%' }} alignItems="center">
            <Stack direction='row' alignItems='center' justifyContent={'center'} width={1}>
              <Typography variant={'subtitle2'} fontWeight={500} sx={{paddingLeft: 1}}>
                {title}
              </Typography>
            </Stack>
            {/*<WrapperIcons Icon={expanded ? CaretUp : CaretDown} size={'xs'} />*/}
          </Stack>

          {expanded && (
            <Stack direction="column" sx={{ width: '100%' }}>
              {renderCategoryItems(categoriesTree)}
            </Stack>
          )}
        </MenuItem>
      )}

    </React.Fragment>
  );
}

interface MenuMarketCategoryNodeProps {
  node: MarketCategoryNode;
  leaf: number;
  onNavigate: (path: string) => void;
  accordion?: boolean;
}

const typographyPropsCategory = [
  { color: 'primary', fontSize: '1.3rem' },
  { color: 'black', fontSize: '1rem' },
  { color: 'text.disabled', fontWeight: 700, fontSize: '0.875rem' },
  {
    color: 'text.disabled',
    fontWeight: 300,
    fontSize: '0.75rem',
    letterSpacing: 1.1,
  },
];

const typographyPropsCategoryDisabled = {
  color: 'text.disabled',
  fontWeight: 300,
  fontSize: '0.8rem',
  letterSpacing: 1.1,
  fontStyle: 'italic'
};

export function MenuMarketCategoryNode(props: MenuMarketCategoryNodeProps) {
  const classes = MenuMarketCategoriesStyles();
  const indexProps = props.leaf > 3 ? 3 : props.leaf;
  const displayDisabled = props.node[MarketCategoryDTOFields.DisplayDisabled];
  const [expanded, setExpanded] = useState<boolean>(false);

  const categoryNavigate = (category: MarketCategoryNode) => {
    const newFilter: MarketLandingFilter = {
      [FilterProductLineSearchFields.CodsProductDestiny]: [],
      [FilterProductLineSearchFields.CodsProductService]: [],
      [FilterProductLineSearchFields.CodsProductInstrument]: [],
      [FilterProductLineSearchFields.CodsProductInstrumentType]: [],
      [FilterProductLineSearchFields.CodsProduct]: [],
    };
    const BASE_URL = window.location.origin;
    let params = new URL(category[MarketCategoryDTOFields.Link], BASE_URL)
      .searchParams;
    const primaryParam = params.entries().next().value;
    params.forEach((value, key) => {
      const numberValue = parseInt(value);
      switch (key) {
        case 'destiny':
          newFilter[FilterProductLineSearchFields.CodsProductDestiny]?.push(
            numberValue,
          );
          break;
        case 'service':
          newFilter[FilterProductLineSearchFields.CodsProductService]?.push(
            numberValue,
          );
          break;
        case 'products':
          newFilter[FilterProductLineSearchFields.CodsProduct]?.push(
            numberValue,
          );
          break;
        case 'instrument':
          newFilter[FilterProductLineSearchFields.CodsProductInstrument]?.push(
            numberValue,
          );
          break;
        case 'instrumentType':
          newFilter[
            FilterProductLineSearchFields.CodsProductInstrumentType
          ]?.push(numberValue);
          break;
      }
    });
    marketFilterStorage.clearSearchFilter();
    marketFilterStorage.clearStackedFilters();
    marketFilterStorage.savePrimarySearchParam({
      name: primaryParam?.[0] || '',
      value: primaryParam?.[1] || '',
    });
    marketFilterStorage.saveLandingFilter(newFilter);
    props.onNavigate(category[MarketCategoryDTOFields.Link]);
  };

  return (
    props.accordion ? (
      <Accordion sx={{ backgroundColor: 'white !important', width: '100% !important' }} expanded={expanded}
        key={`menuMarketCategoryNode_${props.leaf}_${props.node[EntityWithIdFields.Id]}`}
      >
        <AccordionSummary>
          <Stack direction='row' justifyContent='space-between' sx={{ width: '100%' }} alignItems={'center'} onClick={() => setExpanded(!expanded)}>
            <Typography
              pl={props.leaf}
            >
              {
                (props.node[MarketCategoryDTOFields.Link] && !displayDisabled) ? (
                  <Link
                    className={classes.linkCategory}
                    onClick={() => categoryNavigate(props.node)}
                  >
                    {props.node[EntityWithIdAndDescriptionFields.Description]}
                  </Link>
                ) : (
                  props.node[EntityWithIdAndDescriptionFields.Description]
                )
              }
            </Typography>
            <WrapperIcons Icon={expanded ? CaretUp : CaretDown} size={'xs'} />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack
            direction={'column'}
            spacing={props.leaf === 0 ? 0.5 : 0}
          >
            {props.node[MarketCategoryNodeFields.Children].map((x) => (
              <MenuMarketCategoryNode
                node={x}
                leaf={props.leaf + 1}
                onNavigate={props.onNavigate}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    ) : (
      <Stack
        direction={'column'}
        key={`menuMarketCategoryNode_${props.leaf}_${props.node[EntityWithIdFields.Id]}`}
        spacing={props.leaf === 0 ? 0.5 : 0}
      >
        <Typography
          {...((displayDisabled && props.leaf !== 0) ? typographyPropsCategoryDisabled : typographyPropsCategory[indexProps])}
          pl={props.leaf}
          className={displayDisabled ? classes.textCategoryDisabled : classes.textCategory}
        >
          {
            (props.node[MarketCategoryDTOFields.Link] && !displayDisabled) ? (
              <Link
                className={classes.linkCategory}
                onClick={() => categoryNavigate(props.node)}
              >
                {props.node[EntityWithIdAndDescriptionFields.Description]}
              </Link>
            ) : (
              props.node[EntityWithIdAndDescriptionFields.Description]
            )
          }
        </Typography>

        {props.node[MarketCategoryNodeFields.Children].map((x) => (
          <MenuMarketCategoryNode
            node={x}
            leaf={props.leaf + 1}
            onNavigate={props.onNavigate}
          />
        ))}
      </Stack>
    )
  );
}

export default MenuMarketCategories;