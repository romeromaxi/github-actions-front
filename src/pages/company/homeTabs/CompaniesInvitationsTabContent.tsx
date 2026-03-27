import {Card, CardHeader, CardContent, Stack, Typography} from "@mui/material";
import {BaseIconWrapper} from "../../../components/icons/Icons";
import {BuildingOffice} from "@phosphor-icons/react";
import React, {useEffect, useState} from "react";
import {HttpInvitations} from "../../../http/invitations";
import {HttpUserInvitations} from "../../../http/user/httpUserInvitations";
import {UserInvitationFromCompany} from "../../../types/invitations/invitationData";
import {CompanyUserInvitation} from "../../../types/user/userInvitation";
import CardItemsNotFound from "../../../components/cards/CardItemsNotFound";
import CompanyInvitesAsResponsibleBox from "../components/CompanyInvitesAsResponsibleBox";
import CompanyInvitesBox from "../components/CompanyInvitesBox";
import CompanySentInvitesCard from "../components/CompanySentInvitesCard";
import {Skeleton} from "@mui/lab";


const CompaniesInvitationsTabContent = () => {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [sentInvites, setSentInvites] = useState<UserInvitationFromCompany[]>();
    const [invitesAsResponsible, setInvitesAsResponsible] = useState<UserInvitationFromCompany[]>();
    const [invites, setInvites] = useState<CompanyUserInvitation[]>();

    const loadInvitations = () => {
        setLoading(true)
        Promise.all([
            HttpInvitations.getSentInvitations(),
            HttpInvitations.getPendingInvitationsAsResponsible(),
            HttpUserInvitations.getCompanyInvitations()
        ])
        .then((values) => {
            setSentInvites(values[0])
            setInvitesAsResponsible(values[1])
            setInvites(values[2])
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        loadInvitations();
    }, []);
    const mapLoadings = () =>
        <Stack spacing={2}>
            {Array.from(Array(3).keys()).map((item) => (
                <Card>
                    <CardContent>
                        <Stack spacing={1}>
                            <Skeleton sx={{width: '40% !important'}}/>
                            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                <Skeleton sx={{width: '25% !important', height: '30px !important'}} />
                                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                    <Skeleton sx={{width: '100px !important'}} />
                                    <Skeleton variant="circular" width={30} height={30}/>
                                </Stack>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    
    const mapReceivedInvitations = () =>
        <Stack spacing={2}>
            {invitesAsResponsible && invitesAsResponsible.length !== 0 &&
                invitesAsResponsible.map((invRes, idx) =>
                    <CompanyInvitesAsResponsibleBox invite={invRes}
                                                    onSubmit={loadInvitations}
                                                    key={`responsibleInvitation_${idx}`}
                    />
                )
            }
            {invites && invites.length !== 0 &&
                invites.map((inv, idx) =>
                    <CompanyInvitesBox invite={inv} onSubmit={loadInvitations} key={`companiesUserInvitation_${idx}`}/>
                )
            }
            {
                (!invitesAsResponsible || invitesAsResponsible.length == 0) && (!invites || invites.length == 0) &&
                <CardItemsNotFound title={'No hay invitaciones pendientes'} />
            }
        </Stack>
        
    const mapSentInvitations = () =>
        <Stack spacing={2}>
            {sentInvites && sentInvites.length !== 0 &&
                sentInvites.map((inv, idx) =>
                    <CompanySentInvitesCard invite={inv} key={`sentInvitation_${idx}`} />
                )
            }
            {!sentInvites || sentInvites.length == 0 &&
                <CardItemsNotFound title={'No hay invitaciones pendientes'} />
            }
        </Stack>
    
    return (
        <Stack spacing={2}>
            <Card>
                <CardHeader title={
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <BaseIconWrapper Icon={BuildingOffice} size={'md'} bg={'#F7FAFC'} />
                        <Typography variant={'h4'} fontWeight={500}>Invitaciones</Typography>
                    </Stack>
                } />
            </Card>
            <Card>
                <CardHeader title={'Recibidas'} />
                <CardContent>
                    {isLoading ? mapLoadings() : mapReceivedInvitations()}
                </CardContent>
            </Card>
            <Card>
                <CardHeader title={'Enviadas'} />
                <CardContent>
                    {isLoading ? mapLoadings() : mapSentInvitations()}
                </CardContent>
            </Card>
        </Stack>
    )
}


export default CompaniesInvitationsTabContent