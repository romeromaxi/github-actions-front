import {useEffect, useState} from "react";
import {Stack} from "@mui/material";
import PasswordRulesStyles from "./PasswordRules.styles";
import clsx from "clsx";
import {WrapperIcons} from "../icons/Icons";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

interface PasswordRules {
    minLength: boolean,
    hasLowercase: boolean,
    hasUppercase: boolean,
    hasNumber: boolean,
    hasSpecialChar: boolean,
}

interface PasswordRulesListProps {
    password?: string,
}

function PasswordRulesList({password}: PasswordRulesListProps) {
    const [rules, setRules] = useState<PasswordRules>({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    useEffect(() => {
        const value = password || "";
        
        setRules({
            minLength: value.length >= 8,
            hasLowercase: /[a-z]/.test(value),
            hasUppercase: /[A-Z]/.test(value),
            hasNumber: /\d/.test(value),
            hasSpecialChar: /[-!?+$%_.\/,~()=#{}@^*]/.test(value),
        });
    }, [password]);
    
    return (
        <Stack direction={'row'} sx={{ flexWrap: 'wrap' }}>
            <PasswordRule label={"Al menos 8 caracteres"}
                          valid={rules.minLength} />
            <PasswordRule label={"Al menos 1 letra mayúscula"}
                          valid={rules.hasUppercase} />
            <PasswordRule label={"Al menos 1 letra minúscula"}
                          valid={rules.hasLowercase} />
            <PasswordRule label={"Al menos 1 número"}
                          valid={rules.hasNumber} />
            <PasswordRule label={"Al menos 1 carácter especial (por ejemplo, !@#$+-)"}
                          valid={rules.hasSpecialChar} />
        </Stack>
    )
}

interface PasswordRuleProps {
    label: string,
    valid: boolean
}

function PasswordRule({ label, valid }: PasswordRuleProps) {
    const classes = PasswordRulesStyles();

    return (
        <Stack direction={'row'} alignItems={'center'} spacing={1} pr={2}
               className={clsx(classes.ruleItem, {
                   [classes.ruleItemValid]: valid
               })}
        >
            {
                valid ?
                    <WrapperIcons Icon={CheckCircle} size={'xs'} />
                    :
                    <WrapperIcons Icon={XCircle} size={'xs'} />
            }

            <span>{label}</span>
        </Stack>
    )
}

export default PasswordRulesList;

