
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { createProperty, createUser } from '@/services/supabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPropertyAdded?: () => void;
}

export const AddPropertyModal = ({ open, onOpenChange, onPropertyAdded }: AddPropertyModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('property');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Property form state
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyUnits, setPropertyUnits] = useState('');
  
  // Investor form state
  const [investorName, setInvestorName] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [investorPassword, setInvestorPassword] = useState('');

  const handleAddProperty = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add a property.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createProperty({
        name: propertyName,
        address: propertyAddress,
        units: parseInt(propertyUnits),
        created_by: user.id
      });
      
      toast({
        title: "Property Added",
        description: `${propertyName} has been successfully added.`,
      });
      
      // Reset form and close modal
      resetPropertyForm();
      onOpenChange(false);
      
      // Refresh the property list
      if (onPropertyAdded) {
        onPropertyAdded();
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddInvestor = async () => {
    setIsSubmitting(true);
    try {
      await createUser({
        name: investorName,
        email: investorEmail,
        password: investorPassword,
        role: 'investor'
      });
      
      toast({
        title: "Investor Added",
        description: `${investorName} has been successfully added as an investor.`,
      });
      
      // Reset form and close modal
      resetInvestorForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding investor:', error);
      toast({
        title: "Error",
        description: "Failed to add investor. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPropertyForm = () => {
    setPropertyName('');
    setPropertyAddress('');
    setPropertyUnits('');
  };

  const resetInvestorForm = () => {
    setInvestorName('');
    setInvestorEmail('');
    setInvestorPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="property">Property</TabsTrigger>
            <TabsTrigger value="investor">Investor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="property" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="propertyName">Property Name</Label>
                <Input
                  id="propertyName"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="Enter property name"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="propertyAddress">Address</Label>
                <Input
                  id="propertyAddress"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="Enter property address"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="propertyUnits">Number of Units</Label>
                <Input
                  id="propertyUnits"
                  type="number"
                  value={propertyUnits}
                  onChange={(e) => setPropertyUnits(e.target.value)}
                  placeholder="Enter number of units"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleAddProperty} 
                disabled={isSubmitting || !propertyName || !propertyAddress || !propertyUnits}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Property'
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="investor" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="investorName">Full Name</Label>
                <Input
                  id="investorName"
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  placeholder="Enter investor name"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="investorEmail">Email</Label>
                <Input
                  id="investorEmail"
                  type="email"
                  value={investorEmail}
                  onChange={(e) => setInvestorEmail(e.target.value)}
                  placeholder="Enter investor email"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="investorPassword">Password</Label>
                <Input
                  id="investorPassword"
                  type="password"
                  value={investorPassword}
                  onChange={(e) => setInvestorPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleAddInvestor} 
                disabled={isSubmitting || !investorName || !investorEmail || !investorPassword}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Investor'
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
