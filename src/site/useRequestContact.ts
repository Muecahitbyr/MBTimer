import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/** Springt zum Kontaktformular auf der Startseite und füllt die Nachricht vor. */
export function useRequestContact() {
  const navigate = useNavigate();
  return useCallback(
    (message: string) => {
      const search = window.location.pathname === '/' ? window.location.search : '';
      navigate({ pathname: '/', search, hash: '#kontakt' }, { state: { message } });
    },
    [navigate],
  );
}
