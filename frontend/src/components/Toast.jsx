import useToastStore from '../store/useToastStore';

export default function Toast() {
  const { toast, hideToast } = useToastStore();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-5 right-5 z-[200] animate-fade-in">
      <div className={`flex items-center gap-3 bg-slate-900/95 backdrop-blur-md border ${
        isSuccess ? 'border-emerald-500/30' : 'border-red-500/30'
      } px-4 py-3.5 rounded-2xl shadow-2xl max-w-sm`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isSuccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isSuccess ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
            </svg>
          )}
        </div>

        <div className="flex-1 pr-2">
          <p className="text-sm font-semibold text-white">
            {isSuccess ? 'Success' : 'Error'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        </div>

        <button onClick={hideToast} className="text-slate-500 hover:text-slate-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
