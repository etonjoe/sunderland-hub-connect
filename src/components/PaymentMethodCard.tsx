
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PaymentMethod {
  card_brand: string | null;
  card_last_four: string | null;
  is_default: boolean | null;
}

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
}

const PaymentMethodCard = ({ paymentMethod }: PaymentMethodCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <CreditCard className="h-6 w-6 text-muted-foreground" />
        <CardTitle className="text-lg">
          {paymentMethod.card_brand} •••• {paymentMethod.card_last_four}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {paymentMethod.is_default ? "Default payment method" : ""}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
