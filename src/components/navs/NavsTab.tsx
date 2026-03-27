import * as React from 'react';
import {ReactElement, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {
    Box, Button,
    Card,
    CardActions,
    CardContent, Collapse, Container,
    Divider,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    SxProps,
    Tab,
    Tabs,
    TabsProps,
    Typography, useMediaQuery
} from '@mui/material';
import NavsTabStyles from './NavsTab.styles';
import {Theme, useTheme} from '@mui/material/styles';
import clsx from 'clsx';
import { ExpandMoreTwoTone } from '@mui/icons-material';
import { SafetyComponent } from '../security';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import { useQuery } from '../../hooks/useQuery';
import { DialogAlert } from '../dialog';
import { SafetyTabComponent } from '../security/SafetyTabComponent';
import {themeColorDefinition, themeTypographyDefinition} from 'util/themes/definitions';
import useSecurityObject from "../../hooks/useSecurityObject";
import {DefaultStylesButton} from "../buttons/Buttons";
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import {WrapperIcons} from "../icons/Icons";
import {CaretDown, CaretUp} from "@phosphor-icons/react";
import {BellRinging} from "phosphor-react";
import {TypographyBase} from "../misc/TypographyBase";
import {AppBarBase} from "../appbar/AppBarBase";
import {Undo2Icon} from "lucide-react";
import ScrollTop from "../../layouts/home/ScrollTop";
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";
import {AppConfigAppBarFields, AppConfigFields} from "../../types/appConfigEntities";

const valueTabNull: number = -1;

export interface INavTabMenu {
  label: React.ReactNode;
  content: React.ReactElement;
  securityComponent?: string;
  securityObject?: string;
  queryParam?: string;
}

export interface INavTab {
  label: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'top' | 'bottom' | 'start' | 'end';
  content?: React.ReactElement;
  default?: boolean;
  shouldRender?: boolean;
  alwaysRender?: boolean;
  topDivider?: boolean;
  sx?: SxProps<Theme>;
  menu?: INavTabMenu[];
  securityComponent?: string;
  securityObject?: string;
  queryParam?: string;
  disabled?: boolean;
  tooltip?: string;
  highlighted?: boolean;
  id?: string;
  action?: React.ReactNode;
}

export interface TabSection {
  label?: string;
  subtitle?: string;
  tabList: INavTab[];
  securityComponent?: string;
  securityObject?: string;
  highlighted?: boolean;
  topDivider?: boolean;
}

interface NavTabPanelProps {
  index: number;
  value: number;
  wasOpened: boolean;
  shouldRender?: boolean;
  alwaysRender?: boolean;
  sx?: SxProps<Theme>;
  content?: React.ReactElement;
  menu?: INavTabMenu[];
  subvalue?: number;
  anchorEl?: null | HTMLElement;
  handleClick?: (index: number, subindex: number, queryParam?: string) => void;
  handleClose?: () => void;
}

const scrollToTop = (elementId: string | null = null, offset: number | string | null = 0) => {
  if (elementId) {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      const numericOffset = typeof offset === 'string'
          ? parseInt(offset, 10)
          : offset || 0;

      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - numericOffset;
      
      window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
      });
  }
  else
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
};

