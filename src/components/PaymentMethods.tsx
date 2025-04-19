
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { CreditCard, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PaymentMethodCard from './PaymentMethodCard';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';

interface PaymentFormValues {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const PaymentMethods = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PaymentFormValues>({
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    }
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setPaymentMethods(data || []);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [user]);

  const onSubmit = async (values: PaymentFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // This is a mock implementation - in a real app, you'd use a payment processor like Stripe
      const cardBrand = getCardBrand(values.cardNumber);
      const lastFour = values.cardNumber.slice(-4);
      
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          card_brand: cardBrand,
          card_last_four: lastFour,
          is_default: paymentMethods.length === 0 // Make default if it's the first card
        });
        
      if (error) throw error;
      
      toast.success("Payment method added successfully");
      setOpen(false);
      // Refresh the payment methods list
      const { data } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);
        
      setPaymentMethods(data || []);
      form.reset();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error("Failed to add payment method");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple function to determine card brand based on first digit
  const getCardBrand = (cardNumber: string): string => {
    const firstDigit = cardNumber.charAt(0);
    switch (firstDigit) {
      case '4':
        return 'Visa';
      case '5':
        return 'Mastercard';
      case '3':
        return 'Amex';
      case '6':
        return 'Discover';
      default:
        return 'Card';
    }
  };

  if (loading) {
    return <div>Loading payment methods...</div>;
  }

  return (
    <div className="space-y-4">
      {paymentMethods.length === 0 ? (
        <Alert>
          <AlertDescription>
            No payment methods found. Add a payment method to manage your subscription.
          </AlertDescription>
        </Alert>
      ) : (
        paymentMethods.map((method) => (
          <PaymentMethodCard key={method.id} paymentMethod={method} />
        ))
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="4111 1111 1111 1111" 
                        {...field} 
                        maxLength={19}
                        onChange={(e) => {
                          // Format card number with spaces
                          const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                          const formattedVal = val.replace(/\d{4}(?=.)/g, '$& ');
                          field.onChange(formattedVal);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="MM/YY" 
                          {...field} 
                          maxLength={5}
                          onChange={(e) => {
                            // Format expiry date
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length > 2) {
                              field.onChange(`${val.substring(0, 2)}/${val.substring(2, 4)}`);
                            } else {
                              field.onChange(val);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123" 
                          {...field} 
                          maxLength={4}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            field.onChange(val);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Add Card
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethods;
