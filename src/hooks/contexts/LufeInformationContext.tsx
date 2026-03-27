import {createContext, ReactNode, useEffect, useState} from "react";
import {LufeDetail} from "../../types/lufe/lufeData";
import {HttpLufe} from "../../http/lufe/httpLufe";
import {Document} from "../../types/files/filesData";


type LufeInformationContextType = {
    loading: boolean,
    error: boolean,
    lufeData?: LufeDetail,
    lufeFiles: Document[]
}

export const LufeInformationContext = createContext<LufeInformationContextType>({
    loading: true,
    error: false,
    lufeData: undefined,
    lufeFiles: []
})


interface LufeInformationContextProviderProps {
    lufeRequestId?: number,
    children: ReactNode
}


export const LufeInformationContextProvider = ({ lufeRequestId, children } : LufeInformationContextProviderProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [lufeData, setLufeData] = useState<LufeDetail>();
    const [lufeFiles, setLufeFiles] = useState<Document[]>([])
    
    useEffect(() => {
        if (lufeRequestId) {
            Promise.all([
                HttpLufe.getRequestById(lufeRequestId),
                HttpLufe.getFileLstById(lufeRequestId)
            ])
                .then(([data, files]) => {
                    setLufeData(data)
                    setLufeFiles(files)
                })
                .catch(() => setError(true))
                .finally(() => setLoading(false))   
        }
    }, [lufeRequestId]);

    useEffect(() => {
        
    }, []);
    
    return (
        <LufeInformationContext.Provider value={{
            loading: loading,
            error: error,
            lufeData: lufeData,
            lufeFiles: lufeFiles
        }}>
            {children}
        </LufeInformationContext.Provider>
    )
}