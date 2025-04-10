
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PropertyUnit, createTenant } from '@/services/supabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface AddTenantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTenantAdded?: () => void;
  unit: PropertyUnit;
}

export const AddTenantModal = ({ open, onOpenChange, onTenantAdded, unit }: AddTenantModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [monthlyRent, setMonthlyRent] = useState('');
  const [leaseStart, setLeaseStart] = useState<Date | undefined>(undefined);
  const [leaseEnd, setLeaseEnd] = useState<Date | undefined>(undefined);
  const [moveInDate, setMoveInDate] = useState<Date | undefined>(undefined);

  const handleAddTenant = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add a tenant.",
        variant: "destructive"
      });
      return;
    }
    
    if (!userId.trim()) {
      toast({
        title: "User ID required",
        description: "Please enter a user ID.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createTenant({
        unit_id: unit.id,
        user_id: userId.trim(),
        is_primary: isPrimary,
        monthly_rent: monthlyRent ? parseFloat(monthlyRent) : undefined,
        lease_start: leaseStart ? leaseStart.toISOString() : undefined,
        lease_end: leaseEnd ? leaseEnd.toISOString() : undefined,
        move_in_date: moveInDate ? moveInDate.toISOString() : undefined
      });
      
      toast({
        title: "Tenant Added",
        description: `Tenant has been successfully added to Unit ${unit.unit_number}.`,
      });
      
      // Reset form and close modal
      resetForm();
      onOpenChange(false);
      
      // Refresh the tenant list
      if (onTenantAdded) {
        onTenantAdded();
      }
    } catch (error) {
      console.error('Error adding tenant:', error);
      toast({
        title: "Error",
        description: "Failed to add tenant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setUserId('');
    setIsPrimary(false);
    setMonthlyRent('');
    setLeaseStart(undefined);
    setLeaseEnd(undefined);
    setMoveInDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Tenant to Unit {unit.unit_number}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter the user's ID"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPrimary"
              checked={isPrimary}
              onCheckedChange={(checked) => setIsPrimary(checked === true)}
            />
            <Label htmlFor="isPrimary">Primary Tenant</Label>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="monthlyRent">Monthly Rent</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <Input
                id="monthlyRent"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="0.00"
                className="pl-7"
                type="number"
                min="0"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Lease Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !leaseStart && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {leaseStart ? format(leaseStart, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={leaseStart}
                    onSelect={setLeaseStart}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label>Lease End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !leaseEnd && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {leaseEnd ? format(leaseEnd, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={leaseEnd}
                    onSelect={setLeaseEnd}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Move In Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !moveInDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {moveInDate ? format(moveInDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={moveInDate}
                  onSelect={setMoveInDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleAddTenant} 
            disabled={isSubmitting || !userId.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Tenant'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
