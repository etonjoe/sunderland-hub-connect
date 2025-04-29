
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';

interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: any[];
  type: 'bar' | 'line';
  dataKeys: {
    name: string;
    key: string;
    color: string;
  }[];
  xAxisDataKey: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  description,
  data,
  type,
  dataKeys,
  xAxisDataKey
}) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <XAxis dataKey={xAxisDataKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((dk) => (
                <Bar 
                  key={dk.key} 
                  dataKey={dk.key} 
                  name={dk.name} 
                  fill={dk.color}
                  animationDuration={300}
                  animationEasing="ease-in-out"
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisDataKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((dk) => (
                <Line 
                  key={dk.key} 
                  type="monotone" 
                  dataKey={dk.key} 
                  name={dk.name} 
                  stroke={dk.color} 
                  strokeWidth={2}
                  animationDuration={300}
                  animationEasing="ease-in-out" 
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
