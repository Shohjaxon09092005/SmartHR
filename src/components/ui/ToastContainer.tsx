import { useToast, Toast, ToastType } from '@/context/ToastContext';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  warning: <AlertCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

const colorMap: Record<ToastType, string> = {
  success: 'bg-success text-success-foreground',
  error: 'bg-destructive text-destructive-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-primary text-primary-foreground',
};

const ToastItem = ({ toast }: { toast: Toast }) => {
  const { removeToast } = useToast();

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-md animate-slide-up',
        colorMap[toast.type]
      )}
    >
      <div className="flex-shrink-0">{iconMap[toast.type]}</div>
      <div className="flex-1">
        <p className="font-semibold">{toast.title}</p>
        {toast.message && <p className="text-sm mt-1 opacity-90">{toast.message}</p>}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
};
