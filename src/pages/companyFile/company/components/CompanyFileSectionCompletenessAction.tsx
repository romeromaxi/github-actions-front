import {useContext} from "react";
import {CompanyFileContext} from "hooks/contexts/CompanyFileContext";
import { CompanyFileCompletenessFields } from "types/company/companyData";
import {TypographyBase} from "components/misc/TypographyBase";
import {WrapperIcons} from "components/icons/Icons";
import {CheckIcon} from "lucide-react";

interface CompanyFileSectionCompletenessActionProps {
    percentageName: CompanyFileCompletenessFields,
    missingFieldsName: CompanyFileCompletenessFields
}

function CompanyFileSectionCompletenessAction(props: CompanyFileSectionCompletenessActionProps) {
    const { completenessPercentage } = useContext(CompanyFileContext);
    const isPlural = !!completenessPercentage && completenessPercentage[props.missingFieldsName] === 1;
    
    if (!completenessPercentage) return null;
    
    if (completenessPercentage[props.percentageName] >= 100) 
        return (
            <WrapperIcons Icon={CheckIcon} color={'primary'} size={'md'} />
        )
    
    return (
        <TypographyBase variant={'button2'}
                        color={'warning.main'}
        >
            {`${completenessPercentage[props.missingFieldsName]} dato${isPlural ? "" : "s"} requerido${isPlural ? "" : "s"}`}
        </TypographyBase>
    )
}

export default CompanyFileSectionCompletenessAction;