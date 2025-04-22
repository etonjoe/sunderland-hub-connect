
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimeFilterProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const TimeFilter = ({ selectedPeriod, onPeriodChange }: TimeFilterProps) => {
  return (
    <div className="flex justify-end">
      <Tabs value={selectedPeriod} onValueChange={onPeriodChange} className="w-[400px]">
        <TabsList>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="quarter">Quarter</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TimeFilter;
