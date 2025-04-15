
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { FinancialGoal, getGoals, addGoal, updateGoal, deleteGoal } from "@/services/netWorthService";

const GoalPlanner = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [open, setOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<FinancialGoal | null>(null);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const loadGoals = () => {
      setGoals(getGoals());
    };

    loadGoals();

    window.addEventListener('storage', loadGoals);
    
    return () => {
      window.removeEventListener('storage', loadGoals);
    };
  }, []);

  const handleSave = () => {
    const targetAmtValue = parseFloat(targetAmount);
    const currentAmtValue = parseFloat(currentAmount);
    
    if (!name || isNaN(targetAmtValue) || targetAmtValue <= 0 || 
        isNaN(currentAmtValue) || currentAmtValue < 0 || !deadline) {
      return;
    }

    if (editGoal) {
      updateGoal({
        id: editGoal.id,
        name,
        targetAmount: targetAmtValue,
        currentAmount: currentAmtValue,
        deadline
      });
    } else {
      addGoal({
        name,
        targetAmount: targetAmtValue,
        currentAmount: currentAmtValue,
        deadline
      });
    }
    
    handleClose();
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditGoal(goal);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setDeadline(goal.deadline.split('T')[0]); // Extract only the date part
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteGoal(id);
    }
  };

  const handleClose = () => {
    setEditGoal(null);
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setDeadline("");
    setOpen(false);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const calculateMonthlyContribution = (goal: FinancialGoal) => {
    const deadlineDate = new Date(goal.deadline);
    const today = new Date();
    
    // Calculate months between today and deadline
    const monthsRemaining = (deadlineDate.getFullYear() - today.getFullYear()) * 12 + 
                           (deadlineDate.getMonth() - today.getMonth());
    
    if (monthsRemaining <= 0) {
      return "Deadline passed";
    }
    
    const amountRemaining = goal.targetAmount - goal.currentAmount;
    
    if (amountRemaining <= 0) {
      return "Goal reached!";
    }
    
    const monthlyAmount = amountRemaining / monthsRemaining;
    return `$${monthlyAmount.toFixed(2)}/month`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gradient">Financial Goals</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editGoal ? "Edit Goal" : "Add New Financial Goal"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Goal Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetAmount" className="text-right">
                  Target Amount ($)
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  min="1"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentAmount" className="text-right">
                  Current Amount ($)
                </Label>
                <Input
                  id="currentAmount"
                  type="number"
                  min="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deadline" className="text-right">
                  Target Date
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="col-span-3"
                />
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

      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal) => (
          <Card key={goal.id} className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>{goal.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(goal)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">
                      ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={calculateProgress(goal.currentAmount, goal.targetAmount)} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Target Date</p>
                    <p className="font-medium">{formatDate(goal.deadline)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Contribution</p>
                    <p className="font-medium">{calculateMonthlyContribution(goal)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {goals.length === 0 && (
          <Card className="col-span-full glass-card">
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">
                No financial goals added yet. Click "Add Goal" to start planning your financial future.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GoalPlanner;
