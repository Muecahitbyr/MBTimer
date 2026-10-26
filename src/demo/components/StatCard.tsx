import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: 'default' | 'positive' | 'negative';
}

export default function StatCard({ label, value, hint, icon, tone = 'default' }: StatCardProps) {
  const color = tone === 'positive' ? 'success.main' : tone === 'negative' ? 'error.main' : 'text.primary';
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{label}</Typography>
          {icon && <Box sx={{ color: 'primary.main', display: 'flex' }} aria-hidden="true">{icon}</Box>}
        </Box>
        <Typography sx={{ fontSize: '1.7rem', fontWeight: 750, mt: 0.5, color }}>{value}</Typography>
        {hint && <Typography variant="body2" sx={{ color: 'text.secondary' }}>{hint}</Typography>}
      </CardContent>
    </Card>
  );
}
