import type { SvgIconComponent } from '@mui/icons-material';
import AccessTime from '@mui/icons-material/AccessTime';
import ViewWeekOutlined from '@mui/icons-material/ViewWeekOutlined';
import BalanceOutlined from '@mui/icons-material/BalanceOutlined';
import FreeBreakfastOutlined from '@mui/icons-material/FreeBreakfastOutlined';
import TabletMacOutlined from '@mui/icons-material/TabletMacOutlined';
import DialpadOutlined from '@mui/icons-material/DialpadOutlined';
import WifiOffOutlined from '@mui/icons-material/WifiOffOutlined';
import EventRepeatOutlined from '@mui/icons-material/EventRepeatOutlined';
import BeachAccessOutlined from '@mui/icons-material/BeachAccessOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import SickOutlined from '@mui/icons-material/SickOutlined';
import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import EditCalendarOutlined from '@mui/icons-material/EditCalendarOutlined';
import MoreTimeOutlined from '@mui/icons-material/MoreTimeOutlined';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
import StoreOutlined from '@mui/icons-material/StoreOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import DevicesOutlined from '@mui/icons-material/DevicesOutlined';
import type { FeatureIcon } from '../../config/site';

export const featureIcons: Record<FeatureIcon, SvgIconComponent> = {
  clock: AccessTime,
  calendarWeek: ViewWeekOutlined,
  balance: BalanceOutlined,
  coffee: FreeBreakfastOutlined,
  tablet: TabletMacOutlined,
  pin: DialpadOutlined,
  offline: WifiOffOutlined,
  schedule: EventRepeatOutlined,
  beach: BeachAccessOutlined,
  teamCalendar: CalendarMonthOutlined,
  sick: SickOutlined,
  event: EventAvailableOutlined,
  edit: EditCalendarOutlined,
  overtime: MoreTimeOutlined,
  news: CampaignOutlined,
  stats: InsightsOutlined,
  roles: AdminPanelSettingsOutlined,
  locations: StoreOutlined,
  history: HistoryOutlined,
  devices: DevicesOutlined,
};
