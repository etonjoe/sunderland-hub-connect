
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import PaymentMethodCard from './PaymentMethodCard';
import { useAuth } from '@/contexts/AuthContext';

const PaymentMethods = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading payment methods...</div>;
  }

  if (paymentMethods.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No payment methods found. Add a payment method to manage your subscription.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <PaymentMethodCard key={method.id} paymentMethod={method} />
      ))}
    </div>
  );
};

export default PaymentMethods;
