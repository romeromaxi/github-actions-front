import React, { useRef } from "react";
import { Control, Controller } from "react-hook-form";
import { TypographyBase } from "components/misc/TypographyBase";
import ToggleButtonGroupSwitchStyles from "./ToggleButtonGroupSwitch.styles";

interface ControlledToggleButtonGroupSwitchProps {
    name: string;
    control: Control<any>;
    options: any[];
}

function ControlledToggleButtonGroupSwitch(props: ControlledToggleButtonGroupSwitchProps) {
    const classes = ToggleButtonGroupSwitchStyles();
    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    return (
        <Controller
            name={props.name}
            control={props.control}
            render={({ field: { onChange, value } }) => (
                <div className={classes.container}>
                    {props.options.map((option, index) => (
                        <button
                            key={option.value}
                            ref={(el) => (buttonsRef.current[index] = el)}
                            className={`${classes.button} ${option.value === value ? "selected" : ""}`}
                            onClick={() => onChange(option.value)}
                        >
                            <TypographyBase variant={"caption"} color={"default"}>
                                {option.label}
                            </TypographyBase>
                        </button>
                    ))}
                </div>
            )}
        />
    );
}

export default ControlledToggleButtonGroupSwitch;
