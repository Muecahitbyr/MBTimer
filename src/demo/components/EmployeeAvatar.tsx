import Avatar from '@mui/material/Avatar';
import type { Employee } from '../data/types';
import { initials } from '../data/employees';

export default function EmployeeAvatar({ employee, size = 36 }: { employee: Employee; size?: number }) {
  return (
    <Avatar aria-hidden="true" sx={{ bgcolor: employee.color, color: '#fff', width: size, height: size, fontSize: size * 0.4, fontWeight: 700 }}>
      {initials(employee)}
    </Avatar>
  );
}