export function NavTabPanel(props: NavTabPanelProps) {
  const classes = NavsTabStyles();

  const [mustRenderAgain, setMustRenderAgain] = useState<boolean>(false);
  const isOpen: boolean = props.value === props.index;

  const handleClick = (index: number, subindex: number, queryParam?: string) =>
    props.handleClick && props.handleClick(index, subindex, queryParam);

  const handleClose = () => props.handleClose && props.handleClose();

  
  useEffect(() => {
    if (props.shouldRender) setMustRenderAgain(true);
  }, [props.shouldRender]);

  useLayoutEffect(() => {
    if (mustRenderAgain) setMustRenderAgain(false);
  }, [mustRenderAgain]);

  return (props.shouldRender || props.alwaysRender) && !isOpen ? null : (
    <div
      role="tabpanel"
      hidden={!isOpen}
      id={`scrollable-auto-tabpanel-${props.index}`}
      aria-labelledby={`scrollable-auto-tab-${props.index}`}
      key={`navTabPanel_${props.index}`}
    >
      {props.wasOpened && (
        <Box sx={props.sx}>
          {props.menu && props.subvalue !== undefined && props.subvalue >= 0 ? (
            <Typography component="div">
              {props.menu[props.subvalue].content}
            </Typography>
          ) : (
            <Typography component="div">{props.content}</Typography>
          )}
        </Box>
      )}

      {isOpen && !!props.menu && (
        <Menu
          anchorEl={props.anchorEl}
          open={Boolean(props.anchorEl)}
          className={classes.menuPaperSubMenu}
          onClose={handleClose}
          onClick={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          {props.menu.map((item, index) =>
            item.securityComponent && item.securityObject ? (
              <SafetyComponent
                componentName={item.securityComponent}
                objectName={item.securityObject}
                key={`navTabPanelMenuItem_${props.index}_${index}`}
              >
                <MenuItem
                  disableRipple
                  key={`navTabPanelMenuItem_${props.index}_${index}`}
                  className={clsx('', {
                    [classes.menuActive]: index === props.subvalue,
                  })}
                >
                  <Box
                    onClick={() =>
                      handleClick(props.index, index, item.queryParam)
                    }
                  >
                    {item.label}
                  </Box>
                </MenuItem>
              </SafetyComponent>
            ) : (
              <MenuItem
                disableRipple
                key={`navTabPanelMenuItem_${props.index}_${index}`}
                className={clsx('', {
                  [classes.menuActive]: index === props.subvalue,
                })}
              >
                <Box
                  onClick={() =>
                    handleClick(props.index, index, item.queryParam)
                  }
                >
                  {item.label}
                </Box>
              </MenuItem>
            ),
          )}
        </Menu>
      )}
    </div>
  );
}

interface NavTabButtonProps {
  index: number;
  value: number;
  label: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick: (event: React.ChangeEvent<{}>, newValue: number) => void;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
  tooltip?: string;
  disabled?: boolean;
  highlighted?: boolean;
  action?: React.ReactNode;
  isActive?: boolean;
  id?: string;
}

export function NavTabButton({ size = 'medium' ,...props}: NavTabButtonProps) {
  const isActive: boolean = !!props.isActive || props.value === props.index;
  const isMedium : boolean = size === 'medium';
  const themeTypographyBase = isMedium ? themeTypographyDefinition.label : themeTypographyDefinition.caption;
    
  const colorActive = themeColorDefinition.UIElements.backgrounds.brandSubtle;
  const colorText = themeColorDefinition.UIElements.texts.main;
  
  return (
    <DefaultStylesButton
            variant="text" 
            color={"secondary"}
            onClick={(event) => props.onClick((event as unknown) as React.ChangeEvent<{}>, props.index)} 
            startIcon={props?.icon}
            size={size}
            fullWidth
            tooltipTitle={props?.tooltip}
            disabled={props?.disabled}
            sx={{
              ...themeTypographyBase,
              color: colorText,
              backgroundColor: `${isActive ? colorActive : 'white'}`,
              fontWeight: isActive ? 600 : 500,
              borderRadius: '16px',
              justifyContent: 'flex-start',
              paddingX: isMedium ? '12px !important' : '32px !important',
              textAlign: 'left',
              '&:hover': {
                backgroundColor: colorActive,
              },
              ...props?.sx,
            }}
            id={props?.id}
    >
      <Stack width={'100%'}
             direction={'row'} 
             justifyContent={'space-between'} 
             alignItems={'center'}
      >
        <Stack alignItems={'start'} justifyContent={'start'}>
          <TypographyBase variant={'button2'} color={props.disabled ? 'text.disabled' : 'text.main' } textAlign={'start'}>
            {props.label}
          </TypographyBase>
          
          {
            props.subtitle && 
              <Typography variant={'caption'} color={'text.lighter'} textAlign={'start'}>
                {props.subtitle}
              </Typography>
          }
        </Stack>

        {
            (props.highlighted || !!props.action) && (
                <Stack direction={'row'} alignItems={'center'} textAlign={'end'} spacing={2}>
                    { props.highlighted &&
                        <WrapperIcons className={'bell-ringing-shake'} Icon={BellRinging} size={'sm'} color={'error'}/>
                    }

                    { !!props.action && props.action }
                </Stack>
            )
        }
      </Stack>
    </DefaultStylesButton>
  );
}

interface NavTabSectionProps {
  lstTabs: TabSection[];
  tab: TabSection, 
  sectionIndex: number,
  value: number,
  handleClick: (event: React.MouseEvent<HTMLElement>, indexValue: number, tab: INavTab) => void
}

function NavTabSection({ tab, sectionIndex, value, handleClick, ...props }: NavTabSectionProps) {
  const classes = NavsTabStyles();
  const { hasWritePermission } = useSecurityObject();
  const offsetIndex =
      props.lstTabs
          .slice(0, sectionIndex)
          .map((section) => section.tabList.length)
          .reduce((pre, cur) => pre + cur, 0);
  const [expanded, setExpanded] = useState<boolean>((value >= sectionIndex && value < (sectionIndex + tab.tabList.length - 1)));

  const hasTabPermission = (tab: INavTab) =>
      (!tab.securityComponent || !tab.securityObject || hasWritePermission(tab.securityComponent, tab.securityObject));
  
  const onClickTabParentButton = (event: React.MouseEvent<HTMLElement>, index: number) => {
    const firstActiveTab = tab.tabList.find(x => !x.disabled && hasTabPermission(x));
    setExpanded(true);
    if (firstActiveTab) handleClick(event, index, firstActiveTab);
  }
  
  const onClickIconExpanded = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setExpanded(!expanded);
  }
  
  return (
      <Stack spacing={1}>
        {
            tab.topDivider &&
            <Divider sx={{ marginY: '0.5rem !important' }} />
        }

        {
            tab?.label && tab.tabList && tab.tabList.length > 1 &&
            <NavTabButton
                key={-1}
                value={value}
                index={-1}
                id={tab?.id}
                label={tab?.label}
                subtitle={tab?.subtitle}
                isActive={value >= offsetIndex && value < (offsetIndex + tab.tabList.length)}
                onClick={onClickTabParentButton}
                highlighted={tab.highlighted}
                action={
                  <Box onClick={onClickIconExpanded} sx={{cursor: 'pointer'}}>
                    <WrapperIcons Icon={expanded ? CaretUp : CaretDown} size={'sm'} sx={{ display: 'block' }} />
                  </Box>
                }
            />
        }

        <Collapse in={expanded || tab.tabList.length === 1 || !tab.label}>
          <Stack spacing={1}>
            {tab.tabList.map((oneTab, index) => (
                <React.Fragment>
                  {oneTab.securityComponent && oneTab.securityObject ?
                      <SafetyTabComponent
                          componentName={oneTab.securityComponent}
                          objectName={oneTab.securityObject}
                          key={`navsTabVerticalTab_${index}`}
                          value={index}
                      >
                        <React.Fragment>
                          {oneTab.topDivider && (
                              <Divider className={classes.navsDivider} />
                          )}
  
                          <NavTabButton
                              key={index}
                              value={value}
                              size={(tab.tabList.length === 1 || !tab?.label) ? 'medium' : 'small'}
                              index={index + offsetIndex}
                              label={oneTab.label}
                              subtitle={tab.tabList.length === 1 ? tab?.subtitle : undefined}
                              disabled={oneTab?.disabled}
                              highlighted={oneTab?.highlighted}
                              icon={oneTab?.icon}
                              tooltip={oneTab?.tooltip}
                              action={oneTab.action}
                              onClick={(event, index) => handleClick(event, index, oneTab)}
                              sx={{ ...oneTab.sx }}
                          />
                        </React.Fragment>
                      </SafetyTabComponent>
                      :
                      <React.Fragment>
                        {oneTab.topDivider && (
                            <Divider className={classes.navsDivider} />
                        )}
  
                        <NavTabButton
                            key={index}
                            value={value}
                            size={(tab.tabList.length === 1 || !tab?.label) ? 'medium' : 'small'}
                            index={index + offsetIndex}
                            label={oneTab.label}
                            disabled={oneTab?.disabled}
                            subtitle={tab.tabList.length === 1 ? tab?.subtitle : undefined}
                            highlighted={oneTab?.highlighted}
                            icon={oneTab?.icon}
                            tooltip={oneTab?.tooltip}
                            action={oneTab.action}
                            onClick={(event, index) => handleClick(event, index, oneTab)}
                            sx={{ ...oneTab.sx }}
                        />
                      </React.Fragment>
                  }
                </React.Fragment>
            ))}
          </Stack>
        </Collapse>
      </Stack>
  )
}

