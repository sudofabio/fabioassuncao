import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

// Every date the site prints is Brazilian Portuguese. Import dayjs from here
// rather than from the package so no component can render an English month.
dayjs.locale('pt-br');

export default dayjs;
