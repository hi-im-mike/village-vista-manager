
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tenant, updateTenant } from '@/services/supabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Calculator } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RentCalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant;
  onRentUpdated?: (tenantId: string, newRent: number) => void;
}

export const RentCalculatorModal = ({ 
  open, 
  onOpenChange, 
  tenant, 
  onRentUpdated 
}: RentCalculatorModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculationType, setCalculationType] = useState<'percentage' | 'fixed'>('percentage');
  const [currentRent, setCurrentRent] = useState<number>(tenant.monthly_rent || 0);
  const [percentageIncrease, setPercentageIncrease] = useState<string>('5');
  const [fixedIncrease, setFixedIncrease] = useState<string>('50');
  const [newRent, setNewRent] = useState<number>(currentRent);

  // Recalculate the new rent whenever inputs change
  useEffect(() => {
    if (calculationType === 'percentage') {
      const percentage = parseFloat(percentageIncrease) || 0;
      setNewRent(currentRent * (1 + percentage / 100));
    } else {
      const fixed = parseFloat(fixedIncrease) || 0;
      setNewRent(currentRent + fixed);
    }
  }, [currentRent, calculationType, percentageIncrease, fixedIncrease]);

  const handleUpdateRent = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update rent.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateTenant(tenant.id, {
        monthly_rent: newRent,
      });
      
      toast({
        title: "Rent Updated",
        description: `Monthly rent has been updated to $${newRent.toFixed(2)}.`,
      });
      
      onOpenChange(false);
      
      // Notify parent component
      if (onRentUpdated) {
        onRentUpdated(tenant.id, newRent);
      }
    } catch (error) {
      console.error('Error updating rent:', error);
      toast({
        title: "Error",
        description: "Failed to update rent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <span>Rent Calculator</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="currentRent">Current Monthly Rent</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <Input
                id="currentRent"
                value={currentRent.toString()}
                onChange={(e) => setCurrentRent(parseFloat(e.target.value) || 0)}
                className="pl-7"
                type="number"
                min="0"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <Tabs defaultValue="percentage" onValueChange={(value) => setCalculationType(value as 'percentage' | 'fixed')}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="percentage">Percentage Increase</TabsTrigger>
              <TabsTrigger value="fixed">Fixed Amount</TabsTrigger>
            </TabsList>
            
            <TabsContent value="percentage" className="space-y-4 mt-2">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="percentageIncrease">Percentage Increase</Label>
                  <span className="text-sm text-muted-foreground">{percentageIncrease}%</span>
                </div>
                
                <div className="relative">
                  <RadioGroup className="flex justify-between mb-2" defaultValue="5" onValueChange={setPercentageIncrease}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="r1" />
                      <Label htmlFor="r1">3%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="r2" />
                      <Label htmlFor="r2">5%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="7" id="r3" />
                      <Label htmlFor="r3">7%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10" id="r4" />
                      <Label htmlFor="r4">10%</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="relative">
                    <Input
                      id="percentageIncrease"
                      value={percentageIncrease}
                      onChange={(e) => setPercentageIncrease(e.target.value)}
                      className="pr-8"
                      type="number"
                      min="0"
                      step="0.1"
                      disabled={isSubmitting}
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="fixed" className="space-y-4 mt-2">
              <div className="grid gap-2">
                <Label htmlFor="fixedIncrease">Fixed Amount Increase</Label>
                <div className="relative">
                  <RadioGroup className="flex justify-between mb-2" defaultValue="50" onValueChange={setFixedIncrease}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="25" id="f1" />
                      <Label htmlFor="f1">$25</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50" id="f2" />
                      <Label htmlFor="f2">$50</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="75" id="f3" />
                      <Label htmlFor="f3">$75</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="100" id="f4" />
                      <Label htmlFor="f4">$100</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                    <Input
                      id="fixedIncrease"
                      value={fixedIncrease}
                      onChange={(e) => setFixedIncrease(e.target.value)}
                      className="pl-7"
                      type="number"
                      min="0"
                      step="1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Rent</p>
                <p className="text-lg font-semibold">${currentRent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {calculationType === 'percentage' ? 'Increase Amount' : 'Fixed Increase'}
                </p>
                <p className="text-lg font-semibold">
                  {calculationType === 'percentage' 
                    ? `$${(newRent - currentRent).toFixed(2)} (${percentageIncrease}%)` 
                    : `$${fixedIncrease}`
                  }
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">New Calculated Rent</p>
              <p className="text-2xl font-bold text-green-600">${newRent.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateRent} 
            disabled={isSubmitting || newRent === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Rent'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
