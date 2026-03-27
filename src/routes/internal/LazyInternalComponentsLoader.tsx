import React, { Suspense, useEffect, useState } from "react";
import { LoaderBlockUI } from "components/loader/LoaderBlockUI";

type InternalComponentsType = {
  [key: string]: React.ComponentType<any>;
};

interface LazyComponentLoaderProps {
  componentName: string;
  props?: Record<string, any>;
  children?: React.ReactNode;
}

const LazyInternalComponentsLoader = ({ componentName, props, children }: LazyComponentLoaderProps) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {

    import("./InternalComponentsWrapper").then((module) => {
      const components = module.default as InternalComponentsType;
      setComponent(() => components[componentName]);
    });
  }, [componentName]);

  if (!Component) {
    return <LoaderBlockUI />;
  }

  return (
    <Suspense fallback={<LoaderBlockUI />}>
      <Component {...props}>
        {children}
      </Component>
    </Suspense>
  );
};

export default LazyInternalComponentsLoader;
