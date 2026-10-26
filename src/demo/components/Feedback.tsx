import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import Alert, { type AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

type Notify = (message: string, severity?: AlertColor) => void;
const FeedbackContext = createContext<Notify>(() => undefined);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ text: string; severity: AlertColor; key: number } | null>(null);
  const notify = useCallback<Notify>((text, severity = 'success') => setMsg({ text, severity, key: Date.now() }), []);
  return (
    <FeedbackContext.Provider value={notify}>
      {children}
      <Snackbar key={msg?.key} open={!!msg} autoHideDuration={3500} onClose={() => setMsg(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={msg?.severity ?? 'success'} variant="filled" onClose={() => setMsg(null)} sx={{ width: '100%' }}>
          {msg?.text}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
}

export const useNotify = () => useContext(FeedbackContext);
