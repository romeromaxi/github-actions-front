import {Button, ButtonProps} from "@mui/material";
import {ReactNode, useMemo, useState} from "react";

interface ButtonHoverSwitchProps extends Omit<ButtonProps, "children"> {
    children: ReactNode;
    hoverChildren?: ReactNode;
    normalProps?: Partial<ButtonProps>;
    hoverProps?: Partial<ButtonProps>;
}

function ButtonHoverSwitch({ children, normalProps, hoverChildren, hoverProps, ...props }: ButtonHoverSwitchProps) {
    const [hovered, setHovered] = useState(false);
    
    const current = useMemo(() => {
        if (hovered) {
            return {
                props: hoverProps,
                children: hoverChildren || children
            }
        }
        
        return {
            props: normalProps,
            children: children
        }
    }, [hovered, children, hoverChildren, hoverProps, normalProps]);
    
    return (
        <Button {...props}
                {...current.props}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
        >
            {current.children}
        </Button>
    )
}

export default ButtonHoverSwitch;