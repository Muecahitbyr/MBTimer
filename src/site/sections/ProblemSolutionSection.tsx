import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutlined';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { problemSolution } from '../../config/site';
import Section from '../components/Section';

export default function ProblemSolutionSection() {
  const columns = [
    { title: 'Bisher', items: problemSolution.problems, good: false },
    { title: 'Mit MBzeit', items: problemSolution.solutions, good: true },
  ];
  return (
    <Section id="problem" title={problemSolution.title} subtitle={problemSolution.intro}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {columns.map((col) => (
          <Card
            key={col.title}
            sx={col.good ? { borderColor: 'primary.main', borderWidth: 2 } : { bgcolor: 'var(--mbz-tint)', borderColor: 'transparent' }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h5" component="h3" sx={{ mb: 3, color: col.good ? 'primary.main' : 'text.primary' }}>
                {col.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 3 }}>
                {col.items.map((item) => (
                  <Box component="li" key={item.title} sx={{ display: 'flex', gap: 2 }}>
                    {col.good ? (
                      <CheckCircle sx={{ color: 'primary.main', mt: 0.25 }} aria-hidden="true" />
                    ) : (
                      <RemoveCircleOutline sx={{ color: 'text.secondary', mt: 0.25 }} aria-hidden="true" />
                    )}
                    <Box>
                      <Typography variant="subtitle1" component="h4">{item.title}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{item.text}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Section>
  );
}
