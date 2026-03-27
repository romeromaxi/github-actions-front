import React, { useMemo, useRef, useState, useEffect } from "react";
import {
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
    SxProps,
} from "@mui/material";
import type {
    Control,
    FieldValues,
    Path,
    UseFormGetValues,
    UseFormSetValue,
    UseFormTrigger,
} from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import HelperInputText from "../text/HelperInputText";
import { couponFieldStyle } from "../Checkout/CouponStyles";
import {
    digitsOnly,
    sanitizeDigitsAndSpaces,
    validateInternationalPhone,
    formatNationalPhoneForInput,
    formatNationalPhoneAsYouType,
    countDigits,
    caretPosFromDigitIndex,
} from "../../utils/phoneValidation";

type CountryOption = {
    iso2: "AR" | "UY" | "BR" | "PY" | "BO" | "CL";
    name: string;
    callingCode: string; // sin "+"
    flag: string;
};

const COUNTRIES_AR_NEIGHBORS: CountryOption[] = [
    { iso2: "AR", name: "Argentina", callingCode: "54", flag: "🇦🇷" },
    { iso2: "UY", name: "Uruguay", callingCode: "598", flag: "🇺🇾" },
    { iso2: "BR", name: "Brasil", callingCode: "55", flag: "🇧🇷" },
    { iso2: "PY", name: "Paraguay", callingCode: "595", flag: "🇵🇾" },
    { iso2: "BO", name: "Bolivia", callingCode: "591", flag: "🇧🇴" },
    { iso2: "CL", name: "Chile", callingCode: "56", flag: "🇨🇱" },
];

const makeLabel = (label: string, required?: boolean) => (
    <Stack direction="row" justifyContent="flex-start" spacing={0.4}>
        <div>{label}</div>
        <Typography>{required ? "*" : ""}</Typography>
    </Stack>
);

const clampMaxLength = (value: string, maxLength?: number) => {
    if (!maxLength) return value;
    return value.length > maxLength ? value.slice(0, maxLength) : value;
};

const sanitizePhoneInput = (value: string, maxLength?: number) =>
    clampMaxLength(
        sanitizeDigitsAndSpaces(value),
        maxLength
    );

const allowOnlyDigitsSpacesKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
        "Backspace", "Delete",
        "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
        "Tab", "Enter", "Escape", "Home", "End",
    ];

    if (
        allowedKeys.includes(event.key) ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
    ) return;

    if (!/^[0-9 ]$/.test(event.key)) {
        event.preventDefault();
    }
};

export interface ControlledCountryPhoneFieldProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    getValues: UseFormGetValues<TFieldValues>;
    setValue: UseFormSetValue<TFieldValues>;
    trigger?: UseFormTrigger<TFieldValues>;

    countryCodeName: Path<TFieldValues>;
    phoneName: Path<TFieldValues>;

    required?: boolean;

    countryLabel?: string;
    phoneLabel?: string;

    phonePlaceholder?: string;

    countryHelperText?: string;
    phoneHelperText?: string;

    phoneMaxLength?: number;
    sx?: SxProps;

    defaultCountryIso2?: CountryOption["iso2"];
}

