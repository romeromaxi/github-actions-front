import {Card, CardContent, Stack} from "@mui/material";
import RelationshipPersonMap from "./RelationshipPersonMap";
import TabSectionCardHeader from "../../../../components/cards/TabSectionCardHeader";
import {Graph} from "phosphor-react";
import {PersonRelationship} from "../../../../types/person/personData";
import {useEffect, useState} from "react";
import {HttpClientPortfolioPersons} from "../../../../http/clientPortfolio/httpClientPortfolioPersons";
import {Skeleton} from "@mui/lab";


interface RelationshipMapGraphProps {
    clientPortfolioGuid?: string;
}


const RelationshipMapGraph = ({clientPortfolioGuid}: RelationshipMapGraphProps) => {
    const [relationshipMap, setRelationshipMap] = useState<PersonRelationship[]>();

    useEffect(() => {
        if (clientPortfolioGuid) HttpClientPortfolioPersons.getRelationshipMapList(clientPortfolioGuid).then(setRelationshipMap);
    }, [clientPortfolioGuid]);
    
    
    return (
        <Stack spacing={2}>
            <TabSectionCardHeader icon={Graph}
                                  sectionTitle={'Mapa de relaciones'}
            />
            <Card>
                <CardContent>
                    {
                        !relationshipMap ?
                        <Skeleton />
                            :
                            <RelationshipPersonMap relationshipData={relationshipMap} />
                    }
                </CardContent>
            </Card>
        </Stack>
    )
}


export default RelationshipMapGraph