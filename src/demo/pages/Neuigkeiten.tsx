import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import PushPinOutlined from '@mui/icons-material/PushPinOutlined';
import { useDemoUser } from '../store/DemoStore';
import { newId } from '../store/reducer';
import { employees, fullName } from '../data/employees';
import { formatDate } from '../lib/date';
import { can } from '../lib/permissions';
import PageHeader from '../components/PageHeader';
import EmployeeAvatar from '../components/EmployeeAvatar';
import { useNotify } from '../components/Feedback';

export default function Neuigkeiten() {
  const { user, state, dispatch, clock } = useDemoUser();
  const notify = useNotify();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const news = [...state.data.news].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date));

  const publish = () => {
    if (!title.trim() || !body.trim()) return;
    dispatch({ type: 'addNews', news: { id: newId('n'), title: title.trim(), body: body.trim(), authorId: user.id, date: clock.today } });
    notify('Neuigkeit veröffentlicht.');
    setTitle('');
    setBody('');
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Neuigkeiten"
        subtitle="Ankündigungen für das ganze Team"
        actions={can.postNews(user.role) && <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Neuigkeit veröffentlichen</Button>}
      />
      <Box sx={{ display: 'grid', gap: 2, maxWidth: 820 }}>
        {news.map((n) => {
          const author = employees.find((e) => e.id === n.authorId)!;
          return (
            <Card key={n.id} component="article" aria-labelledby={`news-${n.id}`}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <EmployeeAvatar employee={author} size={34} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{fullName(author)}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{formatDate(n.date)}</Typography>
                  </Box>
                  {n.pinned && <Chip size="small" icon={<PushPinOutlined />} label="Angeheftet" color="primary" variant="outlined" />}
                </Box>
                <Typography id={`news-${n.id}`} variant="h6" component="h2">{n.title}</Typography>
                <Typography sx={{ mt: 0.5, color: 'text.secondary' }}>{n.body}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" aria-labelledby="news-dialog">
        <DialogTitle id="news-dialog">Neuigkeit veröffentlichen</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <TextField label="Titel" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <TextField label="Text" value={body} onChange={(e) => setBody(e.target.value)} multiline minRows={4} required />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={publish} disabled={!title.trim() || !body.trim()}>Veröffentlichen</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
