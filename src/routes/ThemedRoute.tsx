import React from "react";
import { ThemeItaptecUX } from "../util/themes/ThemeItapTecUX";

interface ThemedRouteProps {
  element: React.ReactNode;
}

export const ThemedRoute: React.FC<ThemedRouteProps> = ({ element }) => {
  return <ThemeItaptecUX>{element}</ThemeItaptecUX>;
};