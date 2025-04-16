
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    description: string;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <div className="mt-2 flex items-center">
            <Badge variant={trend.isPositive ? 'default' : 'destructive'} className={trend.isPositive ? 'bg-green-500' : ''}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Badge>
            <span className="ml-2 text-xs text-muted-foreground">{trend.description}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
