import React, {cloneElement, Fragment, ReactElement, useEffect, useMemo, useState} from "react";
import {Box, Tooltip} from "@mui/material";
import {userStorage} from "util/localStorage";
import {useAction} from "hooks/useAction";
import useAxios from "hooks/useAxios";
import useSecurityObject from "hooks/useSecurityObject";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {EntityWithIdFields} from "types/baseEntities";
import {SolicitationFlagsFields, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {OffererSolicitationNavHeaderSecObjects, SecurityComponents} from "types/security";
import {DialogAlert} from "components/dialog";
import {TypographyBase} from "components/misc/TypographyBase";
import {
    ActionExecute, ActionExecuteFields, ActionFields, VariableWorkflow, VariableWorkflowFields
} from "types/workflow/actionData";
import {HttpAction, HttpSolicitation} from "http/index";
import {MessageFields} from "types/workflow/messageData";

export enum OffererSolicitationAssignmentActionVariant {
    Stage,
    Commercial,
    All
}

const AssignmentStageOptions = [
    OffererSolicitationAssignmentActionVariant.Stage,
    OffererSolicitationAssignmentActionVariant.All
]

const AssignmentCommercialOptions = [
    OffererSolicitationAssignmentActionVariant.Commercial,
    OffererSolicitationAssignmentActionVariant.All
]

interface OffererSolicitationAssignmentActionWrapperProps {
    variant: OffererSolicitationAssignmentActionVariant,
    children: ReactElement
}

function OffererSolicitationAssignmentActionWrapper({ variant, children
}: OffererSolicitationAssignmentActionWrapperProps) {
    const userId = userStorage.getUserId() || 0;
    const {snackbarSuccess} = useAction();
    const {fetchAllData} = useAxios();
    const {hasWritePermission, hasWriteWorkflowPermission} = useSecurityObject();
    const {permissionWorkflowCode, message, solicitation, flags, reloadSolicitation} = useSolicitation();
    const messageId = message?.[EntityWithIdFields.Id] || 0;
    const solicitationId = solicitation?.[EntityWithIdFields.Id] || 0;
    const offererId = solicitation?.[SolicitationViewDTOFields.OffererId] || 0;
    const responsibleUserId = solicitation?.[SolicitationViewDTOFields.StageResponsibleUserId] || 0;
    const responsibleCommercialUserId = solicitation?.[SolicitationViewDTOFields.CommercialResponsibleUserId] || 0;

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actionId, setActionId] = useState<number>();

    const isAssigned =
        (responsibleUserId === userId && variant === OffererSolicitationAssignmentActionVariant.Stage) ||
        (responsibleCommercialUserId === userId && variant === OffererSolicitationAssignmentActionVariant.Commercial);

    const allowStageResponsible = useMemo(() => (
        AssignmentStageOptions.includes(variant) &&
        hasWriteWorkflowPermission(
            permissionWorkflowCode,
            SecurityComponents.OffererSolicitationNavHeader,
            OffererSolicitationNavHeaderSecObjects.AssignmentSolicitationButton
        ) &&
        responsibleUserId !== userId &&
        !!messageId
    ), [permissionWorkflowCode, responsibleUserId, userId, messageId]);

    const allowCommercialResponsible = useMemo(() => (
        AssignmentCommercialOptions.includes(variant) &&
        hasWritePermission(
            SecurityComponents.OffererSolicitationNavHeader,
            OffererSolicitationNavHeaderSecObjects.AssignmentResponsibleCommercialSolicitationButton
        ) &&
        flags && flags[SolicitationFlagsFields.SolicitationCommercialResponsibleAsignedAllowed] &&
        responsibleCommercialUserId !== userId
    ), [permissionWorkflowCode, flags, responsibleCommercialUserId, userId]);

    const responsibleUserName = useMemo(() => {
        if (!solicitation) return undefined;

        switch (variant) {
            case OffererSolicitationAssignmentActionVariant.Commercial:
                return solicitation[SolicitationViewDTOFields.CommercialResponsibleUserName];

            case OffererSolicitationAssignmentActionVariant.Stage:
            case OffererSolicitationAssignmentActionVariant.All:
                return solicitation[SolicitationViewDTOFields.StageResponsibleUserName];

            default:
                return undefined;
        }
    }, [variant, solicitation])

    useEffect(() => {
        if (
            message &&
            message[MessageFields.CurrentStageId] &&
            !actionId
        ) {
            HttpAction.getActionsByCurrentStage(message[MessageFields.CurrentStageId])
                .then((actions) => {
                    const asigned = actions.filter((x) =>
                        x[ActionFields.ActionName].toLowerCase().includes('asignar'),
                    );
                    if (asigned && !!asigned.length) {
                        setActionId(asigned[0][EntityWithIdFields.Id])
                    }

                });
        }
    }, [message]);

    if (isAssigned)
        return children;

    if (!allowStageResponsible && !allowCommercialResponsible)
        return (
            <Tooltip title={'No tenes los permisos necesarios'}>
                <span>
                    {cloneElement(children, {disabled: true})}
                </span>
            </Tooltip>
        );

    const actionWorkflowPromise = () => {
        const dataExecute: ActionExecute = {
            [ActionExecuteFields.MessageId]: messageId,
            [ActionExecuteFields.WorkflowVariables]: [
                {
                    [VariableWorkflowFields.Name]: 'intIdUsuarioResponsable',
                    [VariableWorkflowFields.IntegerValue]: userId,
                } as VariableWorkflow,
            ],
            [ActionExecuteFields.Observations]: '',
        } as ActionExecute;

        return HttpAction.executeAction(actionId ?? 0, dataExecute);
    };

    const assignCommercialResponsiblePromise = () =>
        HttpSolicitation.assignCommercialResponsible(offererId, solicitationId);

    const interceptedClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDialog(true);
    };

    const onConfirmAssignmentDialog = () => {
        const promises = [];

        if (AssignmentStageOptions.includes(variant))
            promises.push(actionWorkflowPromise());

        if (AssignmentCommercialOptions.includes(variant))
            promises.push(assignCommercialResponsiblePromise());

        fetchAllData(promises, true)
            .then(() => {
                setOpenDialog(false);
                reloadSolicitation();
                snackbarSuccess('La solicitud fue asignada con exito');
                if (children.props.onClick) {
                    children.props.onClick();
                }
            })
    }

    const onCloseDialog = () => setOpenDialog(false);

    return (
        <React.Fragment>
            <Box onClickCapture={interceptedClick}>
                {children}
            </Box>

            <OffererSolicitationAssignmentActionDialog open={openDialog}
                                                       onClose={onCloseDialog}
                                                       onConfirm={onConfirmAssignmentDialog}
                                                       responsibleUserName={responsibleUserName}
            />
        </React.Fragment>
    )
}

interface OffererSolicitationAssignmentActionDialogProps {
    open: boolean,
    onClose: () => void,
    onConfirm: () => void,
    responsibleUserName?: string,
}

function OffererSolicitationAssignmentActionDialog({
                                                       open,
                                                       responsibleUserName,
                                                       onClose,
                                                       onConfirm
                                                   }: OffererSolicitationAssignmentActionDialogProps) {
    return (
        <DialogAlert open={open}
                     maxWidth={'sm'}
                     onClose={onClose}
                     textContent={'Para actuar sobre esta solicitud deberás asignártela'}
                     textConfirm={'Asignarme la solicitud'}
                     onConfirm={onConfirm}
                     hideTitle>
            <TypographyBase variant={'body2'}
                            color={'text.lighter'}
            >
                {
                    !!responsibleUserName ?
                        <Fragment>
                            Actualmente esta solicitud está asignada a{' '}
                            <Box component={'span'}
                                 fontWeight={600}
                            >
                                {responsibleUserName}
                            </Box>
                        </Fragment>
                        :
                        "Actualmente esta solicitud no está asignada a ningún usuario"
                }
            </TypographyBase>
        </DialogAlert>
    )
}

export default OffererSolicitationAssignmentActionWrapper;