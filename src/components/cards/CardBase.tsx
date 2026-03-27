import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Divider,
  Stack,
} from '@mui/material';

import CardHeaderWithBorder from './CardHeaderWithBorder';
import {
  DeleteIconButton,
  DetailPersonIconButton,
  DetailPymeIconButton,
  EditIconButton,
} from '../buttons/Buttons';
import { EnumColors } from 'types/general/generalEnums';

import CardBaseStyles from './CardBase.styles';

export enum InformationShownType {
  SUMMARY,
  DETAIL,
  EDITION,
}

interface CardBaseProps {
  baseColor: EnumColors;
  title: React.ReactNode;
  avatar?: React.ReactNode;
  summaryContent?: React.ReactNode;
  detailContent?: React.ReactNode;
  editContent?: React.ReactNode;
  startShowType?: InformationShownType;
  onDelete?: () => void;
  isAboutPerson?: boolean;
  showSummaryAlways?: boolean;
}

type ColorButton = 'success' | 'secondary' | 'info';

function CardBase(props: CardBaseProps) {
  const classes = CardBaseStyles();
  const hasSummaryContent: boolean = !!props.summaryContent;

  const [typeInformationShown, setTypeInformationShown] = useState<
    InformationShownType | undefined
  >(
    props.startShowType !== undefined
      ? props.startShowType
      : !!props.summaryContent
        ? InformationShownType.SUMMARY
        : props.detailContent
          ? InformationShownType.DETAIL
          : props.editContent
            ? InformationShownType.EDITION
            : undefined,
  );

  const getColorButtonByBaseColor = (isSelected: boolean): ColorButton => {
    if (!isSelected) return 'secondary';

    switch (props.baseColor) {
      case EnumColors.BLUE:
        return 'info';
      case EnumColors.GREEN:
        return 'success';

      default:
        return 'secondary';
    }
  };

  const onClickButton = (typeInformationClick: InformationShownType) => {
    if (typeInformationShown !== typeInformationClick)
      setTypeInformationShown(typeInformationClick);
    else if (hasSummaryContent)
      setTypeInformationShown(InformationShownType.SUMMARY);
  };

  const onClickDetail = () => onClickButton(InformationShownType.DETAIL);

  const onClickEdit = () => onClickButton(InformationShownType.EDITION);

  const mapDetailButton = () => {
    let colorButton: ColorButton = getColorButtonByBaseColor(
      typeInformationShown === InformationShownType.DETAIL,
    );

    if (props.isAboutPerson)
      return (
        <DetailPersonIconButton color={colorButton} onClick={onClickDetail} />
      );

    return <DetailPymeIconButton color={colorButton} onClick={onClickDetail} />;
  };

  const mapEditButton = () => {
    let colorButton: ColorButton = getColorButtonByBaseColor(
      typeInformationShown === InformationShownType.EDITION,
    );

    return <EditIconButton color={colorButton} onClick={onClickEdit} />;
  };

  return (
    <Card className={classes.cardWithShadow}>
      <CardHeaderWithBorder
        baseColor={props.baseColor}
        title={props.title}
        avatar={props.avatar}
        action={
          <Stack direction="row" sx={{ gap: '16px' }}>
            {props.detailContent && mapDetailButton()}
            {props.editContent && mapEditButton()}
            {props.onDelete && (
              <DeleteIconButton color="secondary" onClick={props.onDelete} />
            )}
          </Stack>
        }
      />

      <CardContent>
        {!!props.summaryContent &&
          (props.showSummaryAlways ||
            typeInformationShown === InformationShownType.SUMMARY) && (
            <>
              {props.summaryContent}
              <Collapse
                in={typeInformationShown !== InformationShownType.SUMMARY}
              >
                <Box mb={2}>
                  <Divider />
                </Box>
              </Collapse>
            </>
          )}

        <Collapse in={typeInformationShown === InformationShownType.EDITION}>
          {typeInformationShown === InformationShownType.EDITION && (
            <Collapse in>{props.editContent}</Collapse>
          )}
        </Collapse>

        <Collapse in={typeInformationShown === InformationShownType.DETAIL}>
          {typeInformationShown === InformationShownType.DETAIL && (
            <Collapse in>{props.detailContent}</Collapse>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default CardBase;
