import React, { Suspense, useEffect, useState } from "react";
import { LoaderBlockUI } from "components/loader/LoaderBlockUI";

type InternalComponentsType = {
  [key: string]: React.ComponentType<any>;
};

interface LazyComponentLoaderProps {
  componentName: string;
  props?: Record<string, any>;
}

const LazyPymeComponentsLoader = ({ componentName, props }: LazyComponentLoaderProps) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {

    import("./PymeComponentsWrapper").then((module) => {
      const components = module.default as InternalComponentsType;
      setComponent(() => components[componentName]);
    });
  }, [componentName]);

  if (!Component) {
    return <LoaderBlockUI />;
  }

  return (
    <Suspense fallback={<LoaderBlockUI />}>
      <Component {...props} />
    </Suspense>
  );
};

export default LazyPymeComponentsLoader;
