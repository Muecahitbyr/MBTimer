import { useId } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { FaqItem } from '../../config/site';
import Section from '../components/Section';

export function FaqList({ items }: { items: FaqItem[] }) {
  const base = useId();
  return (
    <Box sx={{ maxWidth: 820, mx: 'auto' }}>
      {items.map((item, i) => (
        <Accordion key={item.q} disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: '12px !important', mb: 1.5, '&::before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`${base}-${i}-q`} aria-controls={`${base}-${i}-a`}>
            <Typography component="h3" variant="subtitle1">{item.q}</Typography>
          </AccordionSummary>
          <AccordionDetails id={`${base}-${i}-a`}>
            <Typography sx={{ color: 'text.secondary' }}>{item.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default function FaqSection({ items, title = 'Häufige Fragen' }: { items: FaqItem[]; title?: string }) {
  return (
    <Section id="faq" eyebrow="FAQ" title={title}>
      <FaqList items={items} />
    </Section>
  );
}
