import * as errorUtils from '../utils/errorUtils.js';
import * as companyRepository from '../repositories/companyRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
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
