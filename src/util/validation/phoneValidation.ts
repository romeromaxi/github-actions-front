import {
    isValidPhoneNumber,
    validatePhoneNumberLength,
    parsePhoneNumberFromString,
    AsYouType
} from "libphonenumber-js/max";

export const digitsOnly = (value: string | null | undefined) =>
    (value ?? "").replace(/\D/g, "");

export const sanitizeDigitsAndSpaces = (value: string) =>
    value.replace(/[^\d\s]/g, "").replace(/\s+/g, " ").trim();

export type PhoneValidationResult =
    | { ok: true; e164: string; country?: string }
    | { ok: false; message: string };

type PhoneLengthError =
    | "TOO_SHORT"
    | "TOO_LONG"
    | "INVALID_LENGTH"
    | "NOT_A_NUMBER"
    | "INVALID_COUNTRY"
    | "IS_POSSIBLE_LOCAL_ONLY"
    | string;

const lengthErrorToMessage = (reason: PhoneLengthError) => {
    switch (reason) {
        case "TOO_SHORT":
            return "El teléfono es demasiado corto para el país seleccionado.";
        case "TOO_LONG":
            return "El teléfono es demasiado largo para el país seleccionado.";
        case "INVALID_LENGTH":
            return "El teléfono tiene una longitud inválida para el país seleccionado.";
        case "NOT_A_NUMBER":
            return "Ingresá un teléfono válido (solo dígitos).";
        case "INVALID_COUNTRY":
            return "El país seleccionado no es válido.";
        case "IS_POSSIBLE_LOCAL_ONLY":
            return "El teléfono parece ser solo local y no válido en formato internacional.";
        default:
            // Fallback conservador (si aparece un motivo nuevo en futuras versiones)
            return "El teléfono no tiene una longitud válida para el país seleccionado.";
    }
};

export const validateInternationalPhone = (
    countryCodeRaw: string,
    nationalRaw: string // "código de área + número" (sin el +)
): PhoneValidationResult => {
    const countryDigits = digitsOnly(countryCodeRaw);
    const nationalDigits = digitsOnly(nationalRaw);

    if (!countryDigits) {
        return { ok: false, message: "Seleccioná un país." };
    }

    if (!nationalDigits) {
        return { ok: false, message: "Ingresá código de área y número." };
    }

    // Tu formato actual: +<callingCode><nationalDigits>
    const candidate = `+${countryDigits}${nationalDigits}`;

    // 1) Longitud (equivalente a isPossiblePhoneNumber, pero con motivo)
    let lengthReason: string | undefined;
    try {
        lengthReason = validatePhoneNumberLength(candidate) as string | undefined;
    } catch {
        // Muy raro, pero si por algún motivo lanza, lo tratamos como inválido.
        return {
            ok: false,
            message: "El teléfono no se pudo interpretar. Revisá el número ingresado.",
        };
    }

    if (lengthReason) {
        return { ok: false, message: lengthErrorToMessage(lengthReason) };
    }

    // 2) Validación estricta (longitud + dígitos)
    const isValid = isValidPhoneNumber(candidate);
    if (!isValid) {
        return {
            ok: false,
            message: "El teléfono no es válido para el país seleccionado.",
        };
    }

    // 3) Normalización a E.164 
    const parsed = parsePhoneNumberFromString(candidate);

    return {
        ok: true,
        e164: parsed?.number ?? candidate,
        country: parsed?.country ?? undefined,
    };
};

export const formatInternationalPhoneForSummary = (
    countryCallingCode?: string | null,
    nationalNumber?: string | null
) => {
    const cc = digitsOnly(countryCallingCode ?? "");
    const nn = digitsOnly(nationalNumber ?? "");

    if (!cc && !nn) return "";
    if (cc && !nn) return `+${cc}`;
    if (!cc && nn) return nn;

    const candidate = `+${cc}${nn}`;
    const parsed = parsePhoneNumberFromString(candidate);
    return parsed?.formatInternational() ?? `+${cc} ${nn}`;
};


const groupPhoneDigits = (digits: string) => {
    const d = digitsOnly(digits);

    if (d.length <= 4) return d;

    if (d.length <= 8) {
        return `${d.slice(0, d.length - 4)} ${d.slice(-4)}`.replace(/\s+/g, " ").trim();
    }

    const last4 = d.slice(-4);
    const mid4 = d.slice(-8, -4);
    const first = d.slice(0, d.length - 8);

    return `${first} ${mid4} ${last4}`.replace(/\s+/g, " ").trim();
};

export const formatNationalPhoneForInput = (
    countryCallingCodeRaw: string,
    nationalRaw: string
): string => {
    const cc = digitsOnly(countryCallingCodeRaw);
    const nn = digitsOnly(nationalRaw);

    // Si está incompleto, no fuerzo formato "inteligente".
    if (!cc || !nn) return sanitizeDigitsAndSpaces(nationalRaw);

    const candidate = `+${cc}${nn}`;
    const parsed = parsePhoneNumberFromString(candidate);

    // Si no pudo parsear (incompleto / raro), dejo saneado.
    if (!parsed) return sanitizeDigitsAndSpaces(nationalRaw);

    // Ej: "+54 9 11 1234 5678" | "+598 91 234 567"
    const intl = parsed.formatInternational();

    // Quito SOLO el calling code seleccionado (más seguro que quitar "+<digits>" genérico).
    const local = intl.replace(new RegExp(`^\\+${cc}\\s*`), "").trim();

    // Aseguro dígitos y espacios.
    return local.replace(/[^\d\s]/g, " ").replace(/\s+/g, " ").trim();
};

export const formatNationalPhoneAsYouType = (countryCallingCode: string, nationalRaw: string) => {
    const cc = digitsOnly(countryCallingCode);
    const nn = digitsOnly(nationalRaw);

    if (!cc) return sanitizeDigitsAndSpaces(nationalRaw);
    if (!nn) return "";

    // AsYouType acepta solo dígitos y opcional '+' al inicio. :contentReference[oaicite:1]{index=1}
    const formattedIntl = new AsYouType().input(`+${cc}${nn}`);

    // Ej: "+54 9 11 1234 5678" -> "9 11 1234 5678"
    const local = formattedIntl.replace(new RegExp(`^\\+${cc}\\s*`), "").trim();

    return local.replace(/[^\d\s]/g, " ").replace(/\s+/g, " ").trim();
};

export const countDigits = (s: string) => (s.match(/\d/g) ?? []).length;

export const caretPosFromDigitIndex = (formatted: string, digitIndex: number) => {
    if (digitIndex <= 0) return 0;

    let seen = 0;
    for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) seen++;
        if (seen >= digitIndex) return i + 1;
    }
    return formatted.length;
};
