import { WifiOff, RefreshCw, CloudOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineBannerProps {
  isOffline: boolean;
  queuedCount?: number;
  isSyncing?: boolean;
  syncProgress?: { current: number; total: number };
}

export function OfflineBanner({ 
  isOffline, 
  queuedCount = 0, 
  isSyncing = false,
  syncProgress 
}: OfflineBannerProps) {
  if (!isOffline && !isSyncing && queuedCount === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 text-sm font-medium animate-patela-slide-up",
        isOffline 
          ? "bg-warning/15 text-warning border-b border-warning/20" 
          : isSyncing 
            ? "bg-primary/10 text-primary border-b border-primary/20"
            : "bg-success/10 text-success border-b border-success/20"
      )}
    >
      <div className="flex items-center gap-2">
        {isOffline ? (
          <>
            <CloudOff className="h-4 w-4" />
            <span>Offline mode — will sync when connected</span>
          </>
        ) : isSyncing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>
              Syncing {syncProgress ? `${syncProgress.current} of ${syncProgress.total}...` : "..."}
            </span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Back online — all synced!</span>
          </>
        )}
      </div>
      {queuedCount > 0 && isOffline && (
        <span className="bg-warning text-warning-foreground px-2 py-0.5 rounded-full text-xs font-bold">
          Queued: {queuedCount}
        </span>
      )}
    </div>
  );
}
