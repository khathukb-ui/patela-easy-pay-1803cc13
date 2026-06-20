import { useMemo, useState } from "react";
import { Delete, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStaffPinStoreId, StaffUser, verifyStaffPin } from "@/services/staff-pin-service";
import { toast } from "sonner";

interface StaffPinScreenProps {
    onVerified: (staffUser: StaffUser) => void;
    onCancel: () => void;
}

const PIN_LENGTH = 4;
const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"];

export function StaffPinScreen({ onVerified, onCancel }: StaffPinScreenProps) {
    const [pin, setPin] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const storeId = useMemo(() => getStaffPinStoreId(), []);

    const submitPin = async (nextPin = pin) => {
        const cleanPin = nextPin.replace(/\D/g, "").slice(0, PIN_LENGTH);

        if (cleanPin.length !== PIN_LENGTH) {
            setError(`Enter ${PIN_LENGTH} digits to continue.`);
            return;
        }

        setIsVerifying(true);
        setError(null);

        try {
            const result = await verifyStaffPin(cleanPin);

            if (!result.verified || !result.user) {
                setPin("");
                setError(result.message || "Incorrect PIN. Please try again.");
                toast.error(result.message || "Incorrect PIN");
                return;
            }

            setPin("");
            toast.success("Staff PIN verified");
            onVerified(result.user);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleKeyPress = (key: string) => {
        if (isVerifying) return;

        setError(null);

        if (key === "clear") {
            setPin("");
            return;
        }

        if (key === "back") {
            setPin((currentPin) => currentPin.slice(0, -1));
            return;
        }

        if (!/^\d$/.test(key)) return;

        setPin((currentPin) => {
            const nextPin = `${currentPin}${key}`.replace(/\D/g, "").slice(0, PIN_LENGTH);

            if (nextPin.length === PIN_LENGTH) {
                window.setTimeout(() => submitPin(nextPin), 120);
            }

            return nextPin;
        });
    };

    return (
        <section className="space-y-4">
            <div className="bg-card rounded-2xl border border-primary/10 p-6 text-center patela-shadow-sm">
                <div className="h-20 w-20 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    {isVerifying ? (
                        <Loader2 className="h-10 w-10 text-accent animate-spin" />
                    ) : (
                        <LockKeyhole className="h-10 w-10 text-accent" />
                    )}
                </div>

                <p className="text-xs text-accent uppercase tracking-wide font-bold">Staff verification</p>
                <h2 className="text-2xl font-bold text-foreground mt-1">Enter Staff PIN</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    This shared device requires the shop attendant PIN before scanning can start.
                </p>

                {storeId && (
                    <p className="text-xs text-muted-foreground mt-2">
                        Store: <span className="font-semibold text-foreground">{storeId}</span>
                    </p>
                )}

                <div className="flex items-center justify-center gap-4 mt-6" aria-label="PIN digits entered">
                    {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "h-6 w-6 rounded-full border-2 transition-all duration-150",
                                index < pin.length
                                    ? "border-accent bg-accent scale-110"
                                    : "border-border bg-secondary"
                            )}
                        />
                    ))}
                </div>

                {error && (
                    <div className="mt-5 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-3 gap-3 mt-7">
                    {numberKeys.map((key) => {
                        const isClear = key === "clear";
                        const isBack = key === "back";

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleKeyPress(key)}
                                disabled={isVerifying}
                                className={cn(
                                    "h-20 rounded-2xl border-2 text-3xl font-black transition-all duration-150 active:scale-95 disabled:opacity-60",
                                    isClear || isBack
                                        ? "bg-secondary text-foreground border-border hover:bg-secondary/80"
                                        : "bg-card text-foreground border-border hover:bg-accent/10 hover:border-accent/40 patela-shadow-sm"
                                )}
                            >
                                {isClear ? "Clear" : isBack ? <Delete className="h-8 w-8 mx-auto text-destructive" /> : key}
                            </button>
                        );
                    })}
                </div>

                <Button
                    variant="hero"
                    size="xl"
                    className="w-full mt-6"
                    onClick={() => submitPin()}
                    disabled={isVerifying || pin.length !== PIN_LENGTH}
                >
                    {isVerifying ? <Loader2 className="h-6 w-6 animate-spin" /> : <ShieldCheck className="h-6 w-6" />}
                    Verify Staff
                </Button>

                <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={onCancel}
                    disabled={isVerifying}
                >
                    Cancel
                </Button>
            </div>
        </section>
    );
}