export interface NavsTabContentProps {
  lstTabs: TabSection[];
  header?: React.ReactElement,
  onChange?: (newTabValue: number) => void;
  tabSize?: number,
  children?: React.ReactElement | React.ReactElement[];
  headerTab?: React.ReactElement | React.ReactElement[];
  alwaysSomeActiveTab?: boolean;
  checkShouldWarnBeforeSwitch?: boolean,
  insideOtherTabs?: boolean,
  actionInside?: ReactElement;
  keyTabPanelContainer?: string
}

type NavsTabVerticalFuncsOnChangeTab = {
    onDiscardTab?: (hasConfirmation: boolean) => void;
    onConfirmTab?: () => void;
};

export const NavsTabVerticalContext = React.createContext({
    setFuncsOnChangeTab: (funcs: NavsTabVerticalFuncsOnChangeTab) => { }
});

export function NavsTabVertical({ tabSize = 3, alwaysSomeActiveTab, insideOtherTabs, ...props}: NavsTabContentProps) {
  const classes = NavsTabStyles();
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { hasWritePermission } = useSecurityObject();
  const { shouldWarnBeforeSwitch, openConfirmDialog } = useApplicationCommon();
  const idTabPanelContainer = props.keyTabPanelContainer || 'tab-panel-container-to-scroll';
  const nameTabParam = insideOtherTabs ? 'subtab' : 'tab';

  const queryParams = useQuery();
  const tabParam = queryParams.get(nameTabParam);

  const lstTabsReduce: INavTab[] = props.lstTabs
    .map((section) => section.tabList)
    .reduce((pre, cur) => pre.concat(cur));
  
  const hasTabPermission = (tab: INavTab) =>
      ((!tab.securityComponent || !tab.securityObject || hasWritePermission(tab.securityComponent, tab.securityObject)))
      && !tab.disabled;
  
  const hasTabParam: boolean = !!tabParam;
  const hasDefault: boolean = lstTabsReduce.some((x) => x.default === true && hasTabPermission(x));
  const initialValue: number =
    hasTabParam ?
        (() => {
          const index = lstTabsReduce.findIndex(
              (x) => x.queryParam === tabParam && hasTabPermission(x)
          );
          return index !== -1 ? index : alwaysSomeActiveTab ? lstTabsReduce.findIndex(hasTabPermission) : valueTabNull;
        })()
        : 
        hasDefault ? 
            lstTabsReduce.findIndex((x) => x.default === true && hasTabPermission(x)) 
            : 
            alwaysSomeActiveTab ? 
                lstTabsReduce.findIndex(hasTabPermission) 
                :
                valueTabNull;
  
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [value, setValue] = useState<number>(initialValue);
  const [tabsOpen, setTabsOpen] = useState<number[]>(initialValue !== valueTabNull ? [initialValue] : []);
  
  const [funcsOnChangeTab, setFuncsOnChangeTab] = useState<NavsTabVerticalFuncsOnChangeTab>();

  const addQueryParam = (queryParam?: string) => {
      const searchParams = new URLSearchParams(window.location.search);

      if (queryParam) {
          searchParams.set(nameTabParam, queryParam);
      } else {
          searchParams.delete(nameTabParam);
      }

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

      // window.history.pushState({ path: newUrl }, '', newUrl);

      navigate(newUrl, {
          state: locationState,
          replace: true,
      });
  };
  
  const handleClick = (event: React.MouseEvent<HTMLElement>, indexValue: number, tab: INavTab) => {
      const tabIndex = lstTabsReduce.findIndex(x => x === tab);
      if (!!props.checkShouldWarnBeforeSwitch && tabIndex !== value) {
          if (shouldWarnBeforeSwitch) {
              openConfirmDialog({
                  onDiscard: () => {
                      (funcsOnChangeTab && funcsOnChangeTab.onDiscardTab) && funcsOnChangeTab.onDiscardTab(true);
                      onChangeTab(event, tab)
                  },
                  onConfirm: () => {
                      (funcsOnChangeTab && funcsOnChangeTab.onConfirmTab) && funcsOnChangeTab.onConfirmTab();
                      onChangeTab(event, tab)
                  }
              })
          } else {
              (funcsOnChangeTab && funcsOnChangeTab.onDiscardTab) && funcsOnChangeTab.onDiscardTab(false);
              onChangeTab(event, tab)
          }
      } else {
          onChangeTab(event, tab);
      }
  };
  
  const onChangeTab = (event: React.MouseEvent<HTMLElement>, tab: INavTab) => {
      setFuncsOnChangeTab(undefined);
      const tabIndex = lstTabsReduce.findIndex(x => x === tab);
      onHandleChange(event, tabIndex)
      if (tab.queryParam) {
          addQueryParam(tab.queryParam);
      }
  }
  
  const onHandleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    if (!tabsOpen.includes(newValue)) setTabsOpen([...tabsOpen, newValue]);
    props?.onChange && props.onChange(newValue);
    scrollToTop(idTabPanelContainer, window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Height])
  };
  
  useEffect(() => {
    if (initialValue !== value && initialValue !== valueTabNull && isFirstRender) {
      setIsFirstRender(false);
      setValue(initialValue);
      setTabsOpen(initialValue !== valueTabNull ? [initialValue] : [])
    }
  }, [initialValue]);

  useEffect(() => {
    const indexParam = lstTabsReduce.findIndex((x) => x.queryParam === tabParam && hasTabPermission(x))
    if (value !== indexParam && indexParam >= 0 && hasTabPermission(lstTabsReduce[indexParam])) {
      setValue(indexParam);
      if (!tabsOpen.includes(indexParam)) {
        setTabsOpen([...tabsOpen, indexParam]);
      }
    }
  }, [tabParam, props.lstTabs]);
  
  return (
    <NavsTabVerticalContext.Provider value={{ setFuncsOnChangeTab }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={tabSize}>
            <Stack spacing={2}>
              <Card>
                <Stack spacing={1}>
                  { props.header &&  <Box>{props.header}</Box> }            
                  
                  {
                    props.lstTabs.map((tab, sectionIndex) => (
                        (tab.securityObject && tab.securityComponent) ?
                            <SafetyComponent
                                componentName={tab.securityComponent}
                                objectName={tab.securityObject}
                                key={`navsTabVerticalTabSection_${sectionIndex}`}>
                              <NavTabSection tab={tab}
                                             sectionIndex={sectionIndex}
                                             value={value}
                                             handleClick={handleClick}
                                             lstTabs={props.lstTabs}
                              />
                            </SafetyComponent>
                            :
                            <NavTabSection tab={tab}
                                           sectionIndex={sectionIndex}
                                           value={value}
                                           handleClick={handleClick}
                                           lstTabs={props.lstTabs}
                            />
                    ))
                  }
                  {props.actionInside && props.actionInside}
                </Stack>
              </Card>
      
              {
                props.children ?
                  Array.isArray(props.children) ?
                    props.children.map((oneElement) => oneElement)
                    :
                    props.children
                  :
                  null
              }
            </Stack>
          </Grid>
          <Grid item xs={12} md={12 - tabSize} id={idTabPanelContainer} sx={{ scrollMarginTop: '100px' }}>
              { !!props.headerTab && props.headerTab }
              
            {props.lstTabs
                .map((section) => section.tabList)
                .reduce((pre, cur) => pre.concat(cur))
                .map((oneTab, index) => {
                  return (
                      <NavTabPanel
                          key={index}
                          value={value}
                          index={index}
                          wasOpened={tabsOpen.includes(index)}
                          content={oneTab.content}
                          shouldRender={oneTab.shouldRender}
                          alwaysRender={oneTab.alwaysRender}
                      />
                  );
                })}
          </Grid>
        </Grid>
    </NavsTabVerticalContext.Provider>  
  );
}

