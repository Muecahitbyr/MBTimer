import { useEffect } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import BackspaceOutlined from '@mui/icons-material/BackspaceOutlined';

interface Props {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  error?: boolean;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'] as const;

/** Ziffernfeld für die Kiosk-PIN, auch per Tastatur bedienbar. */
export default function PinPad({ value, onChange, length = 4, error }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key) && value.length < length) onChange(value + e.key);
      else if (e.key === 'Backspace') onChange(value.slice(0, -1));
      else if (e.key === 'Escape' && value) {
        e.stopPropagation();
        onChange('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [value, onChange, length]);

  const press = (k: (typeof KEYS)[number]) => {
    if (k === 'back') onChange(value.slice(0, -1));
    else if (k === 'clear') onChange('');
    else if (value.length < length) onChange(value + k);
  };

  return (
    <Box>
      <Box
        role="status"
        aria-label={`${value.length} von ${length} Ziffern eingegeben`}
        sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, animation: error ? 'mbz-shake 0.35s' : undefined, '@keyframes mbz-shake': { '0%, 100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-8px)' }, '75%': { transform: 'translateX(8px)' } } }}
      >
        {Array.from({ length }, (_, i) => (
          <Box key={i} sx={{ width: 18, height: 18, borderRadius: '50%', border: 2, borderColor: error ? 'error.main' : 'primary.main', bgcolor: i < value.length ? (error ? 'error.main' : 'primary.main') : 'transparent' }} />
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, maxWidth: 300, mx: 'auto' }}>
        {KEYS.map((k) => (
          <ButtonBase
            key={k}
            onClick={() => press(k)}
            aria-label={k === 'back' ? 'Letzte Ziffer löschen' : k === 'clear' ? 'Eingabe löschen' : `Ziffer ${k}`}
            sx={{
              height: 64,
              borderRadius: 3,
              fontSize: k === 'clear' ? 15 : 26,
              fontWeight: 600,
              bgcolor: k.length === 1 ? 'var(--mbz-tint)' : 'transparent',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' },
              '&.Mui-focusVisible': { outline: '3px solid', outlineColor: 'primary.main' },
            }}
          >
            {k === 'back' ? <BackspaceOutlined /> : k === 'clear' ? 'Löschen' : k}
          </ButtonBase>
        ))}
      </Box>
    </Box>
  );
}
