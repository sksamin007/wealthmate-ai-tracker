
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
import { Liability, addLiability, updateLiability, deleteLiability } from "@/services/netWorthService";

interface LiabilitiesListProps {
  liabilities: Liability[];
}

const LiabilitiesList = ({ liabilities }: LiabilitiesListProps) => {
  const [open, setOpen] = useState(false);
  const [editLiability, setEditLiability] = useState<Liability | null>(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState<Liability["category"]>("shortTerm");

  const handleSave = () => {
    const liabilityValue = parseFloat(value);
    if (!name || isNaN(liabilityValue) || liabilityValue < 0) return;

    if (editLiability) {
      updateLiability({
        id: editLiability.id,
        name,
        value: liabilityValue,
        category
      });
    } else {
      addLiability({
        name,
        value: liabilityValue,
        category
      });
    }
    
    handleClose();
  };

  const handleEdit = (liability: Liability) => {
    setEditLiability(liability);
    setName(liability.name);
    setValue(liability.value.toString());
    setCategory(liability.category);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this liability?")) {
      deleteLiability(id);
    }
  };

  const handleClose = () => {
    setEditLiability(null);
    setName("");
    setValue("");
    setCategory("shortTerm");
    setOpen(false);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'shortTerm': return 'Short-Term Debt';
      case 'longTerm': return 'Long-Term Debt';
      default: return category;
    }
  };

  // Group liabilities by category
  const liabilitiesByCategory: Record<string, Liability[]> = {};
  liabilities.forEach(liability => {
    if (!liabilitiesByCategory[liability.category]) {
      liabilitiesByCategory[liability.category] = [];
    }
    liabilitiesByCategory[liability.category].push(liability);
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Your Liabilities</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Liability
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editLiability ? "Edit Liability" : "Add New Liability"}</DialogTitle>
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
                  onValueChange={(value) => setCategory(value as Liability["category"])}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shortTerm">Short-Term Debt</SelectItem>
                    <SelectItem value="longTerm">Long-Term Debt</SelectItem>
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
        {Object.entries(liabilitiesByCategory).map(([category, categoryLiabilities]) => (
          <Card key={category} className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">{getCategoryLabel(category)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryLiabilities.map((liability) => (
                  <div
                    key={liability.id}
                    className="flex items-center justify-between border-b border-border py-2"
                  >
                    <span className="font-medium">{liability.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-red-600 dark:text-red-500">
                        ${liability.value.toLocaleString()}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(liability)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(liability.id)}
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

        {liabilities.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No liabilities added yet. Click "Add Liability" to get started.
          </div>
        )}
      </div>
    </>
  );
};

export default LiabilitiesList;
