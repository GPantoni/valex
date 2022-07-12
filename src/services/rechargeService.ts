import * as errorUtils from '../utils/errorUtils.js';
import * as serviceUtils from '../utils/serviceUtils.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';

export async function rechargeCard(id: number, amount: number) {
  const existingCard: cardRepository.Card = await cardRepository.findById(id);
  if (!existingCard) {
    throw errorUtils.errorNotFound('card');
  }
  if (!existingCard.password) {
    throw errorUtils.errorForbidden('This card is not activated yet');
  }

  serviceUtils.validateExpirationDate(existingCard.expirationDate);

  const rechargeInfo: rechargeRepository.RechargeInsertData = {
    cardId: id,
    amount,
  };
  await rechargeRepository.insert(rechargeInfo);
}
