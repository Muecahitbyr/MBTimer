import { nowHHMM } from '../lib/date';
import { openEntry } from '../lib/time';
import type { TimeEntry } from '../data/types';
import { useDemo } from '../store/DemoStore';
import { useNotify } from './Feedback';

/** Kommen/Gehen für eine Person – im Browser oder am Kiosk. */
export function useStamp(employeeId: string) {
  const { state, dispatch, clock } = useDemo();
  const notify = useNotify();
  const open = openEntry(state.data, employeeId, clock.today);

  const toggle = (source: TimeEntry['source'] = 'web', silent = false) => {
    const time = nowHHMM();
    if (open) dispatch({ type: 'clockOut', employeeId, date: clock.today, time });
    else dispatch({ type: 'clockIn', employeeId, date: clock.today, time, source });
    if (!silent) notify(open ? `Gehen gestempelt um ${time} Uhr.` : `Kommen gestempelt um ${time} Uhr.`);
    return { action: open ? ('gehen' as const) : ('kommen' as const), time };
  };

  return { open, toggle };
}
