import { Button } from "@/components/ui/button";

interface QuickAmountButtonProps {
  amount: number;
  onClick: (amount: number) => void;
}

export function QuickAmountButton({ amount, onClick }: QuickAmountButtonProps) {
  return (
    <Button
      variant="quickAmount"
      size="quick"
      onClick={() => onClick(amount)}
      className="min-w-[80px]"
    >
      R{amount}
    </Button>
  );
}
