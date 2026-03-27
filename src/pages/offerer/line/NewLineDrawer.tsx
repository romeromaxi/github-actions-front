import React, { useEffect, useState } from 'react';

import { Stack } from '@mui/material';

import { LoaderBlockUI } from 'components/loader';
import DrawerBase from 'components/misc/DrawerBase';

import { HttpOffererProductLine } from 'http/index';

import NewLineForm from './NewLineForm';
import { useAction } from 'hooks/useAction';
import useAxios from '../../../hooks/useAxios';
import {ProductLineFields, ProductLineInsert} from 'types/lines/productLineData';
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {DefaultStylesButton} from "../../../components/buttons/Buttons";

interface NewLineDrawerProps {
  show: boolean;
  title: string;
  offererId: number;
  onCloseDrawer: () => void;
  onFinishProcess: (
    lineId: number,
    productId: number,
    lineName: string,
    lineDescription: string,
  ) => void;
}

export const NewLineContext = React.createContext({
  setLoading: (loading: boolean) => {},
  offererNewLine: {} as ProductLineInsert | undefined,
  setOffererNewLine: (offererNewLine: ProductLineInsert | undefined) => {},
});

function NewLineDrawer(props: NewLineDrawerProps) {
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [offererNewLine, setOffererNewLine] = useState<ProductLineInsert>();

  const resetForm = () => {
    setOffererNewLine(undefined);
  };

  const onHandleClose = () => {
    props.onCloseDrawer();
    resetForm();
  };

  const onHandleSubmitClose = (
    lineId: number,
    productId: number,
    lineName: string,
    lineDescription: string,
  ) => {
    props.onFinishProcess(lineId, productId, lineName, lineDescription);
    resetForm();

    snackbarSuccess('La línea se ha creado con éxito');
  };

  useEffect(() => {
    if (offererNewLine) {
      let productCode = offererNewLine[ProductLineFields.ProductCode] || 0;
      let lineName = offererNewLine[ProductLineFields.Line];
      let lineDescription = offererNewLine[ProductLineFields.LineLarge];
      let offererWorkTeamsId =
        offererNewLine[ProductLineFields.OffererWorkTeamsId];

      fetchData(
        () =>
          HttpOffererProductLine.insertAndGetNewId(
            props.offererId,
            productCode,
            lineName,
            lineDescription,
            offererWorkTeamsId,
          ),
        true,
      ).then((lineId) => {
        onHandleSubmitClose(lineId, productCode, lineName, lineDescription);
      });
    }
  }, [offererNewLine]);

  return (
    <DrawerBase
      show={props.show}
      title={props.title}
      onCloseDrawer={onHandleClose}
      action={
        <DefaultStylesButton
            type="submit"
            form="offerer-new-line-form"
            endIcon={<KeyboardDoubleArrowRightIcon />}
        >
          Agregar Línea
        </DefaultStylesButton>
      }
    >

      <Stack direction="column" justifyContent="flex-start" alignItems="center">
        <NewLineContext.Provider
          value={{
            setLoading,
            offererNewLine,
            setOffererNewLine,
          }}
        >
          <NewLineForm offererId={props.offererId} />
        </NewLineContext.Provider>
      </Stack>

      {isLoading && <LoaderBlockUI />}
    </DrawerBase>
  );
}

export default NewLineDrawer;
