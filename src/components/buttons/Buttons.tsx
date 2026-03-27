import React, { useState } from 'react';
import {
    Badge,
    Box,
    Button,
    ButtonProps,
    IconButton,
    IconButtonProps, ListItemIcon,
    Menu,
    MenuItem,
    Stack,
    SxProps,
    Tooltip,
    Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import CheckIcon from '@mui/icons-material/Check';
import LoopIcon from '@mui/icons-material/Loop';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import SaveIcon from '@mui/icons-material/Save';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BusinessIcon from '@mui/icons-material/Business';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ButtonsStyles, {
  EditButtonDataProps,
  EditButtonLabelProps,
} from './Buttons.styles';
import { DataWithLabel } from '../misc/DataWithLabel';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import ShareIcon from '@mui/icons-material/Share';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import DoneIcon from '@mui/icons-material/Done';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {ExpandMoreTwoTone, SearchRounded} from '@mui/icons-material';
import UploadIcon from '@mui/icons-material/Upload';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import UpdateIcon from '@mui/icons-material/Update';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import { Theme } from '@mui/material/styles';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {WrapperIcons} from "../icons/Icons";
import {
  ArrowUpRight,
  Heart,
  ShareNetwork,
  ShareFat, FloppyDisk, X
} from "@phosphor-icons/react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {UserInfoSummaryFields} from "../../types/user";
import {ArrowFatRight, ArrowLeft, Bookmark, BookmarkSimple, DotsThreeVertical, Paperclip} from "phosphor-react";
import {
  ArrowRightIcon,
  BellIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilLineIcon,
  PlusIcon,
  SendIcon,
  Trash2Icon,
  XIcon,
  PencilIcon,
  TrashIcon
} from "lucide-react";

interface ButtonWithTooltipProps extends ButtonProps {
  tooltipTitle?: string;
  end?: boolean;
}

interface IconButtonWithTooltipProps extends IconButtonProps {
  tooltipTitle?: string;
}


interface ButtonXsProps extends ButtonProps {
  fontSize?: number
}

export function DefaultStylesButton({ tooltipTitle, ...props }: ButtonWithTooltipProps) {
  return (
      <React.Fragment>
        {tooltipTitle ? 
            <Tooltip title={tooltipTitle}>
              <Box>
                <Button variant="contained" color="primary" size="medium" {...props}>
                  {props.children}
                </Button>
              </Box>
            </Tooltip>
            :
            <Button variant="contained" color="primary" size="medium" {...props}>
              {props.children}
            </Button>
        }
      </React.Fragment>
  );
}

function IconButtonBase(props: IconButtonProps) {
  const { children, ...otherProps } = props;

  return (
    <IconButton {...otherProps}>
      {children}
    </IconButton>
  );
}


export const ButtonXs = (props : ButtonXsProps) => {
  return (
      <Box sx={{ cursor: 'pointer', border: '1px solid #4DAB2B', color: '#4DAB2B !important', borderRadius: '100px', padding: '4px !important', '&:hover': {backgroundColor: '#4DAB2B', color: 'white !important'} }} {...props}>
        <Typography fontSize={props.fontSize ?? 8} textAlign={'center'}>{props.children}</Typography>
      </Box>
      )
}

export function AddButton({ tooltipTitle, ...props }: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton
              color={'primary'}
              startIcon={<PlusIcon />}
              {...props}
            >
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton
          color={'primary'}
          startIcon={<PlusIcon />}
          {...props}
        >
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
}

export function SendButton({ tooltipTitle, ...props }: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton
              endIcon={<KeyboardDoubleArrowRightIcon />}
              {...props}
            >
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton
          endIcon={<KeyboardDoubleArrowRightIcon />}
          {...props}
        >
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
}


export function SendButtonNew({ tooltipTitle, ...props }: ButtonWithTooltipProps) {
  return (
      <>
        {tooltipTitle ? (
            <Tooltip title={tooltipTitle}>
              <Box>
                <DefaultStylesButton
                    startIcon={<SendIcon />}
                    {...props}
                >
                  {props.children}
                </DefaultStylesButton>
              </Box>
            </Tooltip>
        ) : (
            <DefaultStylesButton
                startIcon={<SendIcon />}
                {...props}
            >
              {props.children}
            </DefaultStylesButton>
        )}
      </>
  );
}

export function ConfirmButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton startIcon={<CheckIcon />} {...props}>
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton startIcon={<CheckIcon />} {...props}>
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
}

export function SaveButton({ tooltipTitle, ...props }: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton
              variant="contained"
              startIcon={<SaveIcon />}
              {...props}
            >
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton
          variant="contained"
          startIcon={<SaveIcon />}
          {...props}
        >
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
}

