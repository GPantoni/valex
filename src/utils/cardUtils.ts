import * as errorUtils from './errorUtils.js';
import * as cardRepository from '../repositories/cardRepository.js';
import * as businessRepository from '../repositories/businessRepository.js';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { getExtract } from '../services/cardService.js';

export function validateExpirationDate(expirationDate: string) {
  const now = dayjs(Date.now()).format('MM/YY');
  if (dayjs(now).isAfter(dayjs(expirationDate))) {
    throw errorUtils.errorBadRequest('Card has already expired');
  }
}

export async function validateCard(cardId: number) {
  const card: cardRepository.Card = await cardRepository.findById(cardId);
  if (!card) {
    throw errorUtils.errorNotFound('card');
  }

  return card;
}

export function validateCardActivation(card: cardRepository.Card) {
  if (!card.password) {
    throw errorUtils.errorForbidden('This card is not activated yet');
  }
}

export function validatePassword(password: string, card: cardRepository.Card) {
  const isPasswordValid: boolean = bcrypt.compareSync(password, card.password);
  if (!isPasswordValid) {
    throw errorUtils.errorForbidden('Invalid password');
  }
}

export async function validateBusiness(
  businessId: number,
  card: cardRepository.Card
) {
  const business: businessRepository.Business =
    await businessRepository.findById(businessId);
  if (!business) {
    throw errorUtils.errorNotFound('point of service(business)');
  }
  if (card.type !== business.type) {
    throw errorUtils.errorForbidden('Card not allowed in this business type');
  }
}

export async function validateCardBalance(cardId: number, amount: number) {
  const { balance } = await getExtract(cardId);

  if (amount > balance) {
    throw errorUtils.errorForbidden('Insufficient funds');
  }
}
