import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { problemSolution } from '../../config/site';
import { MONO } from '../../theme/theme';
import Section from '../components/Section';

export default function ProblemSolutionSection() {
  const columns = [
    { title: 'Bisher', items: problemSolution.problems, mark: '–', good: false },
    { title: 'Mit MBTimer', items: problemSolution.solutions, mark: '+', good: true },
  ];
  return (
    <Section id="problem" title={problemSolution.title} subtitle={problemSolution.intro}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, columnGap: 8, rowGap: 6 }}>
        {columns.map((col) => (
          <Box key={col.title}>
            <Typography variant="h5" component="h3" sx={{ mb: 1, color: col.good ? 'primary.main' : 'text.primary' }}>
              {col.title}
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {col.items.map((item) => (
                <Box component="li" key={item.title} sx={{ display: 'flex', gap: 2.5, py: 2.5, borderTop: 1, borderColor: col.good ? 'var(--mbt-ink)' : 'divider' }}>
                  <Box aria-hidden="true" sx={{ fontFamily: MONO, fontSize: 18, lineHeight: 1.3, color: col.good ? 'primary.main' : 'text.secondary', width: 14 }}>
                    {col.mark}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" component="h4" sx={{ fontSize: '1.1rem', lineHeight: 1.3 }}>{item.title}</Typography>
                    <Typography sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.6 }}>{item.text}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
