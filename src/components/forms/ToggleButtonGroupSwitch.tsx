import React, { useRef } from "react";
import { TypographyBase } from "components/misc/TypographyBase";
import ToggleButtonGroupSwitchStyles from "./ToggleButtonGroupSwitch.styles";

interface ToggleButtonGroupSwitchProps {
    options: any[];
    value?: any;
    onChange: (_: any) => void;
}

function ToggleButtonGroupSwitch(props: ToggleButtonGroupSwitchProps) {
    const classes = ToggleButtonGroupSwitchStyles();
    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    return (
        <div className={classes.container}>
            {props.options.map((option, index) => (
                <button
                    key={option.value}
                    ref={(el) => (buttonsRef.current[index] = el)}
                    className={`${classes.button} ${option.value === props.value ? "selected" : ""}`}
                    onClick={() => props.onChange(option.value)}
                >
                    <TypographyBase variant={"caption"} color={"default"}>
                        {option.label}
                    </TypographyBase>
                </button>
            ))}
        </div>
    );
}

export default ToggleButtonGroupSwitch;
