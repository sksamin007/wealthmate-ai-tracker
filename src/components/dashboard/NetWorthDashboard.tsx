
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  calculateNetWorth, 
  getAssets, 
  getLiabilities,
  getMonthlyRecords,
  Asset,
  Liability,
  MonthlyRecord
} from "@/services/netWorthService";
import NetWorthChart from "./NetWorthChart";
import AssetsList from "./AssetsList";
import LiabilitiesList from "./LiabilitiesList";
import TrendChart from "./TrendChart";

const NetWorthDashboard = () => {
  const [netWorth, setNetWorth] = useState(0);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([]);

  useEffect(() => {
    const fetchData = () => {
      setAssets(getAssets());
      setLiabilities(getLiabilities());
      setNetWorth(calculateNetWorth());
      setMonthlyRecords(getMonthlyRecords());
    };

    fetchData();

    // Listen for storage changes from other tabs
    window.addEventListener('storage', fetchData);
    
    return () => {
      window.removeEventListener('storage', fetchData);
    };
  }, []);

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">
              ${netWorth.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
              ${totalAssets.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">
              ${totalLiabilities.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Net Worth Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <NetWorthChart assets={totalAssets} liabilities={totalLiabilities} />
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <TrendChart data={monthlyRecords} />
        </CardContent>
      </Card>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-[400px] max-w-full">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
        </TabsList>
        <TabsContent value="assets" className="space-y-4">
          <AssetsList assets={assets} />
        </TabsContent>
        <TabsContent value="liabilities" className="space-y-4">
          <LiabilitiesList liabilities={liabilities} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetWorthDashboard;