export const ControlledCountryPhoneField = <TFieldValues extends FieldValues>({
    control,
    getValues,
    setValue,
    trigger,

    countryCodeName,
    phoneName,

    required = true,

    countryLabel = "País",
    phoneLabel = "Teléfono",

    phonePlaceholder = "Código de área + número",

    countryHelperText = "Seleccioná el país. Se completa automáticamente el código (+...).",
    phoneHelperText = "Ingresá código de área y número. Solo dígitos y espacios.",

    phoneMaxLength,
    sx,
    defaultCountryIso2 = "AR",
}: ControlledCountryPhoneFieldProps<TFieldValues>) => {
    const [countryFocused, setCountryFocused] = useState(false);
    const [phoneFocused, setPhoneFocused] = useState(false);

    const phoneInputRef = useRef<HTMLInputElement | null>(null);

    // suscripción a cambios del country code para actualizar adornment y shrink
    const watchedCountryCode = useWatch({ control, name: countryCodeName });
    const countryCodeDigits = digitsOnly(String(watchedCountryCode ?? ""));

    const revalidateBoth = () => {
        if (!trigger) return;
        trigger([countryCodeName, phoneName]);
    };

    useEffect(() => {
        const current = String(getValues(countryCodeName) ?? "");
        if (!digitsOnly(current)) {
            const def = COUNTRIES_AR_NEIGHBORS.find((c) => c.iso2 === defaultCountryIso2);
            if (def) {
                setValue(countryCodeName, def.callingCode as any, {
                    shouldValidate: true,
                    shouldDirty: false,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const countryLabelNode = useMemo(
        () => makeLabel(countryLabel, required),
        [countryLabel, required]
    );
    const phoneLabelNode = useMemo(
        () => makeLabel(phoneLabel, required),
        [phoneLabel, required]
    );

    const getSelectedCountry = (callingCode: string) =>
        COUNTRIES_AR_NEIGHBORS.find((c) => c.callingCode === callingCode);

    const validateCountryCode = (val: string) => {
        const code = digitsOnly(val);
        if (!code) return "Seleccioná un país.";
        return getSelectedCountry(code) ? true : "Seleccioná un país válido.";
    };

    const validatePhone = (phoneRaw: string) => {
        const countryDigits = countryCodeDigits;
        if (!countryDigits) return "Seleccioná un país.";
        if (!digitsOnly(phoneRaw)) return "Ingresá código de área y número.";

        const res = validateInternationalPhone(countryDigits, phoneRaw);
        return res.ok ? true : res.message;
    };

    const watchedPhone = useWatch({ control, name: phoneName });
    const pendingCaretPosRef = useRef<number | null>(null);

    useEffect(() => {
        if (pendingCaretPosRef.current == null) return;
        const pos = pendingCaretPosRef.current;
        pendingCaretPosRef.current = null;

        const el = phoneInputRef.current;
        if (!el) return;

        // Espera a que el value controlado se aplique al DOM
        requestAnimationFrame(() => {
            try {
                el.setSelectionRange(pos, pos);
            } catch {
                
            }
        });
    }, [watchedPhone]);


    return (
        <Grid container spacing={2} sx={sx}>
            {/* País */}
            <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                    control={control}
                    name={countryCodeName}
                    rules={{
                        required: required ? "Seleccioná un país." : false,
                        validate: (val: any) => validateCountryCode(String(val ?? "")),
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => {
                        const selected = getSelectedCountry(digitsOnly(String(value ?? "")));

                        return (
                            <Stack sx={{ width: "100%" }}>
                                <TextField
                                    sx={couponFieldStyle}
                                    variant="outlined"
                                    select
                                    label={countryLabelNode}
                                    value={selected?.callingCode ?? ""}
                                    error={!!error}
                                    onFocus={() => setCountryFocused(true)}
                                    onBlur={() => setCountryFocused(false)}
                                    onChange={(e) => {
                                        const callingCode = String(e.target.value ?? "");
                                        onChange(callingCode);
                                        revalidateBoth();
                                        setTimeout(() => phoneInputRef.current?.focus(), 0);
                                    }}
                                    SelectProps={{
                                        renderValue: (val) => {
                                            const c = getSelectedCountry(String(val ?? ""));
                                            if (!c) return "Seleccionar...";
                                            return `${c.flag} ${c.name} (+${c.callingCode})`;
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: countryFocused || Boolean(selected?.callingCode),
                                    }}
                                >
                                    {COUNTRIES_AR_NEIGHBORS.map((c) => (
                                        <MenuItem key={c.iso2} value={c.callingCode}>
                                            {c.flag} {c.name} (+{c.callingCode})
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {error ? (
                                    <HelperInputText text={error.message} error />
                                ) : (
                                    countryHelperText && <HelperInputText text={countryHelperText} />
                                )}
                            </Stack>
                        );
                    }}
                />
            </Grid>

            {/* Teléfono */}
            <Grid size={{ xs: 12, sm: 8 }}>
                <Controller
                    control={control}
                    name={phoneName}
                    rules={{
                        required: required ? "Ingresá código de área y número." : false,
                        validate: (val: any) => validatePhone(String(val ?? "")),
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => {
                        const hasValue = Boolean(String(value ?? "").length > 0);
                        const showCountryAdornment = Boolean(countryCodeDigits);
                        const adornmentText = `(+${countryCodeDigits})`;

                        return (
                            <Stack sx={{ width: "100%" }}>
                                <TextField
                                    sx={couponFieldStyle}
                                    variant="outlined"
                                    type="tel"
                                    label={phoneLabelNode}
                                    value={value ?? ""}
                                    placeholder={phonePlaceholder}
                                    error={!!error}
                                    inputRef={phoneInputRef}
                                    onFocus={() => setPhoneFocused(true)}
                                    onBlur={() => {
                                        setPhoneFocused(false);

                                        const raw = String(value ?? "");
                                        const normalized = sanitizePhoneInput(raw, phoneMaxLength);

                                        // Solo aplico el formato "bonito" si es un número válido.
                                        const validation = validateInternationalPhone(countryCodeDigits, normalized);

                                        const formatted = validation.ok
                                            ? formatNationalPhoneForInput(countryCodeDigits, normalized)
                                            : normalized;

                                        if (formatted !== raw) onChange(formatted);

                                        revalidateBoth();
                                    }}

                                    onKeyDown={allowOnlyDigitsSpacesKeyDown}
                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        e.target.value = sanitizePhoneInput(e.target.value, phoneMaxLength);
                                    }}
                                    onChange={(e) => {
                                        const raw = String(e.target.value ?? "");
                                        const selectionStart = e.target.selectionStart ?? raw.length;

                                        // Máximo de dígitos (interpretamos phoneMaxLength como "max dígitos", no "max chars")
                                        const maxDigits = phoneMaxLength;
                                        const digits = digitsOnly(raw);
                                        const clampedDigits = maxDigits ? digits.slice(0, maxDigits) : digits;

                                        // Cuántos dígitos había a la izquierda del cursor, antes de formatear
                                        const digitsLeft = Math.min(
                                            countDigits(raw.slice(0, selectionStart)),
                                            clampedDigits.length
                                        );

                                        // Si hay país, formateo con AsYouType; si no, dejo saneado
                                        const formatted = countryCodeDigits
                                            ? formatNationalPhoneAsYouType(countryCodeDigits, clampedDigits)
                                            : sanitizeDigitsAndSpaces(raw);

                                        // Calcular nueva posición de caret en el string formateado
                                        const nextCaretPos = caretPosFromDigitIndex(formatted, digitsLeft);
                                        pendingCaretPosRef.current = nextCaretPos;

                                        onChange(formatted);
                                        revalidateBoth();
                                    }}

                                    InputProps={{
                                        // no mostramos "(+ )" vacío: solo si hay país
                                        startAdornment: showCountryAdornment ? (
                                            <InputAdornment position="start">
                                                <Typography sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                                                    {adornmentText}
                                                </Typography>
                                            </InputAdornment>
                                        ) : undefined,
                                    }}
                                    inputProps={{
                                        maxLength: phoneMaxLength,
                                        inputMode: "tel",
                                        pattern: "[0-9 ]*",
                                        autoComplete: "tel-national",
                                    }}
                                    InputLabelProps={{
                                        // si hay adornment, forzamos shrink para que no se pise con el label
                                        shrink: phoneFocused || hasValue || showCountryAdornment,
                                    }}
                                />

                                {error ? (
                                    <HelperInputText text={error.message} error />
                                ) : (
                                    phoneHelperText && <HelperInputText text={phoneHelperText} />
                                )}
                            </Stack>
                        );
                    }}
                />
            </Grid>
        </Grid>
    );
};
