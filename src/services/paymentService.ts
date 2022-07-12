import * as errorUtils from '../utils/errorUtils.js';
import * as cardUtils from '../utils/cardUtils.js';
import * as cardRepository from '../repositories/cardRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as businessRepository from '../repositories/businessRepository.js';

export async function transaction(
  cardId: number,
  password: string,
  amount: number,
  posId: number
) {
  const existingCard: cardRepository.Card = await cardUtils.validateCard(
    cardId
  );

  cardUtils.validateExpirationDate(existingCard.expirationDate);

  cardUtils.validateCardActivation(existingCard);

  cardUtils.validatePassword(password, existingCard);

  cardUtils.validateBusiness(posId, existingCard);

  cardUtils.validateCardBalance(cardId, amount);

  const paymentInfo = { cardId, businessId: posId, amount };

  await paymentRepository.insert(paymentInfo);
}
