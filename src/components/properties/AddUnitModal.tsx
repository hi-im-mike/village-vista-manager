
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Property, createPropertyUnit } from '@/services/supabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AddUnitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnitAdded?: () => void;
  property: Property;
}

export const AddUnitModal = ({ open, onOpenChange, onUnitAdded, property }: AddUnitModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unitNumber, setUnitNumber] = useState('');
  const [status, setStatus] = useState<'vacant' | 'occupied' | 'maintenance'>('vacant');

  const handleAddUnit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add a unit.",
        variant: "destructive"
      });
      return;
    }
    
    if (!unitNumber.trim()) {
      toast({
        title: "Unit number required",
        description: "Please enter a unit number.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createPropertyUnit({
        property_id: property.id,
        unit_number: unitNumber.trim(),
        status
      });
      
      toast({
        title: "Unit Added",
        description: `Unit ${unitNumber} has been successfully added to ${property.name}.`,
      });
      
      // Reset form and close modal
      resetForm();
      onOpenChange(false);
      
      // Refresh the unit list
      if (onUnitAdded) {
        onUnitAdded();
      }
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        title: "Error",
        description: "Failed to add unit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setUnitNumber('');
    setStatus('vacant');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Unit to {property.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="unitNumber">Unit Number</Label>
            <Input
              id="unitNumber"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              placeholder="e.g., 101, A1, etc."
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as 'vacant' | 'occupied' | 'maintenance')}
              disabled={isSubmitting}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleAddUnit} 
            disabled={isSubmitting || !unitNumber.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Unit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
