import {useContext} from "react";
import {LufeInformationContext} from "../../../../../hooks/contexts/LufeInformationContext";
import {Alert, Card, CardContent} from "@mui/material";
import FileDocumentList from "../../../../../components/files/FileDocumentList";


const OffererLufeFiles = () => {
    const { lufeFiles, error } = useContext(LufeInformationContext)
    
    return (
        <Card>
            <CardContent>
                {
                    error ?
                        <Alert severity='error'>Ocurrió un error al cargar los archivos</Alert>
                        :
                        <FileDocumentList filesDocument={lufeFiles}
                                          download
                                          preview
                        />
                }
            </CardContent>
        </Card>
    )
}


export default OffererLufeFiles