export const UpdateButton = ({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) => {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton
              variant="contained"
              startIcon={<LoopIcon />}
              {...props}
            >
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton
          variant="contained"
          startIcon={<LoopIcon />}
          {...props}
        >
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
};

export function DeleteButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton
              startIcon={<DeleteOutlineIcon />}
              color={'error'}
              variant={'outlined'}
              {...props}
            >
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton
          startIcon={<DeleteOutlineIcon />}
          color={'error'}
          variant={'outlined'}
          {...props}
        >
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
}

export const CleanFilterButton = ({
                                    tooltipTitle,
                                    end,
                                    ...props
                                  }: ButtonWithTooltipProps) => {

  return (
      <>
        {tooltipTitle ? (
            <Tooltip title={tooltipTitle}>
              <Box>
                <DefaultStylesButton
                    color={'primary'}
                    variant={'contained'}
                    startIcon={!end && <FilterAltOffOutlinedIcon />}
                    endIcon={end && <FilterAltOffOutlinedIcon />}
                    {...props}
                >
                  {props.children}
                </DefaultStylesButton>
              </Box>
            </Tooltip>
        ) : (
            <DefaultStylesButton
                color={'primary'}
                startIcon={<FilterAltOffOutlinedIcon />}
                {...props}
            >
              {props.children}
            </DefaultStylesButton>
        )}
      </>
  );
}

export function SearchButton({
  tooltipTitle,
  end,
  ...props
}: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton
              color={'primary'}
              variant={'contained'}
              startIcon={!end && <SearchRounded />}
              endIcon={end && <SearchRounded />}
              {...props}
            >
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton
          color={'primary'}
          startIcon={<SearchRounded />}
          {...props}
        >
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
}

export function EditButton({ tooltipTitle, ...props }: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton
              color={'primary'}
              startIcon={<EditOutlinedIcon />}
              {...props}
            >
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton
          color={'primary'}
          startIcon={<EditOutlinedIcon />}
          {...props}
        >
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
}

export function DownloadButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton
              color={'primary'}
              startIcon={<FileDownloadOutlinedIcon />}
              {...props}
            >
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton
          color={'primary'}
          startIcon={<FileDownloadOutlinedIcon />}
          {...props}
        >
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
}

export function CloseButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton
              startIcon={<CloseRoundedIcon />}
              {...props}
            >
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton
          startIcon={<CloseRoundedIcon />}
          {...props}
        >
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
}

export function ShareButton({ tooltipTitle, ...props }: ButtonWithTooltipProps) {
  return (
      <>
        {tooltipTitle ? (
            <Tooltip title={tooltipTitle}>
              <Box>
                <DefaultStylesButton
                    color={'primary'}
                    startIcon={<ShareIcon />}
                    {...props}
                >
                  {props.children}
                </DefaultStylesButton>
              </Box>
            </Tooltip>
        ) : (
            <DefaultStylesButton
                color={'primary'}
                startIcon={<ShareIcon />}
                {...props}
            >
              {props.children}
            </DefaultStylesButton>
        )}
      </>
  );
}

export function BackButton({ tooltipTitle, ...props }: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <DefaultStylesButton
              color={'primary'} variant={'text'}
              startIcon={<KeyboardBackspaceOutlinedIcon />}
              {...props}
            >
              {props.children}
            </DefaultStylesButton>
          </Box>
        </Tooltip>
      ) : (
        <DefaultStylesButton
          color={'primary'} variant={'text'}
          startIcon={<KeyboardBackspaceOutlinedIcon />}
          {...props}
        >
          {props.children}
        </DefaultStylesButton>
      )}
    </>
  );
}

export function NextButton({ tooltipTitle, ...props }: ButtonWithTooltipProps) {
  const iconRightArrow = <KeyboardBackspaceOutlinedIcon style={{ transform: "rotate(180deg)" }} />;
  
  return (
      <>
        {tooltipTitle ? (
            <Tooltip title={tooltipTitle}>
              <Box>
                <DefaultStylesButton
                    color={'primary'}
                    endIcon={iconRightArrow}
                    {...props}
                >
                  {props.children}
                </DefaultStylesButton>
              </Box>
            </Tooltip>
        ) : (
            <DefaultStylesButton
                color={'primary'}
                endIcon={iconRightArrow}
                {...props}
            >
              {props.children}
            </DefaultStylesButton>
        )}
      </>
  );
}


