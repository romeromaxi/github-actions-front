import React, { useEffect } from 'react';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { SnackbarTypeFields } from 'stores/reducer/snackbarReducer';
import { useAction } from 'hooks/useAction';
import {useSnackbarActions} from "../../hooks/useSnackbarActions";
import {EnumSnackbarType} from "../../stores/reducer/snackbarReducer";

function SnackbarManager() {
  const { clearSnackbar } = useAction();
  const { addSnackbar } = useSnackbarActions();
  const { stackSnackbar, snackbarRecentlyAdded } = useTypedSelector(
    (state) => state.snackbar,
  );

  useEffect(() => {    
    if (stackSnackbar.length <= 0 && !snackbarRecentlyAdded) return;

    stackSnackbar.forEach(lastSnackbar => {
      addSnackbar(
        lastSnackbar[SnackbarTypeFields.Type] || EnumSnackbarType.ERROR,
        lastSnackbar[SnackbarTypeFields.Message] || "Al parecer ocurrió un error. Por favor, intentá en unos instantes",
        lastSnackbar[SnackbarTypeFields.Title]
      )
    })

    clearSnackbar();
  }, [stackSnackbar, snackbarRecentlyAdded]);

  return (
    <React.Fragment />
  );
}

export default SnackbarManager;
