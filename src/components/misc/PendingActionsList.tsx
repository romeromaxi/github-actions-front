import { useEffect, useState } from 'react';
import {Card, CardContent, Stack, Collapse, Button, Grid} from '@mui/material';
import { Skeleton } from '@mui/lab';
import {PendingActionView} from "../../types/actions/actionData";
import {TypographyBase} from "./TypographyBase";
import {PendingActionItem} from "./PendingActionItem";

interface PendingActionsListProps {
    fetchActions: () => Promise<PendingActionView[]>;
    title?: string;
    emptyMessage?: string;
    showCompanyInfo?: boolean;
    variant?: 'card' | 'box' | 'standalone';
    actionVariant?: 'card' | 'box';
    actionSize?: 'small' | 'medium' | 'large';
    maxVisibleItems?: number;
    titleVariant?: 'h4' | 'h5';
}

export const PendingActionsList: React.FC<PendingActionsListProps> = ({
    fetchActions,
    title = 'Acciones pendientes',
    emptyMessage,
    showCompanyInfo = true,
    variant = 'standalone',
    actionVariant = 'card',
    actionSize = 'small',
    maxVisibleItems = 5,
    titleVariant = 'h4',
}) => {
    const [actions, setActions] = useState<PendingActionView[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expanded, setExpanded] = useState<boolean>(false);

    const reloadActions = async () => {
        setLoading(true);
        try {
            const data = await fetchActions();
            setActions(data);
        } catch {
            setActions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reloadActions();
    }, []);

    const hasMore = actions.length > maxVisibleItems;
    const titleText = `${title} ${actions.length !== 0 ? `(${actions.length})` : ''}`;

    const renderContent = () => {
        if (loading) {
            return (
                <Stack spacing={2}>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} sx={{ '&:hover': { boxShadow: 3 }, transition: 'box-shadow 0.3s ease' }}>
                            <CardContent>
                                <Skeleton variant="rectangular" height={60} />
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            );
        }

        if (actions.length === 0) {
            return (
                <TypographyBase 
                    variant={'h6'} 
                    color={'text.secondary'} 
                    textAlign={'center'} 
                    sx={{py: 4}}
                >
                    {emptyMessage}
                </TypographyBase>
            );
        }

        return (
            <Stack spacing={2}>
                {actions.slice(0, maxVisibleItems).map((action) => (
                    <PendingActionItem 
                        key={action.id} 
                        action={action} 
                        onReload={reloadActions}
                        showCompanyInfo={showCompanyInfo}
                        variant={actionVariant}
                        size={actionSize}
                    />
                ))}
                {hasMore && (
                    <Collapse in={expanded}>
                        <Stack spacing={2}>
                            {actions.slice(maxVisibleItems).map((action) => (
                                <PendingActionItem 
                                    key={action.id} 
                                    action={action} 
                                    onReload={reloadActions}
                                    showCompanyInfo={showCompanyInfo}
                                    variant={actionVariant}
                                    size={actionSize}
                                />
                            ))}
                        </Stack>
                    </Collapse>
                )}
                {hasMore && (
                    <Button variant="text"
                            fullWidth
                            onClick={() => setExpanded(!expanded)}
                            sx={{ marginTop: !expanded ? '0px !important' : 'auto' }}
                    >
                        {expanded ? 'Ver menos' : 'Ver más'}
                    </Button>
                )}
            </Stack>
        );
    };
    
    if (!emptyMessage && !actions.length)
        return <div />

    if (variant === 'card') {
        return (
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <TypographyBase variant={titleVariant} fontWeight={600}>
                            {titleText}
                        </TypographyBase>
                        {renderContent()}
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    return (
        <Grid item xs={12}>
            <Stack sx={{ width: '100%' }} spacing={4}>
                <TypographyBase variant={titleVariant} fontWeight={600}>
                    {titleText}
                </TypographyBase>
                {renderContent()}
            </Stack>
        </Grid>
    );
};