export function NextButtonNew({ tooltipTitle, ...props }: ButtonWithTooltipProps) {

  return (
      <>
        {tooltipTitle ? (
            <Tooltip title={tooltipTitle}>
              <Box>
                <DefaultStylesButton
                    color={'primary'}
                    endIcon={<ArrowRightIcon />}
                    {...props}
                >
                  {props.children}
                </DefaultStylesButton>
              </Box>
            </Tooltip>
        ) : (
            <DefaultStylesButton
                color={'primary'}
                endIcon={<ArrowRightIcon />}
                {...props}
            >
              {props.children}
            </DefaultStylesButton>
        )}
      </>
  );
}

export function DiagonalArrowButton({ tooltipTitle, ...props }: ButtonWithTooltipProps) {
  const iconRightArrow = <WrapperIcons Icon={ArrowUpRight} />;

  return (
      <>
        {tooltipTitle ? (
            <Tooltip title={tooltipTitle}>
              <Box>
                <DefaultStylesButton
                    color={'primary'}
                    endIcon={iconRightArrow}
                    {...props}
                >
                  {props.children}
                </DefaultStylesButton>
              </Box>
            </Tooltip>
        ) : (
            <DefaultStylesButton
                color={'primary'}
                endIcon={iconRightArrow}
                {...props}
            >
              {props.children}
            </DefaultStylesButton>
        )}
      </>
  );
}

export function DefaultDarkGreyButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <Button
              className={classes.darkGreyButton}
              variant="contained"
              size="medium"
              {...props}
            >
              {props.children}
            </Button>
          </Box>
        </Tooltip>
      ) : (
        <Button
          className={classes.darkGreyButton}
          variant="contained"
          size="medium"
          {...props}
        >
          {props.children}
        </Button>
      )}
    </>
  );
}

export function DefaultGreenButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <Button
              className={classes.greenButton}
              variant="contained"
              size="medium"
              {...props}
            >
              {props.children}
            </Button>
          </Box>
        </Tooltip>
      ) : (
        <Button
          className={classes.greenButton}
          variant="contained"
          size="medium"
          {...props}
        >
          {props.children}
        </Button>
      )}
    </>
  );
}

export function DefaultButtonBanner({
  tooltipTitle,
  color,
  ...props
}: ButtonWithTooltipProps) {
  const classes = ButtonsStyles();
  const isSelected: boolean = color === 'secondary';

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={
                isSelected ? (
                  <DoneIcon sx={{ fontSize: '0.8125rem !important' }} />
                ) : undefined
              }
              className={
                isSelected ? classes.bannerButtonSelected : classes.bannerButton
              }
              {...props}
            >
              {props.children}
            </Button>
          </Box>
        </Tooltip>
      ) : (
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={
            isSelected ? (
              <DoneIcon sx={{ fontSize: '0.8125rem !important' }} />
            ) : undefined
          }
          className={
            isSelected ? classes.bannerButtonSelected : classes.bannerButton
          }
          {...props}
        >
          {props.children}
        </Button>
      )}
    </>
  );
}


export const ShowFilterIconButton = ({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) => {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <FilterListIcon color={'primary'} fontSize={'small'} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <FilterListIcon color={'primary'} fontSize={'small'} />
        </IconButtonBase>
      )}
    </>
  );
};

export const HideFilterIconButton = ({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) => {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <FilterListOffIcon color={'primary'} fontSize={'small'} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <FilterListOffIcon color={'primary'} fontSize={'small'} />
        </IconButtonBase>
      )}
    </>
  );
};

export const SavedIconButton = ({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) => {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase {...props}>
              <SavedSearchIcon color={'primary'} fontSize="large" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase {...props}>
          <SavedSearchIcon color={'primary'} fontSize="large" />
        </IconButtonBase>
      )}
    </>
  );
};

export const SearchIconButton = ({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) => {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <SearchIcon color="primary" fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <SearchIcon color="primary" fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
};

export const SearchDocumentIconButton = ({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) => {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <FindInPageIcon color="primary" fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <FindInPageIcon color="primary" fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
};

export const SaveIconButton = ({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) => {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
                {...props}
                className={`${props.className}`}>
              <WrapperIcons Icon={FloppyDisk} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
            {...props}
            className={`${props.className}`}>
          <WrapperIcons Icon={FloppyDisk} />
        </IconButtonBase>
      )}
    </>
  );
};

