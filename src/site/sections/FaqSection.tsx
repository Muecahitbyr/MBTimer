import { useId } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import type { FaqItem } from '../../config/site';
import Section from '../components/Section';

/** FAQ als Liste mit Haarlinien statt Karten. */
export function FaqList({ items }: { items: FaqItem[] }) {
  const base = useId();
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      {items.map((item, i) => (
        <Accordion
          key={item.q}
          disableGutters
          elevation={0}
          square
          sx={{
            bgcolor: 'transparent',
            borderTop: 1,
            borderColor: i === 0 ? 'var(--mbt-ink)' : 'divider',
            '&::before': { display: 'none' },
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(45deg)' },
          }}
        >
          <AccordionSummary expandIcon={<AddIcon />} id={`${base}-${i}-q`} aria-controls={`${base}-${i}-a`} sx={{ px: 0, py: 1 }}>
            <Typography component="h3" sx={{ fontSize: '1.15rem', fontWeight: 600 }}>{item.q}</Typography>
          </AccordionSummary>
          <AccordionDetails id={`${base}-${i}-a`} sx={{ px: 0, pt: 0, pb: 3, maxWidth: 760 }}>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.65 }}>{item.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default function FaqSection({ items, title = 'Häufige Fragen' }: { items: FaqItem[]; title?: string }) {
  return (
    <Section id="faq" eyebrow="FAQ" title={title} tinted>
      <FaqList items={items} />
    </Section>
  );
}
