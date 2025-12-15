import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export function Keypad({ onKeyPress, onDelete, onClear }: KeypadProps) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {keys.map((key) => (
        <Button
          key={key}
          variant="keypad"
          size="keypad"
          onClick={() => onKeyPress(key)}
        >
          {key}
        </Button>
      ))}
      <Button
        variant="keypad"
        size="keypad"
        onClick={onDelete}
        className="text-destructive"
      >
        <Delete className="h-6 w-6" />
      </Button>
    </div>
  );
}
