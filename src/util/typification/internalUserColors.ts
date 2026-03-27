import {UserTypeCodes} from "../../types/user";


export interface InternalUserColors {
    light: string;
    dark: string;
}

export const UserTypeColorMap: Record<UserTypeCodes, InternalUserColors> = {
    [UserTypeCodes.Company]: {
        light: `rgba(39, 206, 136, 0.2)`,
        dark: `rgb(39, 206, 136)`,
    },
    [UserTypeCodes.Internal]: {
        light: `rgba(104, 85, 201, 0.2)`,
        dark: `rgb(104, 85, 201)`,
    },
    [UserTypeCodes.Offerer]: {
        light: `rgba(158, 157, 36, 0.2)`,
        dark: `rgb(158, 157, 36)`,
    },
    [UserTypeCodes.Temp]: {
        light: `rgba(239, 108, 0, 0.2)`,
        dark: `rgb(239, 108, 0)`,
    },
    [UserTypeCodes.Guest]: {
        light: `rgba(48, 176, 122, 0.2)`,
        dark: `rgb(48, 176, 122)`,
    },
};
