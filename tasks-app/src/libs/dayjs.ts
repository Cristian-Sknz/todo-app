import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import portuguese from 'dayjs/locale/pt-br'

dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

dayjs.locale(portuguese);