import React, { useEffect } from 'react';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdAndDescriptionQuantity,
  EntityWithIdAndDescriptionQuantityFields,
} from '../../../../../../types/baseEntities';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader } from '@mui/material';
import { DownloadButton } from '../../../../../../components/buttons/Buttons';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { grey } from '@mui/material/colors';
import {ButtonExportDropdown} from "../../../../../../components/buttons/ButtonExportDropdown";

const getTextWidth = (text: string, fontSize: number): number => {
  // Create a temporary SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  // Set the text content and font size
  txt.textContent = text;
  txt.setAttribute('style', `font-size: ${fontSize}px`);

  // Append the text to the SVG, and the SVG to the body
  svg.appendChild(txt);
  document.body.appendChild(svg);

  // Get the computed text length and remove the SVG
  const length = txt.getComputedTextLength();
  document.body.removeChild(svg);

  return length;
};

interface BaseSolicitationPieChartProps {
  data: EntityWithIdAndDescriptionQuantity[];
  onDownload: () => void;
  title: string;
}

function BaseSolicitationPieChart({
  data,
  onDownload,
  title,
}: BaseSolicitationPieChartProps) {
  const pieChartRef = React.useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  const RADIAN = Math.PI / 180;

  const COLORS = [
    theme.palette.primary.dark,
    theme.palette.warning.light,
    theme.palette.error.light,
    theme.palette.success.main,
    theme.palette.info.light,
  ];

  const renderSummary = (data: EntityWithIdAndDescriptionQuantity[]) => {
    const basePercent =
      (pieChartRef.current?.clientHeight || 0) < 300 ? 0.15 : 0.35;
    const basePixel = (pieChartRef.current?.clientHeight || 0) * basePercent;
    const maxDescriptionWidth = Math.max(
      ...data.map((entry) =>
        getTextWidth(entry[EntityWithIdAndDescriptionFields.Description], 15),
      ),
    );

    const totals = data.map(
      (entry: EntityWithIdAndDescriptionQuantity, index: any) => (
        <g key={index}>
          <rect
            x={33}
            y={basePixel + 23 * index}
            width={13}
            height={13}
            fill={COLORS[index % COLORS.length]}
          />
          <text
            x={50}
            y={basePixel + 23 * index + 12}
            fontSize={14}
            fill={COLORS[index % COLORS.length]}
          >
            <tspan>{`${entry[EntityWithIdAndDescriptionFields.Description]}:`}</tspan>
            <tspan x={52 + maxDescriptionWidth} fontWeight={600} dy="0">
              {entry[EntityWithIdAndDescriptionQuantityFields.Quantity]}
            </tspan>
          </text>
        </g>
      ),
    );
    return (
      <g key={'summary-title'}>
        <text x={40} y={basePixel - 10} fontSize={14} fill={grey[600]}>
          <tspan>{`Totales`}</tspan>
        </text>
        {totals}
      </g>
    );
  };

  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <Card sx={{ width: '100%', height: '55vh', maxHeight: '500px' }}>
      <CardHeader
        title={title}
        action={
            <ButtonExportDropdown onExportExcel={onDownload} size={'small'} />
        }
        subheader={`Detectamos ${data.reduce((sum, item) => sum + parseInt(item[EntityWithIdAndDescriptionQuantityFields.Quantity]), 0)} de solicitudes para los filtros especificados.`}
      />

      <CardContent sx={{ width: 1, height: 9 / 10, p: 2 }}>
        <ResponsiveContainer width="99%" height={'99%'} ref={pieChartRef}>
          <PieChart
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <Pie
              data={data}
              cx={'60%'}
              cy={'50%'}
              labelLine={false}
              outerRadius={80}
              innerRadius={60}
              fill="#8884d8"
              dataKey={EntityWithIdAndDescriptionQuantityFields.Quantity}
              nameKey={EntityWithIdAndDescriptionFields.Description}
              // label={renderCustomizedLabel}
              paddingAngle={1.5}
              label={({
                cx,
                cy,
                midAngle,
                outerRadius,
                descripcion,
                percent,
                fill,
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 10;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy - 15 + radius * Math.sin(-midAngle * RADIAN);

                const words = descripcion.split(' ');
                const lines = words.reduce(
                  (lines: string[], word: string) => {
                    let currentLine = lines[lines.length - 1];
                    if (`${currentLine} ${word}`.length < 25) {
                      lines[lines.length - 1] = `${currentLine} ${word}`;
                    } else {
                      lines.push(word);
                    }
                    return lines;
                  },
                  [''],
                );

                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fill={fill}
                  >
                    {lines.map((line: string, i: number) => {
                      const isLastLine = i === lines.length - 1;
                      const lineText = isLastLine
                        ? `${line}: ${(percent * 100).toFixed(0)}%`
                        : line;

                      return (
                        <tspan x={x} dy={`${i + 1.2}em`}>
                          {lineText}
                        </tspan>
                      );
                    })}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            {renderSummary(data)}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default BaseSolicitationPieChart;