export function EditIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();
  
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
                {...props}
                className={`${classes.iconButton} ${props.className}`}
            >
              <WrapperIcons Icon={PencilLineIcon} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${props.className}`}
        >
          <WrapperIcons Icon={PencilLineIcon} />
        </IconButtonBase>
      )}
    </>
  );
}


export function Edit2IconButton({
                                 tooltipTitle,
                                 ...props
                               }: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButton
              {...props}
              className={`${classes.iconButton} ${props.className}`}
              sx={{ width: '36px', height: '36px', padding: '10px', ...props.sx }}
            >
              <WrapperIcons Icon={PencilIcon} size={16} />
            </IconButton>
          </Box>
        </Tooltip>
      ) : (
        <IconButton
          {...props}
          className={`${classes.iconButton} ${props.className}`}
          sx={{ width: '36px', height: '36px', padding: '10px', ...props.sx }}
        >
          <WrapperIcons Icon={PencilIcon} size={16} />
        </IconButton>
      )}
    </>
  );
}


export const AttachButton = ({
                               tooltipTitle,
                               color,
                               ...props
                             }: ButtonWithTooltipProps) => {
  
  return (
      <>
        {tooltipTitle ? (
            <Tooltip title={tooltipTitle}>
              <Box>
                <DefaultStylesButton
                    color={'inherit'}
                    variant={'contained'}
                    startIcon={<WrapperIcons Icon={Paperclip} size={'md'} />}
                    {...props}
                >
                  {props.children}
                </DefaultStylesButton>
              </Box>
            </Tooltip>
        ) : (
            <DefaultStylesButton
                color={'inherit'}
                startIcon={<WrapperIcons Icon={Paperclip} size={'md'} />}
                {...props}
            >
              {props.children}
            </DefaultStylesButton>
        )}
      </>
  )
}


export function CloseIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <WrapperIcons Icon={X} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <WrapperIcons Icon={X} />
        </IconButtonBase>
      )}
    </>
  );
}

export function RefreshIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <RefreshIcon fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <RefreshIcon fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
}

export const AddBoxIconButton = ({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) => {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase {...props}>
              <AddBoxIcon color="primary" fontSize={'large'} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase {...props}>
          <AddBoxIcon color="primary" fontSize={'large'} />
        </IconButtonBase>
      )}
    </>
  );
};

export function ConfirmIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase {...props}>
              <CheckIcon fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase {...props}>
          <CheckIcon fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
}

export function DeleteIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <WrapperIcons Icon={Trash2Icon} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <WrapperIcons Icon={Trash2Icon} />
        </IconButtonBase>
      )}
    </>
  );
}


export function Delete2IconButton({
                                   tooltipTitle,
                                   color = 'error',
                                   variant = 'outlined',
                                   ...props
}: IconButtonWithTooltipProps & { variant?: 'outlined' | 'contained' }) {
  const classes = ButtonsStyles({ color });

  const buttonClass = `${classes.iconButton} ${variant === 'outlined' ? classes.outlinedButton : ''} ${props.className || ''}`;

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButton
              {...props}
              className={buttonClass}
              color={color}
              sx={{ width: '36px', height: '36px', padding: '10px', ...props.sx }}
            >
              <WrapperIcons Icon={TrashIcon} color={color} size={16} />
            </IconButton>
          </Box>
        </Tooltip>
      ) : (
        <IconButton
          {...props}
          className={buttonClass}
          color={color}
          sx={{ width: '36px', height: '36px', padding: '10px', ...props.sx }}
        >
          <WrapperIcons Icon={TrashIcon} color={color} size={16} />
        </IconButton>
      )}
    </>
  );
}

export function CheckIconButton({
                                   tooltipTitle,
                                   ...props
                                 }: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
      <>
        {tooltipTitle ? (
            <Tooltip title={tooltipTitle}>
              <Box>
                <IconButtonBase
                    {...props}
                    className={`${classes.iconButton} ${props.className}`}
                >
                  <WrapperIcons Icon={CheckIcon} />
                </IconButtonBase>
              </Box>
            </Tooltip>
        ) : (
            <IconButtonBase
                {...props}
                className={`${classes.iconButton} ${props.className}`}
            >
              <WrapperIcons Icon={CheckIcon} />
            </IconButtonBase>
        )}
      </>
  );
}


export function XIconButton({
                                  tooltipTitle,
                                  ...props
                                }: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
      <>
        {tooltipTitle ? (
            <Tooltip title={tooltipTitle}>
              <Box>
                <IconButtonBase
                    {...props}
                    className={`${classes.iconButton} ${props.className}`}
                >
                  <WrapperIcons Icon={XIcon} />
                </IconButtonBase>
              </Box>
            </Tooltip>
        ) : (
            <IconButtonBase
                {...props}
                className={`${classes.iconButton} ${props.className}`}
            >
              <WrapperIcons Icon={XIcon} />
            </IconButtonBase>
        )}
      </>
  );
}

export function DetailPersonIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase {...props}>
              <PersonSearchOutlinedIcon fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase {...props}>
          <PersonSearchOutlinedIcon fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
}

export function DetailPymeIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase {...props}>
              <ContentPasteSearchOutlinedIcon fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase {...props}>
          <ContentPasteSearchOutlinedIcon fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
}

interface DetailLineIconButtonProps extends IconButtonWithTooltipProps {
  fontSize?: 'small' | 'inherit' | 'medium' | 'large';
}

export function DetailLineIconButton({
  fontSize = 'small',
  tooltipTitle,
  ...props
}: DetailLineIconButtonProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <SearchIcon fontSize="small" color="primary" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <Box>
          <IconButtonBase
            {...props}
            className={`${classes.iconButton} ${props.className}`}
          >
            <SearchIcon fontSize="small" color="primary" />
          </IconButtonBase>
        </Box>
      )}
    </>
  );
}

export function DownloadIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <FileDownloadOutlinedIcon color={"primary"} fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          color={"secondary"}
          className={`${classes.iconButton} ${props.className}`}
        >
          <FileDownloadOutlinedIcon color={"primary"} fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
}

export function ShareIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <CreateNewFolderIcon fontSize="small" color={'primary'} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <CreateNewFolderIcon fontSize="small" color={'primary'} />
        </IconButtonBase>
      )}
    </>
  );
}

export function ShareNetworkIconButton({
                                  tooltipTitle,
                                  ...props
                                }: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();
  return (
      <>
        {tooltipTitle ? (
            <Tooltip title={tooltipTitle}>
              <Box>
                <IconButtonBase
                    className={`${classes.iconButton} ${props.className}`}
                    {...props}
                >
                  <WrapperIcons Icon={ShareNetwork} />
                </IconButtonBase>
              </Box>
            </Tooltip>
        ) : (
            <IconButtonBase
                {...props}
                className={`${classes.iconButton} ${props.className}`}
            >
              <WrapperIcons Icon={ShareNetwork} />
            </IconButtonBase>
        )}
      </>
  );
}

export function SocialShareIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase {...props}>
              <WrapperIcons Icon={ShareFat} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase {...props}>
          <WrapperIcons Icon={ShareFat} />
        </IconButtonBase>
      )}
    </>
  );
}

export function UploadIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <div>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <UploadIcon fontSize="small" color="primary" />
            </IconButtonBase>
          </div>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <UploadIcon fontSize="small" color="primary" />
        </IconButtonBase>
      )}
    </>
  );
}

export const ForwardIconButton = ({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) => {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <div>
            <IconButtonBase
                {...props}
                className={`${classes.iconButton} ${props.className}`}
            >
              <WrapperIcons Icon={ArrowFatRight} color={"primary"}/>
            </IconButtonBase>
          </div>
        </Tooltip>
      ) : (
          <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
          >
            <WrapperIcons Icon={ArrowFatRight} color={"primary"}/>
          </IconButtonBase>
      )}
    </>
  );
};

export const UpdateIconButton = ({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) => {
  const classes = ButtonsStyles();

  return (
    <Tooltip title={tooltipTitle || 'Actualizar'}>
      <div>
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <UpdateIcon fontSize="small" color="primary" />
        </IconButtonBase>
      </div>
    </Tooltip>
  );
};

export const BusinessIconButton = ({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) => {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <BusinessIcon color="primary" fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <BusinessIcon color="primary" fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
};


export function StarEmptyIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <Tooltip title={tooltipTitle || 'Establecer como actividad principal'}>
      <div>
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <StarOutlineOutlinedIcon fontSize="small" color="primary" />
        </IconButtonBase>
      </div>
    </Tooltip>
  );
}

export function StarFilledIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <StarIcon fontSize="small" color="primary" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase
          {...props}
          className={`${classes.iconButton} ${props.className}`}
        >
          <StarIcon fontSize="small" color="primary" />
        </IconButtonBase>
      )}
    </>
  );
}

export function MarkAsImportantEmptyButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();
  
  return (
    <Tooltip title={tooltipTitle || 'Marcar como importante'}>
      <div>
        <IconButtonBase
            {...props}
            className={`${classes.iconButton} ${props.className}`}
        >
          <WrapperIcons Icon={BookmarkSimple} color={"primary"}/>
        </IconButtonBase>
      </div>
    </Tooltip>
  );
}

export function MarkAsImportantFilledButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();
  
  return (
    <>
      {tooltipTitle ? (
          <Tooltip title={tooltipTitle}>
            <div>
              <IconButtonBase
                  {...props}
                  className={`${classes.iconButton} ${props.className}`}
              >
                <WrapperIcons Icon={Bookmark} color={"primary"} weight={"fill"}/>
              </IconButtonBase>
            </div>
          </Tooltip>
      ) : (
          <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
          >
            <WrapperIcons Icon={Bookmark} color={"primary"}/>
          </IconButtonBase>
      )}
    </>
  );
}

export function MarkAsReadEmptyButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <Tooltip title={tooltipTitle || 'Marcar como leído'}>
      <div>
        <IconButtonBase {...props}>
          <DraftsOutlinedIcon fontSize="small" color={'primary'}/>
        </IconButtonBase>
      </div>
    </Tooltip>
  );
}

export function MarkAsReadFilledButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <Tooltip title={tooltipTitle || 'Marcar como no leído'}>
      <Box>
        <IconButtonBase {...props}>
          <MarkEmailUnreadOutlinedIcon fontSize="small" color={'primary'}/>
        </IconButtonBase>
      </Box>
    </Tooltip>
  );
}

export function BackIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();
  
  return (
    <Tooltip title={tooltipTitle || 'Volver'}>
      <div>
        <IconButtonBase
            {...props}
            className={`${classes.iconButton} ${props.className}`}
        >
          <WrapperIcons Icon={ArrowLeft} color={"primary"}/>
        </IconButtonBase>
      </div>
    </Tooltip>
  );
}

export function ChevronForwardIconButton({
                                 tooltipTitle,
                                 ...props
                               }: IconButtonWithTooltipProps) {
  const classes = ButtonsStyles();
  
  return (
      <Tooltip title={tooltipTitle || 'Aplicar'}>
        <div>
          <IconButtonBase className={`${classes.iconButton} ${props.className}`} {...props}>
            <ArrowForwardIosIcon sx={{fontSize: '14px !important'}} />
          </IconButtonBase>
        </div>
      </Tooltip>
  );
}

export function FavoriteEmptyButtonWithQuantity(props: ButtonWithTooltipProps) {
  const { summary } = useTypedSelector((state) => state.userSummary);
  const favoritesQty = summary?.[UserInfoSummaryFields.LinesMarketFavorites];
  
  return (
    <Badge badgeContent={favoritesQty}
           color={'primary'}
           overlap={"circular"}
           anchorOrigin={{
             vertical: 'bottom',
             horizontal: 'right',
           }}
    >
      <FavoriteEmptyButton { ...props } />
    </Badge>
  )
}

export function FavoriteEmptyButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${props.className}`}
            >
              <WrapperIcons Icon={Heart} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <Box>
          <IconButtonBase
            {...props}
            className={`${props.className}`}
          >
            <WrapperIcons Icon={Heart} />
          </IconButtonBase>
        </Box>
      )}
    </>
  );
}

