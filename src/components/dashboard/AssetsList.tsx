
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Asset, addAsset, updateAsset, deleteAsset } from "@/services/netWorthService";

interface AssetsListProps {
  assets: Asset[];
}

const AssetsList = ({ assets }: AssetsListProps) => {
  const [open, setOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState<Asset["category"]>("cash");

  const handleSave = () => {
    const assetValue = parseFloat(value);
    if (!name || isNaN(assetValue) || assetValue < 0) return;

    if (editAsset) {
      updateAsset({
        id: editAsset.id,
        name,
        value: assetValue,
        category
      });
    } else {
      addAsset({
        name,
        value: assetValue,
        category
      });
    }
    
    handleClose();
  };

  const handleEdit = (asset: Asset) => {
    setEditAsset(asset);
    setName(asset.name);
    setValue(asset.value.toString());
    setCategory(asset.category);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      deleteAsset(id);
    }
  };

  const handleClose = () => {
    setEditAsset(null);
    setName("");
    setValue("");
    setCategory("cash");
    setOpen(false);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cash': return 'Cash';
      case 'investments': return 'Investments';
      case 'property': return 'Property';
      case 'other': return 'Other';
      default: return category;
    }
  };

  // Group assets by category
  const assetsByCategory: Record<string, Asset[]> = {};
  assets.forEach(asset => {
    if (!assetsByCategory[asset.category]) {
      assetsByCategory[asset.category] = [];
    }
    assetsByCategory[asset.category].push(asset);
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Your Assets</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editAsset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  Value ($)
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as Asset["category"])}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="investments">Investments</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {Object.entries(assetsByCategory).map(([category, categoryAssets]) => (
          <Card key={category} className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">{getCategoryLabel(category)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between border-b border-border py-2"
                  >
                    <span className="font-medium">{asset.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-green-600 dark:text-green-500">
                        ${asset.value.toLocaleString()}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(asset)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(asset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {assets.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No assets added yet. Click "Add Asset" to get started.
          </div>
        )}
      </div>
    </>
  );
};

export default AssetsList;
