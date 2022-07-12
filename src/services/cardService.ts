import * as errorUtils from '../utils/errorUtils.js';
import * as serviceUtils from '../utils/serviceUtils.js';
import * as companyRepository from '../repositories/companyRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export async function createCard(
  apiKey: string,
  employeeId: number,
  type: cardRepository.TransactionTypes
) {
  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) {
    throw errorUtils.errorNotFound('company');
  }

  const employee = await employeeRepository.findById(employeeId);
  if (!employee) {
    throw errorUtils.errorNotFound('employee');
  }

  const existingCard = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );
  if (existingCard) {
    throw errorUtils.errorConflict('card');
  }

  const cardholderName: string = genCardholderName(employee);
  const number: string = faker.finance.creditCardNumber('Mastercard');
  const securityCode: string = faker.finance.creditCardCVV();
  const expirationDate: string = dayjs(Date.now())
    .add(5, 'year')
    .format('MM/YY');

  const newCard: cardRepository.CardInsertData = {
    number,
    employeeId,
    cardholderName,
    securityCode: encryptr(securityCode),
    expirationDate,
    isVirtual: false,
    isBlocked: true,
    type,
  };

  await cardRepository.insert(newCard);
}

function genCardholderName(employee: any) {
  let cardholderName = [];
  let fullName = employee.fullName.split(' ');
  fullName.map((name: string, i) => {
    if (i === 0 || name === fullName[fullName.length - 1]) {
      return cardholderName.push(name);
    } else if (name.length > 2) {
      return cardholderName.push(name[0]);
    }
  });

  return cardholderName.join(' ').toUpperCase();
}

function encryptr(cvv: string) {
  const cryptr = new Cryptr(process.env.CRYPTR);
  const encryptedString = cryptr.encrypt(cvv);
  return encryptedString;
}

function decryptr(cvv: string) {
  const cryptr = new Cryptr(process.env.CRYPTR);
  const encryptedString = cryptr.decrypt(cvv);
  return encryptedString;
}

export async function activateCard(cardInfo: any) {
  const { id, securityCode, password } = cardInfo;

  const existingCard: cardRepository.Card = await cardRepository.findById(id);
  if (!existingCard) {
    throw errorUtils.errorNotFound('card id');
  }

  serviceUtils.validateExpirationDate(existingCard.expirationDate);

  if (existingCard.password) {
    throw errorUtils.errorForbidden('Card has already been activated');
  }

  validateSecurityCode(securityCode, existingCard);

  await updateCardPassword(id, password);
}

async function updateCardPassword(id: number, password: string) {
  const passwordFormatRegex = /^[0-9]{4}$/;
  if (!passwordFormatRegex.test(password)) {
    throw errorUtils.errorBadRequest('Password must contain 4 numbers');
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  await cardRepository.update(id, {
    password: hashedPassword,
    isBlocked: false,
  });

  return;
}

function validateSecurityCode(
  securityCode: string,
  existingCard: cardRepository.Card
) {
  const cardSecurityCode = decryptr(existingCard.securityCode);
  if (cardSecurityCode !== securityCode) {
    throw errorUtils.errorBadRequest('Invalid security code');
  }
}

export async function blockCard(cardInfo: any) {
  const { id, password } = cardInfo;

  const existingCard: cardRepository.Card = await cardRepository.findById(id);
  if (!existingCard) {
    throw errorUtils.errorNotFound('card id');
  }

  serviceUtils.validateExpirationDate(existingCard.expirationDate);

  if (existingCard.isBlocked) {
    throw errorUtils.errorForbidden('Card already blocked');
  }

  const hashedPassword = existingCard.password;
  const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
  if (isPasswordValid) {
    await cardRepository.update(id, { isBlocked: true });
  }
}

export async function unblockCard(cardInfo: any) {
  const { id, password } = cardInfo;

  const existingCard: cardRepository.Card = await cardRepository.findById(id);
  if (!existingCard) {
    throw errorUtils.errorNotFound('card id');
  }

  serviceUtils.validateExpirationDate(existingCard.expirationDate);

  if (!existingCard.isBlocked) {
    throw errorUtils.errorForbidden('Card already unblocked');
  }

  const hashedPassword = existingCard.password;
  const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
  if (isPasswordValid) {
    await cardRepository.update(id, { isBlocked: false });
  }
}