export function FavoriteFullButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${props.className}`}
            >
              <WrapperIcons Icon={Heart} weight={'fill'} />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <Box>
          <IconButtonBase
            {...props}
            className={`${props.className}`}
          >
            <WrapperIcons Icon={Heart} weight={'fill'} />
          </IconButtonBase>
        </Box>
      )}
    </>
  );
}

export function ShoppingBagOutlineButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButton} ${props.className}`}
            >
              <ShoppingCartOutlinedIcon fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <Box>
          <IconButtonBase
            {...props}
            className={`${classes.iconButton} ${props.className}`}
          >
            <ShoppingCartOutlinedIcon fontSize="small" />
          </IconButtonBase>
        </Box>
      )}
    </>
  );
}

export function ShoppingBagFilledButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  const classes = ButtonsStyles();

  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase
              {...props}
              className={`${classes.iconButtonFilled} ${props.className}`}
            >
              <ShoppingCartIcon fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <Box>
          <IconButtonBase
            {...props}
            className={`${classes.iconButtonFilled} ${props.className}`}
          >
            <ShoppingCartIcon fontSize="small" />
          </IconButtonBase>
        </Box>
      )}
    </>
  );
}

export function ShoppingBagOutlinedIconButtonBasic({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase {...props}>
              <ShoppingBagOutlinedIcon fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase {...props}>
          <ShoppingBagOutlinedIcon fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
}

export function ShoppingBagFilledIconButtonBasic({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase {...props}>
              <ShoppingBagIcon fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase {...props}>
          <ShoppingBagIcon fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
}

export function ProceedLinesRequestButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  return (
    <DefaultMarketButton tooltipTitle={tooltipTitle} {...props}>
      Iniciar proceso de solicitud
    </DefaultMarketButton>
  );
}


export function CartAddIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase {...props}>
              <AddShoppingCartIcon fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase {...props}>
          <AddShoppingCartIcon fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
}

