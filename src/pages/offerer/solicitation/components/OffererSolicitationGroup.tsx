import React, { useState } from "react";
import { Box, Collapse, IconButton, Stack } from "@mui/material";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { EntityWithIdFields } from "types/baseEntities";
import { SolicitationViewDTO } from "types/solicitations/solicitationData";
import { TypographyBase } from "components/misc/TypographyBase";
import OffererSolicitationCard from "./OffererSolicitationCard";

interface OffererSolicitationGroupProps {
  title: string;
  items: SolicitationViewDTO[];
  defaultExpanded?: boolean;
}

function OffererSolicitationGroup({ title, items, defaultExpanded = true }: OffererSolicitationGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (items.length === 0) return null;

  const toggleGroup = () => setExpanded((prev) => !prev);
  
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "rgb(238,238,238)",
          borderRadius: 4,
          p: 2,
          mb: 1,
            '&:hover': {
              cursor: 'pointer'
            }
        }}
        onClick={toggleGroup}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TypographyBase variant="h6">{title}</TypographyBase>
            <Box
              sx={{
                padding: 1,
                backgroundColor: "white !important",
                borderRadius: "100px",
                minWidth: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TypographyBase variant="body4" color="text.lighter" fontWeight={600}>
                {items.length}
              </TypographyBase>
            </Box>
          </Stack>
          <IconButton onClick={toggleGroup} sx={{ color: "#5B6560" }} variant={'text'}>
            {expanded ? <ChevronUpIcon size={32} /> : <ChevronDownIcon size={32} />}
          </IconButton>
        </Stack>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Stack spacing={2} sx={{ width: "100%", alignItems: { xs: "stretch", md: "flex-start" }, mb: 2 }}>
          {items.map((solicitation) => (
            <OffererSolicitationCard key={solicitation[EntityWithIdFields.Id]} solicitation={solicitation} />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}

export default OffererSolicitationGroup;

