import { Control, Controller } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import React, { useRef } from 'react';
import HelperInputText from "../text/HelperInputText";

export interface ControlledReCaptchaProps {
    control: Control<any>;
    name: string;
    reset: boolean;
    setReset: (arg: boolean) => void;
    theme?: 'dark' | 'light';
    size?: 'compact' | 'normal' | 'invisible';
    badge?: 'inline' | 'bottomleft' | 'bottomright';
    stoken?: string;
    onExpired?: (...args: any[]) => void;
    onErrored?: (...args: any[]) => void;
    tabindex?: number;
    type?: 'image' | 'audio';
}

export const ControlledReCaptcha = ({
                                        control,
                                        name,
                                        reset,
                                        setReset,
                                        theme = 'light',
                                        size = 'normal',
                                        ...rest
                                    }: ControlledReCaptchaProps) => {
    const captchaRef = useRef<ReCAPTCHA | null>(null);
    const prevErrorRef = useRef<boolean>(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                if (error && !prevErrorRef.current) {
                    prevErrorRef.current = true;
                    Promise.resolve().then(() => {
                        captchaRef.current?.reset();
                        onChange('');
                    });
                } else if (!error) {
                    prevErrorRef.current = false;
                }

                if (reset) {
                    Promise.resolve().then(() => {
                        captchaRef.current?.reset();
                        onChange('');
                        setReset(false);
                    });
                }

                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <ReCAPTCHA
                            ref={captchaRef}
                            sitekey={window.reCAPTCHA_SITE_KEY}
                            theme={theme}
                            size={size}
                            onChange={(token) => onChange(token)}
                            onExpired={() => onChange('')}
                            {...rest}
                        />
                        {error && <HelperInputText text={error.message} error />}
                    </div>
                );
            }}
        />
    );
};