export function CartRemoveIconButton({
  tooltipTitle,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <IconButtonBase {...props}>
              <RemoveShoppingCartIcon fontSize="small" />
            </IconButtonBase>
          </Box>
        </Tooltip>
      ) : (
        <IconButtonBase {...props}>
          <RemoveShoppingCartIcon fontSize="small" />
        </IconButtonBase>
      )}
    </>
  );
}


export function LoadingIconButton() {
  const classes = ButtonsStyles();

  return (
    <LoadingButton
      className={classes.iconLoadingButton}
      loading
      variant="outlined"
    />
  );
}

interface EditButtonWithDataProps {
  label: string;
  data: string;
  onClick: () => void;
  tooltipTitle?: string;
}

export function EditButtonWithData(props: EditButtonWithDataProps) {
  return (
    <>
      {props.tooltipTitle ? (
        <Tooltip title={props.tooltipTitle}>
          <Box>
            <Stack direction="row" spacing={3}>
              <DataWithLabel
                label={props.label}
                data={props.data}
                labelProps={EditButtonLabelProps}
                dataProps={EditButtonDataProps}
              />
              <IconButton onClick={props.onClick}>
                <EditOutlinedIcon fontSize={'small'} />
              </IconButton>
            </Stack>
          </Box>
        </Tooltip>
      ) : (
        <Stack direction="row" spacing={3}>
          <DataWithLabel
            label={props.label}
            data={props.data}
            labelProps={EditButtonLabelProps}
            dataProps={EditButtonDataProps}
          />
          <IconButton onClick={props.onClick}>
            <EditOutlinedIcon fontSize={'small'} />
          </IconButton>
        </Stack>
      )}
    </>
  );
}

