import {
  DictionaryTemplateConfig,
  ProductLineTemplate,
  ProductLineTemplateFields
} from "../../types/productLineTemplate/ProductLineTemplateData";
import { useProfileActions } from "../../hooks/useProfileActions";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../hooks/contexts/UserContext";

interface ProductLineManagerProps {
  setDictionaryTemplateConfig: (v: DictionaryTemplateConfig) => void
}

const ProductLineManager = ({setDictionaryTemplateConfig}: ProductLineManagerProps) => {
  const { relaod: profileReload } = useTypedSelector((state) => state.profile);
  const { reloadProfile } = useProfileActions();
  const [data, setData] = useState<ProductLineTemplate[]>([]);
  const { user } = useUser(); 

  const transformToDictionaryTemplateConfig = useCallback((productLineData: ProductLineTemplate[]) => {
    const productLinesConfiguration: DictionaryTemplateConfig = {};
    
    for (const productLine of productLineData) {
      const productLineKey = productLine[ProductLineTemplateFields.ProductTemplateCode];
      
      if (!productLinesConfiguration[productLineKey]) {
        productLinesConfiguration[productLineKey] = [];
      }
      
      productLinesConfiguration[productLineKey].push(productLine);
    }
    
    for (const entry in productLinesConfiguration) {
      productLinesConfiguration[entry].sort((a, b) => a[ProductLineTemplateFields.Order] - b[ProductLineTemplateFields.Order]);
    }
    
    setDictionaryTemplateConfig(productLinesConfiguration);
  }, [setDictionaryTemplateConfig]);

  const loadProductLines = async (cancelReload: boolean = false) => {
    try {
      const { HttpCacheGeneral } = await import("../../http/cache/httpCacheGeneral");
      const response = await HttpCacheGeneral.getProductLineFields();
      setData(response);
      if (cancelReload) reloadProfile(false);
    } catch (error) {
      console.error("Failed to load product lines:", error);
    }
  };

  useEffect(() => {
    loadProductLines();
  }, [user]);

  useEffect(() => {
      if (profileReload) loadProductLines(true);
  }, [profileReload, reloadProfile]);

  useEffect(() => {
    if (data.length > 0) {
      transformToDictionaryTemplateConfig(data);
    }
  }, [data, transformToDictionaryTemplateConfig, setDictionaryTemplateConfig]);


  return null; 
}

export default ProductLineManager;