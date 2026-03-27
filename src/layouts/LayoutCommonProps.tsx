import React from "react";
import {ApplicationCommonTopContentType} from "hooks/contexts/ApplicationCommonContext";

export interface LayoutCommonProps {
    children?: React.ReactNode,
    fullBanner?: React.ReactNode,
    topContent?: ApplicationCommonTopContentType
}