export const NotificationsIconButton = ({tooltipTitle,
                                          ...props
                                        }: IconButtonWithTooltipProps) => {
  const { summary } = useTypedSelector((state) => state.userSummary);
  const notificationsQty = summary?.[UserInfoSummaryFields.UnreadNotifications]
  
  return (
      tooltipTitle ? (
          <Tooltip title={tooltipTitle}>
            <Box>
              {notificationsQty && notificationsQty !== 0 ?
                <Badge badgeContent={notificationsQty} color={'primary'}
                       overlap={"circular"}
                       anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'right',
                       }}
                >
                  <IconButtonBase
                      {...props}
                      className={`${props.className}`}
                  >
                    <WrapperIcons Icon={BellIcon} size={'md'} />
                  </IconButtonBase>
                </Badge>
                  :
                  <IconButtonBase
                      {...props}
                      className={`${props.className}`}
                  >
                    <WrapperIcons Icon={BellIcon} size={'md'} />
                  </IconButtonBase>
              }
            </Box>
          </Tooltip>
      ) : (
          notificationsQty && notificationsQty !== 0 ?
              <Badge badgeContent={notificationsQty} color={'primary'}
                     anchorOrigin={{
                       vertical: 'bottom',
                       horizontal: 'right',
                     }}
              >
                <IconButtonBase
                    {...props}
                    className={`${props.className}`}
                >
                  <WrapperIcons Icon={BellIcon} size={'md'} />
                </IconButtonBase>
              </Badge>
              :
              <IconButtonBase
                  {...props}
                  className={`${props.className}`}
              >
                <WrapperIcons Icon={BellIcon} size={'md'} />
              </IconButtonBase>
      )
  );
}

export function DefaultMarketButton({
  tooltipTitle,
  ...props
}: ButtonWithTooltipProps) {
  return (
    <>
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <Box>
            <Button
              variant="contained"
              size="medium"
              {...props}
              /*sx={{
                                    borderRadius: '3px', backgroundColor: getBaseColor(EnumColors.MARKET_BLUE),
                                    '&:hover': {
                                        color: 'black',
                                        backgroundColor: '#FFC107'
                                    },
                                    ...props.sx
                                }}*/
            >
              {props.children}
            </Button>
          </Box>
        </Tooltip>
      ) : (
        <Button
          variant="contained"
          size="medium"
          {...props}
          /*sx={{
                            borderRadius: '3px', backgroundColor: getBaseColor(EnumColors.MARKET_BLUE),
                            '&:hover': {
                                color: 'black',
                                backgroundColor: '#FFC107'
                            },
                            ...props.sx
                        }}*/
        >
          {props.children}
        </Button>
      )}
    </>
  );
}

interface ExpandIconProps extends IconButtonProps {
  initialExpanded?: 'expandLess' | 'expandMore';
  tooltipTitle?: string;
}

export function ExpandIconButton({
  initialExpanded = 'expandLess',
  tooltipTitle,
  ...props
}: ExpandIconProps) {
  const [expanded, setExpanded] = useState<'expandLess' | 'expandMore'>(
    initialExpanded,
  );
  return (
    <Tooltip title={tooltipTitle || 'Expandir'}>
      <Box>
        <IconButton
          {...props}
          sx={{
            transform: expanded === 'expandMore' ? 'rotate(180deg)' : '',
            transition: 'transform 100ms ease',
            ...props.sx,
          }}
          onClick={(e) => {
            setExpanded(
              expanded === 'expandMore' ? 'expandLess' : 'expandMore',
            );
            props?.onClick && props.onClick(e);
          }}
        >
          <ExpandLessIcon />
        </IconButton>
      </Box>
    </Tooltip>
  );
}

