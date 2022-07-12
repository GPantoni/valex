import * as errorUtils from './errorUtils.js';
import dayjs from 'dayjs';

export function validateExpirationDate(expirationDate: string) {
  const now = dayjs(Date.now()).format('MM/YY');
  if (dayjs(now).isAfter(dayjs(expirationDate))) {
    throw errorUtils.errorBadRequest('Card has already expired');
  }
}
