import Box from '@mui/material/Box';

export default function SkipLink({ target = 'inhalt' }: { target?: string }) {
  return (
    <Box
      component="a"
      href={`#${target}`}
      sx={{
        position: 'absolute',
        left: 16,
        top: -64,
        zIndex: 2000,
        px: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        fontWeight: 600,
        textDecoration: 'none',
        '&:focus': { top: 12 },
      }}
    >
      Zum Inhalt springen
    </Box>
  );
}
