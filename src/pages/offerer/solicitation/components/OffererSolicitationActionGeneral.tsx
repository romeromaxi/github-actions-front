import React from "react";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import OffererSolicitationActionPending from "./actions/OffererSolicitationActionPending";
import OffererSolicitationActionInProgress from "./actions/OffererSolicitationActionInProgress";
import OffererSolicitationActionApproval from "./actions/OffererSolicitationActionApproval";
import {SolicitationOffererTabs, SolicitationProposedApprovalFlowTypes} from "types/solicitations/solicitationEnums";
import {EntityWithIdFields} from "types/baseEntities";
import {
    HttpSolicitationDocumentationAnalysis
} from "http/solicitations/httpSolicitationDocumentationAnalysis";
import {PermissionType} from "types/security";
import {HttpSolicitationAnalysis} from "http/solicitations/httpSolicitationAnalysis";
import { SolicitationHelper } from "util/helpers/solicitationHelper";

function OffererSolicitationActionGeneral() {
    const { solicitation, loadingSolicitation, permissionWorkflowCode } = useSolicitation();
    
    if (!solicitation || loadingSolicitation)
        return null;
    
    return (
        <React.Fragment>
            {
                (
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.ReceptionProposal) ||
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.AdmissionProposal)
                ) &&
                    <OffererSolicitationActionPending solicitationId={solicitation[EntityWithIdFields.Id]}
                                                      hasPermission={permissionWorkflowCode === PermissionType.Write}
                    />
            }

            {
                (
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.PrequalificationProposal)
                ) &&
                    <OffererSolicitationActionInProgress solicitationId={solicitation[EntityWithIdFields.Id]}
                                                         hasPermission={permissionWorkflowCode === PermissionType.Write}
                    />
            }

            {
                (
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.ReceptionApproval) ||
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.AdmissionApproval)
                ) &&
                    <OffererSolicitationActionApproval solicitationId={solicitation[EntityWithIdFields.Id]}
                                                       approvalType={SolicitationProposedApprovalFlowTypes.AdmissionReception}
                                                       HttpAnalysis={HttpSolicitationAnalysis}
                                                       hasPermission={permissionWorkflowCode === PermissionType.Write}
                    />
            }

            {
                (
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.PrequalificationApproval)
                ) &&
                <OffererSolicitationActionApproval solicitationId={solicitation[EntityWithIdFields.Id]}
                                                   approvalType={SolicitationProposedApprovalFlowTypes.SendingResults}
                                                   HttpAnalysis={HttpSolicitationDocumentationAnalysis}
                                                   hasPermission={permissionWorkflowCode === PermissionType.Write}
                />
            }
        </React.Fragment>
    )
}

export default OffererSolicitationActionGeneral;