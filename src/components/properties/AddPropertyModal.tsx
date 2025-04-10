
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddPropertyModal = ({ open, onOpenChange }: AddPropertyModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('property');

  // Property form state
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyUnits, setPropertyUnits] = useState('');
  
  // Investor form state
  const [investorName, setInvestorName] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [investorPassword, setInvestorPassword] = useState('');

  const handleAddProperty = () => {
    // In a real app, this would send data to your backend
    console.log('Adding property:', { propertyName, propertyAddress, propertyUnits });
    
    toast({
      title: "Property Added",
      description: `${propertyName} has been successfully added.`,
    });
    
    // Reset form and close modal
    resetPropertyForm();
    onOpenChange(false);
  };

  const handleAddInvestor = () => {
    // In a real app, this would create a new user with investor role
    console.log('Adding investor:', { investorName, investorEmail, investorPassword });
    
    toast({
      title: "Investor Added",
      description: `${investorName} has been successfully added as an investor.`,
    });
    
    // Reset form and close modal
    resetInvestorForm();
    onOpenChange(false);
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
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="propertyAddress">Address</Label>
                <Input
                  id="propertyAddress"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="Enter property address"
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
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddProperty} disabled={!propertyName || !propertyAddress || !propertyUnits}>
                Add Property
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
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddInvestor} disabled={!investorName || !investorEmail || !investorPassword}>
                Add Investor
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