export interface MenuItemDropdown {
  label: string;
  icon?: React.ReactNode;
  component?: React.ReactNode;
  onClick?: () => void;
  disable?: boolean;
}

interface ButtonDropdownProps {
  label: string;
  startIcon?: React.ReactNode;
  icon?: React.ReactElement;
  items: MenuItemDropdown[];
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  size?: 'small' | 'medium' | 'large';
  tooltipTitle?: string;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  id?: string;
}

export function ButtonDropdown(props: ButtonDropdownProps) {
  const classes = ButtonsStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const color = props.color ?? 'inherit';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickItem = (item: MenuItemDropdown) => {
    handleClose();
    item.onClick && item.onClick();
  };

  return (
    <>
      {props.tooltipTitle ? (
        <Tooltip title={props.tooltipTitle}>
          <Box>
            <Button
              variant="outlined"
              color={color}
              size={props.size ?? 'medium'}
              onClick={handleClick}
              startIcon={props?.startIcon}
              endIcon={<ExpandMoreTwoTone />}
              fullWidth={props?.fullWidth}
              sx={{ ...props?.sx }}
              id={props.id}
            >
              {props.icon &&
                React.cloneElement(props.icon, {
                  sx: { marginRight: '0.5rem' },
                })}
              {props.label}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                  className: classes.menuPaper,
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
            >
              {props.items.map((item, index) => (
                  <MenuItem key={`menuItemDropdown_${index}`}
                            disabled={item.disable}
                            onClick={!item.disable ? (event) => onClickItem(item) : undefined}
                  >
                    <Box>
                      {item.component ? (
                          item.component
                      ) : (
                          <Stack direction='row' alignItems='center' spacing={1}>
                            {item.icon && item.icon}
                            <Typography>
                              {item.label}
                            </Typography>
                          </Stack>
                      )}
                    </Box>
                  </MenuItem>
              ))}
            </Menu>
          </Box>
        </Tooltip>
      ) : (
        <>
          <Button
            variant="outlined"
            color={color}
            size={props.size ?? 'medium'}
            onClick={handleClick}
            startIcon={props?.startIcon}
            endIcon={<ExpandMoreTwoTone />}
            fullWidth={props?.fullWidth}
            id={props.id}
            sx={{ ...props?.sx }}
          >
            {props.icon &&
              React.cloneElement(props.icon, { sx: { marginRight: '0.5rem' } })}
            {props.label}
          </Button>
          <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
                className: classes.menuPaper,
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
          >
            {props.items.map((item, index) => (
                <MenuItem key={`menuItemDropdown_${index}`}
                          disabled={item.disable}
                          onClick={!item.disable ? (event) => onClickItem(item) : undefined}
                >
                  <Box>
                    {props.icon &&
                      React.cloneElement(props.icon, { sx: { marginRight: '0.5rem' } })}
                    {item.label}
                  </Box>
                </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </>
  );
}

export function ButtonIconDropdown(props: ButtonDropdownProps) {
  const classes = ButtonsStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const color = props.color ?? 'inherit';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const onClickItem = (event: React.MouseEvent<HTMLElement>, item: MenuItemDropdown) => {
    event.stopPropagation();
    handleClose(event);
    item.onClick && item.onClick();
  };

  return (
    <Tooltip title={props.tooltipTitle}>
      <Box>
        <IconButton
          id={props.id}
          onClick={handleClick}
          className={classes.iconButton}
          size={props.size}
          sx={{
            backgroundColor: 'rgb(247, 250, 252) !important',
            ...props.sx,
            color: color ?? 'black !important'
          }}
        >
          {props.icon ?? <WrapperIcons Icon={DotsThreeVertical} size={'md'} weight={'bold'} />}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            className: classes.menuPaper,
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {props.items.map((item, index) => (
            <MenuItem key={`menuItemDropdown_${index}`}
                      variant={'bold'}
                      disabled={item.disable}
                      onClick={!item.disable ? (event) => onClickItem(event, item) : undefined}
            >
                {
                    item.component ?
                        <Box>
                            {item.component}
                        </Box>
                        :
                        <React.Fragment>
                            {
                                item.icon &&
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                            }
                            {item.label}
                        </React.Fragment>
                }
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Tooltip>
  );
}

interface ButtonIconCollapseProps extends IconButtonProps {
    expanded?: boolean
}

export function ButtonIconCollapse ({ expanded, ...restProps }: ButtonIconCollapseProps) {
    return (
        <IconButton {...restProps}>
            { expanded ? <ChevronUpIcon /> : <ChevronDownIcon /> }
        </IconButton>
    )
}