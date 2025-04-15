
// Types
export interface Asset {
  id: string;
  name: string;
  value: number;
  category: 'cash' | 'investments' | 'property' | 'other';
}

export interface Liability {
  id: string;
  name: string;
  value: number;
  category: 'shortTerm' | 'longTerm';
}

export interface MonthlyRecord {
  date: string; // ISO format
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
}

// Initial data
const initialAssets: Asset[] = [
  { id: '1', name: 'Checking Account', value: 5000, category: 'cash' },
  { id: '2', name: 'Savings Account', value: 10000, category: 'cash' },
  { id: '3', name: 'Stock Portfolio', value: 25000, category: 'investments' }
];

const initialLiabilities: Liability[] = [
  { id: '1', name: 'Credit Card', value: 2000, category: 'shortTerm' },
  { id: '2', name: 'Car Loan', value: 15000, category: 'longTerm' }
];

const initialMonthlyRecords: MonthlyRecord[] = [
  {
    date: new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString(),
    netWorth: 18000,
    totalAssets: 35000,
    totalLiabilities: 17000
  },
  {
    date: new Date(new Date().setMonth(new Date().getMonth() - 4)).toISOString(),
    netWorth: 19500,
    totalAssets: 37000,
    totalLiabilities: 17500
  },
  {
    date: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
    netWorth: 20200,
    totalAssets: 38000,
    totalLiabilities: 17800
  },
  {
    date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
    netWorth: 22000,
    totalAssets: 39000,
    totalLiabilities: 17000
  },
  {
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    netWorth: 23000,
    totalAssets: 40000,
    totalLiabilities: 17000
  }
];

const initialGoals: FinancialGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 20000,
    currentAmount: 10000,
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString()
  },
  {
    id: '2',
    name: 'Vacation',
    targetAmount: 5000,
    currentAmount: 1500,
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString()
  }
];

// localStorage Keys
const ASSETS_KEY = 'wealthmate-assets';
const LIABILITIES_KEY = 'wealthmate-liabilities';
const MONTHLY_RECORDS_KEY = 'wealthmate-monthly-records';
const GOALS_KEY = 'wealthmate-goals';

// Helper functions
const getItem = <T>(key: string, initialData: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialData;
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return initialData;
  }
};

const setItem = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

// Data services
export const getAssets = (): Asset[] => getItem(ASSETS_KEY, initialAssets);
export const getLiabilities = (): Liability[] => getItem(LIABILITIES_KEY, initialLiabilities);
export const getMonthlyRecords = (): MonthlyRecord[] => getItem(MONTHLY_RECORDS_KEY, initialMonthlyRecords);
export const getGoals = (): FinancialGoal[] => getItem(GOALS_KEY, initialGoals);

export const saveAssets = (assets: Asset[]): void => setItem(ASSETS_KEY, assets);
export const saveLiabilities = (liabilities: Liability[]): void => setItem(LIABILITIES_KEY, liabilities);
export const saveMonthlyRecords = (records: MonthlyRecord[]): void => setItem(MONTHLY_RECORDS_KEY, records);
export const saveGoals = (goals: FinancialGoal[]): void => setItem(GOALS_KEY, goals);

export const calculateNetWorth = (): number => {
  const assets = getAssets();
  const liabilities = getLiabilities();
  
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0);
  
  return totalAssets - totalLiabilities;
};

export const recordMonthlyNetWorth = (): void => {
  const assets = getAssets();
  const liabilities = getLiabilities();
  
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0);
  const netWorth = totalAssets - totalLiabilities;
  
  const newRecord: MonthlyRecord = {
    date: new Date().toISOString(),
    netWorth,
    totalAssets,
    totalLiabilities
  };
  
  const records = getMonthlyRecords();
  saveMonthlyRecords([...records, newRecord]);
};

export const addAsset = (asset: Omit<Asset, 'id'>): Asset => {
  const assets = getAssets();
  const newAsset = { ...asset, id: Date.now().toString() };
  saveAssets([...assets, newAsset]);
  return newAsset;
};

export const addLiability = (liability: Omit<Liability, 'id'>): Liability => {
  const liabilities = getLiabilities();
  const newLiability = { ...liability, id: Date.now().toString() };
  saveLiabilities([...liabilities, newLiability]);
  return newLiability;
};

export const addGoal = (goal: Omit<FinancialGoal, 'id'>): FinancialGoal => {
  const goals = getGoals();
  const newGoal = { ...goal, id: Date.now().toString() };
  saveGoals([...goals, newGoal]);
  return newGoal;
};

export const updateAsset = (asset: Asset): void => {
  const assets = getAssets();
  const index = assets.findIndex(a => a.id === asset.id);
  if (index !== -1) {
    assets[index] = asset;
    saveAssets(assets);
  }
};

export const updateLiability = (liability: Liability): void => {
  const liabilities = getLiabilities();
  const index = liabilities.findIndex(l => l.id === liability.id);
  if (index !== -1) {
    liabilities[index] = liability;
    saveLiabilities(liabilities);
  }
};

export const updateGoal = (goal: FinancialGoal): void => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === goal.id);
  if (index !== -1) {
    goals[index] = goal;
    saveGoals(goals);
  }
};

export const deleteAsset = (id: string): void => {
  const assets = getAssets();
  saveAssets(assets.filter(a => a.id !== id));
};

export const deleteLiability = (id: string): void => {
  const liabilities = getLiabilities();
  saveLiabilities(liabilities.filter(l => l.id !== id));
};

export const deleteGoal = (id: string): void => {
  const goals = getGoals();
  saveGoals(goals.filter(g => g.id !== id));
};