export interface NavsTabHorizontalContentProps {
  lstTabs: TabSection[];
  onChange?: (newTabValue: number) => void;
  alignLeft?: boolean;
  tabsProps?: TabsProps;
  fullWidth?: boolean;
  hideScroll?: boolean;
  action?: React.ReactNode;
  expandedHeaderWidth?: boolean;
}

export function NavsTabHorizontal(props: NavsTabHorizontalContentProps) {
  const classes = NavsTabStyles();
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const hasDefault: boolean = props.lstTabs
    .map((section) => section.tabList)
    .reduce((pre, cur) => pre.concat(cur))
    .some((x) => x.default === true);
  const initialValue: number = hasDefault
    ? props.lstTabs
        .map((section) => section.tabList)
        .reduce((pre, cur) => pre.concat(cur))
        .findIndex((x) => x.default === true)
    : valueTabNull;

  const [value, setValue] = useState<number>(initialValue);
  const [tabsOpen, setTabsOpen] = useState<number[]>(
    hasDefault ? [initialValue] : [],
  );

  const totalTabs = props.lstTabs
    .map((section) => section.tabList)
    .reduce((pre, cur) => pre.concat(cur))
    .length;

  useEffect(() => {
    const checkOverflow = () => {
      if (tabsContainerRef.current) {
        const container = tabsContainerRef.current;
        const tabs = container.querySelector('.MuiTabs-scroller');
        if (tabs) {
          setShowArrows(tabs.scrollWidth > tabs.clientWidth);
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  useEffect(() => {
    const newHasDefault: boolean = props.lstTabs
      .map((section) => section.tabList)
      .reduce((pre, cur) => pre.concat(cur))
      .some((x) => x.default === true);
    const newInitialValue: number = newHasDefault
      ? props.lstTabs
          .map((section) => section.tabList)
          .reduce((pre, cur) => pre.concat(cur))
          .findIndex((x) => x.default === true)
      : valueTabNull;
    if (newInitialValue !== valueTabNull && value === valueTabNull) {
      setValue(newInitialValue);
      if (!tabsOpen.includes(newInitialValue)) setTabsOpen([...tabsOpen, newInitialValue]);
    }
  }, [props.lstTabs]);

  const onHandleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    if (!tabsOpen.includes(newValue)) setTabsOpen([...tabsOpen, newValue]);
    props?.onChange && props.onChange(newValue);
  };

  const handleScrollButtonClick = (direction: 'left' | 'right') => {
    let newValue = value;
    if (direction === 'left' && value > 0) {
      newValue = value - 1;
    } else if (direction === 'right' && value < totalTabs - 1) {
      newValue = value + 1;
    }
    setValue(newValue);
    if (!tabsOpen.includes(newValue)) setTabsOpen([...tabsOpen, newValue]);
    props?.onChange && props.onChange(newValue);
  };
  
  return (
    <div style={{ width: props.fullWidth ? '100%' : '', position: 'relative' }}>
      <Box 
        className={classes.containerNavHorizontal}
        sx={{ 
          placeItems: props.alignLeft ? '' : 'center',
          overflow: 'visible',
          marginLeft: showArrows ? '-24px' : 0,
          width: showArrows ? 'calc(100% + 24px)' : '100%'
        }}
        ref={tabsContainerRef}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{
            flexWrap: 'wrap',
            overflow: 'visible',
            width: showArrows ? {
              xs: '123%', 
              sm: '112%', 
              md: '110%', 
              lg: '108%',
              '@media (min-width: 420px) and (max-width: 599px)': {
                width: '117%'  
              }
            } : '100%',
            position: showArrows ? 'relative' : 'static',
            left: showArrows ? { 
              xs: '-12%',
              sm: '-6%', 
              md: '-5%', 
              lg: '-3.5%',
              '@media (min-width: 420px) and (max-width: 599px)': {
                left: '-7.5%'  
              }
            } : '0',
            paddingLeft: showArrows ? '24px' : 0
          }}
        >
          {showArrows && totalTabs > 1 && (
            <IconButton
              onClick={() => handleScrollButtonClick('left')}
              disabled={value === 0}
              sx={{ 
                visibility: props.hideScroll ? 'hidden' : 'visible',
                marginLeft: { 
                  xs: '-8px', 
                  sm: '-4px',
                  '@media (min-width: 420px) and (max-width: 599px)': {
                    marginLeft: '-6px'  
                  }
                }
              }}
            >
              <ArrowLeft />
            </IconButton>
          )}
  
          <Box sx={{ 
            flex: 1, 
            minWidth: 0,
            marginLeft: showArrows ? { 
              xs: '8px', 
              sm: '4px',
              '@media (min-width: 420px) and (max-width: 599px)': {
                marginLeft: '6px'  
              }
            } : 0
          }}>
            <Tabs
              value={value}
              onChange={onHandleChange}
              centered={!props.alignLeft}
              variant={showArrows ? 'scrollable' : 'standard'}
              scrollButtons={false}
              allowScrollButtonsMobile={false}
              {...props.tabsProps}
              sx={{ 
                width: props.fullWidth ? '100%' : 'auto',
                '& .MuiTab-root': {
                  paddingLeft: showArrows ? '0 !important' : undefined,
                  justifyContent: 'flex-start'
                }
              }}
              data-cy={'navs-tab-horizontal-tabGroup'}
            >
              <Tab value={valueTabNull} className={classes.tabHiddenDefault} />
              {props.lstTabs.map((tab) =>
                tab.tabList.map((oneTab, index) => (
                  <Tab
                    key={index}
                    label={oneTab.label}
                    icon={oneTab?.icon ? <Box>{oneTab?.icon}</Box> : undefined}
                    iconPosition={oneTab?.iconPosition ?? 'top'}
                    disabled={oneTab?.disabled}
                    value={index}
                    sx={{ ...oneTab?.sx }}
                    data-cy={'navs-tab-horizontal-tab'}
                  />
                )),
              )}
            </Tabs>
          </Box>
  
          {showArrows && totalTabs > 1 && (
            <IconButton
              onClick={() => handleScrollButtonClick('right')}
              disabled={value === totalTabs - 1}
              sx={{ visibility: props.hideScroll ? 'hidden' : 'visible' }}
            >
              <ArrowRight />
            </IconButton>
          )}
  
          {props.action && <Box sx={{ flexShrink: 0, maxWidth: '100%', overflow: 'hidden' }} mt={'10px !important'}>{props.action}</Box>}
        </Stack>
      </Box>
  
      {props.lstTabs
        .map((section) => section.tabList)
        .reduce((pre, cur) => pre.concat(cur))
        .map((oneTab, index) => {
          return (
            <NavTabPanel
              key={index}
              value={value}
              index={index}
              wasOpened={tabsOpen.includes(index)}
              content={oneTab.content}
              sx={{ marginTop: 2 }}
              shouldRender={oneTab.shouldRender}
              alwaysRender={oneTab.alwaysRender}
            />
          );
        })}
    </div>
  );
}

type NavTabContextType = {
  setShouldWarnBeforeTabSwitch: (value: boolean) => void;
  onTabChange: () => void;
  setOnTabChange: React.Dispatch<React.SetStateAction<() => void>>;
};

interface NavsTabInsideHeaderProps extends NavsTabHorizontalContentProps {
  children?: React.ReactNode;
}

interface NavTabSubMenuSelected {
  [key: number]: number;
}

export function NavsTabInsideHeader(props: NavsTabInsideHeaderProps) {
  const classes = NavsTabStyles();
  
  const queryParams = useQuery();
  const tabParam = queryParams.get('tab');
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const lstTabsReduce: INavTab[] = props.lstTabs
    .map((section) => section.tabList)
    .reduce((pre, cur) => pre.concat(cur));
  const hasTabParam: boolean = !!tabParam;
  const hasDefault: boolean = lstTabsReduce.some((x) => x.default === true);
  const initialValue: number =
    hasTabParam && lstTabsReduce.some((x) => x.queryParam === tabParam)
      ? lstTabsReduce.findIndex((x) => x.queryParam === tabParam)
      : hasDefault
        ? lstTabsReduce.findIndex((x) => x.default === true)
        : valueTabNull;

  const [value, setValue] = useState<number>(initialValue);
  const [tabsOpen, setTabsOpen] = useState<number[]>(
    hasDefault ? [initialValue] : [],
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subvalueByIndex, setSubvalueByIndex] = useState<NavTabSubMenuSelected>(
    hasDefault && !!lstTabsReduce[initialValue].menu
      ? { [initialValue]: 0 }
      : {},
  );
  const [shouldWarnBeforeTabSwitch, setShouldWarnBeforeTabSwitch] =
    useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<number>();
  const [changeEvent, setChangeEvent] = useState<React.ChangeEvent<{}>>(
    {} as React.ChangeEvent,
  );

  const addQueryParam = (queryParam?: string) => {
    let newUrl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname;
    if (queryParam) newUrl = newUrl + `?tab=${queryParam}`;

    window.history.pushState({ path: newUrl }, '', newUrl);
    navigate(`?tab=${queryParam}` || '', {
      state: locationState,
      replace: true,
    });
  };

  useEffect(() => {
    const tabIndex = lstTabsReduce.findIndex((x) => x.queryParam === tabParam);
    if (tabIndex !== -1) {
      // @ts-ignore
      onHandleChange({}, tabIndex);
    }
  }, [queryParams]);

  const handleClick = (event: React.MouseEvent<HTMLElement>, tab: INavTab) => {
    if (tab.menu) setAnchorEl(event.currentTarget);
    if (tab.queryParam) {
      addQueryParam(tab.queryParam);
    }
  };

  const handleClickSubvalue = (
    index: number,
    subindex: number,
    queryParam?: string,
  ) => {
    let auxNavTabSubMenuSelected: NavTabSubMenuSelected = subvalueByIndex;
    auxNavTabSubMenuSelected[index] = subindex;
    setAnchorEl(null);
    setSubvalueByIndex(auxNavTabSubMenuSelected);

    addQueryParam(queryParam);
  };

  const onHandleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    setAnchorEl(null);
    if (!tabsOpen.includes(newValue)) setTabsOpen([...tabsOpen, newValue]);
    setShouldWarnBeforeTabSwitch(false);
  };

  const onHandleChange2 = (event: React.ChangeEvent<{}>, value: number) => {
    if (shouldWarnBeforeTabSwitch) {
      setNewValue(value);
      setChangeEvent(event);
      setShowConfirmDialog(true);
    } else {
      onHandleChange(event, value);
    }
  };

  const onConfirmTabSwitch = () => {
    if (newValue) {
      onHandleChange(changeEvent, newValue);
    }
    setShowConfirmDialog(false);
  };

  return (
    <div>
      <Card>
        {props.children && <CardContent>{props.children}</CardContent>}

        {props.children && (
          <Divider
            variant="middle"
            sx={{ marginTop: '10px', marginBottom: '-10px' }}
          />
        )}

        {props.action ? (
          <CardActions
            sx={{
              paddingBottom: 0,
              display: 'flex !important',
              justifyContent: 'space-between !important',
            }}
          >
            <Tabs
              value={value}
              onChange={(e, v) => onHandleChange(e, v)}
              variant="scrollable"
              textColor={'primary'}
              scrollButtons
              allowScrollButtonsMobile
            >
              <Tab value={valueTabNull} className={classes.tabHiddenDefault} />
              {props.lstTabs.map((tab) =>
                tab.tabList.map((oneTab, index) =>
                  oneTab.securityComponent && oneTab.securityObject ? (
                    <SafetyTabComponent
                      componentName={oneTab.securityComponent}
                      objectName={oneTab.securityObject}
                      key={`navsTabInsideHeaderTab_${index}`}
                      value={index}
                    >
                      <Tab
                        label={oneTab.label}
                        value={index}
                        tabIndex={index}
                        className={value === index ? 'Mui-selected' : ''}
                        sx={{
                          ...oneTab?.sx,
                          color: '#1565C0 !important',
                          '&:hover': {
                            backgroundColor: '#F1FAFF !important',
                            borderRadius: '10px 10px 0px 0px',
                          },
                          '&.Mui-selected': {
                            backgroundColor: '#F1FAFF !important',
                            borderRadius: '10px 10px 0px 0px',
                          },
                          mt: '4px',
                          p: 1,
                          minHeight: 0,
                        }}
                        disableTouchRipple
                        onClick={(e) => handleClick(e, oneTab)}
                        icon={oneTab.menu ? <ExpandMoreTwoTone /> : undefined}
                        iconPosition={oneTab.menu ? 'end' : undefined}
                      />
                    </SafetyTabComponent>
                  ) : (
                    <Tab
                      key={`navsTabInsideHeaderTab_${index}`}
                      label={oneTab.label}
                      value={index}
                      sx={{
                        ...oneTab?.sx,
                        minHeight: 0,
                      }}
                      disableTouchRipple
                      onClick={(e) => handleClick(e, oneTab)}
                      icon={oneTab.menu ? <ExpandMoreTwoTone /> : undefined}
                      iconPosition={oneTab.menu ? 'end' : undefined}
                    />
                  ),
                ),
              )}
            </Tabs>
            <div style={{ padding: '6px 0px' }}>{props.action}</div>
          </CardActions>
        ) : (
          <CardActions
            sx={{ justifyContent: 'left !important', paddingBottom: 0 }}
          >
            <Tabs
              value={value}
              onChange={(e, v) => onHandleChange(e, v)}
              variant="scrollable"
              textColor={'primary'}
              scrollButtons
              allowScrollButtonsMobile
            >
              <Tab value={valueTabNull} className={classes.tabHiddenDefault} />
              {props.lstTabs.map((tab) =>
                tab.tabList.map((oneTab, index) =>
                  oneTab.securityComponent && oneTab.securityObject ? (
                    <SafetyTabComponent
                      componentName={oneTab.securityComponent}
                      objectName={oneTab.securityObject}
                      key={`navsTabInsideHeaderTab_${index}`}
                      value={index}
                    >
                      <Tab
                        label={oneTab.label}
                        value={index}
                        tabIndex={index}
                        className={value === index ? 'Mui-selected' : ''}
                        sx={{
                          ...oneTab?.sx,
                          color: '#1565C0 !important',
                          '&:hover': {
                            backgroundColor: '#F1FAFF !important',
                            borderRadius: '10px 10px 0px 0px',
                          },
                          '&.Mui-selected': {
                            backgroundColor: '#F1FAFF !important',
                            borderRadius: '10px 10px 0px 0px',
                          },
                          mt: '4px',
                          p: 1,
                          minHeight: 0,
                        }}
                        disableTouchRipple
                        onClick={(e) => handleClick(e, oneTab)}
                        icon={oneTab.menu ? <ExpandMoreTwoTone /> : undefined}
                        iconPosition={oneTab.menu ? 'end' : undefined}
                      />
                    </SafetyTabComponent>
                  ) : (
                    <Tab
                      key={`navsTabInsideHeaderTab_${index}`}
                      label={oneTab.label}
                      value={index}
                      sx={{
                        ...oneTab?.sx,
                        minHeight: 0,
                      }}
                      disableTouchRipple
                      onClick={(e) => handleClick(e, oneTab)}
                      icon={oneTab.menu ? <ExpandMoreTwoTone /> : undefined}
                      iconPosition={oneTab.menu ? 'end' : undefined}
                    />
                  ),
                ),
              )}
            </Tabs>
          </CardActions>
        )}
      </Card>

      {lstTabsReduce.map((oneTab, index) => {
        return (
          <NavTabPanel
            key={index}
            value={value}
            menu={oneTab.menu}
            index={index}
            wasOpened={tabsOpen.includes(index)}
            content={oneTab.content}
            sx={{ marginTop: 2 }}
            shouldRender={oneTab.shouldRender}
            alwaysRender={oneTab.alwaysRender}
            anchorEl={anchorEl}
            subvalue={subvalueByIndex[index] || 0}
            handleClick={handleClickSubvalue}
            handleClose={() => setAnchorEl(null)}
          />
        );
      })}

      <Box mt={5} />
      <DialogAlert
        open={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
        }}
        onConfirm={onConfirmTabSwitch}
        textContent={`¿Estás seguro que deseás cambiar de pestaña? Los cambios no guardados se perderán.`}
      />
    </div>
  );
}


interface NavsTabInsideAppBarProps {
    title: string;
    tabList: INavTab[];
    onChange?: (newTabValue: number) => void;
    titleAction?: React.ReactNode;
    tabAction?: React.ReactNode;
    tabsProps?: TabsProps;
    alwaysSomeActiveTab?: boolean
}

export function NavsTabInsideAppBar({ alwaysSomeActiveTab, ...props}: NavsTabInsideAppBarProps) {
    const classes = NavsTabStyles();
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showArrows, setShowArrows] = useState(false);
    const routerDomNavigate = useNavigate();
    const { hasWritePermission } = useSecurityObject();
    const queryParams = useQuery();
    const tabParam = queryParams.get('tab');

    const paddingTopContent = useMemo(() => {
        let paddingBase = '110px';

        if (isMobile && !!props.tabAction)
            paddingBase = '150px';
        
        return `calc(${paddingBase} + 20px)`;
    }, [isMobile, props.tabAction]);    
    
    const hasTabPermission = (tab: INavTab) =>
        ((!tab.securityComponent || !tab.securityObject || hasWritePermission(tab.securityComponent, tab.securityObject)))
        && !tab.disabled;

    const lstTabsReduce: INavTab[] = props.tabList.filter((x) => hasTabPermission(x));
    const totalTabs = lstTabsReduce.length;
    
    const hasTabParam: boolean = !!tabParam;
    const hasDefault: boolean = lstTabsReduce.some((x) => x.default === true);
    const initialValue: number =
        hasTabParam ?
            (() => {
                const index = lstTabsReduce.findIndex((x) => x.queryParam === tabParam);
                return index !== -1 ? index : alwaysSomeActiveTab ? lstTabsReduce.findIndex(hasTabPermission) : valueTabNull;
            })()
            :
            hasDefault ?
                lstTabsReduce.findIndex((x) => x.default === true)
                :
                alwaysSomeActiveTab ?
                    lstTabsReduce.findIndex(hasTabPermission)
                    :
                    valueTabNull;
    
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const [value, setValue] = useState<number>(initialValue);
    const [tabsOpen, setTabsOpen] = useState<number[]>(initialValue !== valueTabNull ? [initialValue] : []);

    useEffect(() => {
        const checkOverflow = () => {
            if (tabsContainerRef.current) {
                const container = tabsContainerRef.current;
                const tabs = container.querySelector('.MuiTabs-scroller');
                if (tabs) {
                    setShowArrows(tabs.scrollWidth > tabs.clientWidth);
                }
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    const addQueryParam = async (queryParam?: string) => {
        let newUrl =
            window.location.protocol +
            '//' +
            window.location.host +
            window.location.pathname;
        if (queryParam) newUrl = newUrl + `?tab=${queryParam}`;

        window.history.replaceState({ path: newUrl }, '', newUrl);
    };

    const onHandleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
        if (!tabsOpen.includes(newValue)) setTabsOpen([...tabsOpen, newValue]);
        props?.onChange && props.onChange(newValue);
        
        const tab = lstTabsReduce[newValue];
        if (tab && tab.queryParam) {
            addQueryParam(tab.queryParam);
        }
    };    

    const handleScrollButtonClick = (direction: 'left' | 'right') => {
        let newValue = value;
        if (direction === 'left' && value > 0) {
            newValue = value - 1;
        } else if (direction === 'right' && value < totalTabs - 1) {
            newValue = value + 1;
        }
        setValue(newValue);
        if (!tabsOpen.includes(newValue)) setTabsOpen([...tabsOpen, newValue]);
        props?.onChange && props.onChange(newValue);
    };
    
    const onClickBackButton = () => routerDomNavigate(-1);

    useEffect(() => {
        if (initialValue !== value && initialValue !== valueTabNull && isFirstRender) {
            setIsFirstRender(false);
            setValue(initialValue);
            setTabsOpen(initialValue !== valueTabNull ? [initialValue] : [])
        }
    }, [initialValue]);

    useEffect(() => {
        const currentTabParam = new URLSearchParams(window.location.search).get('tab');
        const indexParam = lstTabsReduce.findIndex((x) => x.queryParam === currentTabParam && hasTabPermission(x))
        if (value !== indexParam && indexParam >= 0 && hasTabPermission(lstTabsReduce[indexParam])) {
            setValue(indexParam);
            if (!tabsOpen.includes(indexParam)) {
                setTabsOpen([...tabsOpen, indexParam]);
            }
        }
    }, [tabParam, props.tabList]);
    
    return (
        <Box sx={{ position: 'relative' }}>
            <Container>
                <AppBarBase title={props.title}
                            hideLogo
                            fitBottom>
                    <AppBarBase.Left>
                        <Button variant={'outlined'}
                                color={'secondary'}
                                size={'small'}
                                startIcon={<Undo2Icon />}
                                onClick={onClickBackButton}
                        >
                            Volver
                        </Button>
                    </AppBarBase.Left>

                    {
                        !!props.titleAction &&
                            <AppBarBase.Right>
                                {props.titleAction}
                            </AppBarBase.Right>
                    }

                    <AppBarBase.Bottom>
                        {
                            isMobile && props.tabAction && 
                                <Stack width={1}>
                                    <Box alignSelf={'center'}>
                                        {props.tabAction}
                                    </Box>
                                </Stack>
                        }
                        
                        <Box position={'relative'} width={'100%'}>
                            <Box
                                className={classes.containerNavHorizontal}
                                sx={{
                                    overflow: 'visible',
                                    marginLeft: showArrows ? '-24px' : 0,
                                    width: showArrows ? 'calc(100% + 24px)' : '100%'
                                }}
                                ref={tabsContainerRef}
                            >
                                <Stack
                                    direction={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    sx={{
                                        flexWrap: 'wrap',
                                        overflow: 'visible',
                                        width: showArrows ? {
                                            xs: '123%',
                                            sm: '112%',
                                            md: '110%',
                                            lg: '108%',
                                            '@media (min-width: 420px) and (max-width: 599px)': {
                                                width: '117%'
                                            }
                                        } : '100%',
                                        position: showArrows ? 'relative' : 'static',
                                        left: showArrows ? {
                                            xs: '-12%',
                                            sm: '-6%',
                                            md: '-5%',
                                            lg: '-3.5%',
                                            '@media (min-width: 420px) and (max-width: 599px)': {
                                                left: '-7.5%'
                                            }
                                        } : '0',
                                        paddingLeft: showArrows ? '24px' : 0
                                    }}
                                >

                                    {
                                        !isMobile && props.tabAction &&
                                            <Box>
                                                {props.tabAction}
                                            </Box>
                                    }
                                    
                                    {showArrows && totalTabs > 1 && (
                                        <IconButton
                                            onClick={() => handleScrollButtonClick('left')}
                                            disabled={value === 0}
                                            sx={{
                                                visibility: 'visible',
                                                marginLeft: {
                                                    xs: '-8px',
                                                    sm: '-4px',
                                                    '@media (min-width: 420px) and (max-width: 599px)': {
                                                        marginLeft: '-6px'
                                                    }
                                                }
                                            }}
                                        >
                                            <ArrowLeft />
                                        </IconButton>
                                    )}

                                    <Box sx={{
                                        flex: 1,
                                        minWidth: 0,
                                        marginLeft: showArrows ? {
                                            xs: '8px',
                                            sm: '4px',
                                            '@media (min-width: 420px) and (max-width: 599px)': {
                                                marginLeft: '6px'
                                            }
                                        } : 0
                                    }}>
                                        <Tabs
                                          value={value}
                                          onChange={onHandleChange}
                                          variant={showArrows ? 'scrollable' : 'standard'}
                                          scrollButtons={false}
                                          allowScrollButtonsMobile={false}
                                          {...props.tabsProps}
                                          sx={{
                                            width: '100%',
                                            '& .MuiTab-root': {
                                              paddingLeft: showArrows ? '0 !important' : undefined,
                                              justifyContent: 'center'
                                            }
                                          }}
                                          data-cy={'navs-tab-horizontal-tabGroup'}
                                        >
                                          <Tab value={valueTabNull} className={classes.tabHiddenDefault} />
                                          {
                                              lstTabsReduce.map((oneTab, index) => (
                                                  <Tab
                                                      key={index}
                                                      label={oneTab.label}
                                                      icon={oneTab?.icon ? <Box>{oneTab?.icon}</Box> : undefined}
                                                      iconPosition={oneTab?.iconPosition ?? 'start'}
                                                      disabled={oneTab?.disabled}
                                                      value={index}
                                                      sx={{ ...oneTab?.sx }}
                                                     /* onClick={(event) => handleClick(event, oneTab)}*/
                                                      data-cy={'navs-tab-horizontal-tab'}
                                                  />
                                              ))
                                          }
                                        </Tabs>
                                    </Box>

                                    {showArrows && totalTabs > 1 && (
                                        <IconButton
                                            onClick={() => handleScrollButtonClick('right')}
                                            disabled={value === totalTabs - 1}
                                            sx={{ visibility: 'visible' }}
                                        >
                                            <ArrowRight />
                                        </IconButton>
                                    )}
                                </Stack>
                            </Box>
                        </Box>
                    </AppBarBase.Bottom>
                </AppBarBase>

                <Box pt={paddingTopContent}
                     pb={4}>
                    {lstTabsReduce
                        .map((oneTab, index) => {
                            return (
                                <NavTabPanel
                                    key={index}
                                    value={value}
                                    index={index}
                                    wasOpened={tabsOpen.includes(index)}
                                    content={oneTab.content}
                                    sx={{ marginTop: 2 }}
                                    shouldRender={oneTab.shouldRender}
                                    alwaysRender={oneTab.alwaysRender}
                                />
                            );
                        })}
                    
                    <Outlet/>
                </Box>
            </Container>

            <ScrollTop />
        </Box>
    )
}
