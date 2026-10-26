import Box from '@mui/material/Box';

interface ScreenshotProps {
  src: string;
  srcSmall?: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
}

/** Screenshot aus der Demo (WebP), mit festen Maßen gegen Layout-Verschiebung. */
export default function Screenshot({ src, srcSmall, alt, width, height, priority, sizes = '(min-width: 900px) 50vw, 100vw' }: ScreenshotProps) {
  return (
    <Box
      component="img"
      src={src}
      srcSet={srcSmall ? `${srcSmall} ${Math.round(width / 2)}w, ${src} ${width}w` : undefined}
      sizes={srcSmall ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      sx={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
}
