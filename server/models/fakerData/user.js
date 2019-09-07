import faker from 'faker';

const users = [

  // ############ SIGNUP DATA BEGINS HERE ############
  // index = 0
  // JSON payload without "firstName" field
  {
    // firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(8, true),
    gender: 'F',
    jobRole: faker.name.jobTitle,
    department: faker.commerce.department,
    address: faker.address.city(),
  },
  // index = 1
  // JSON payload with one of empty field
  {
    firstName: ' ',
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(8, true),
    gender: 'F',
    jobRole: faker.name.jobTitle(),
    department: faker.commerce.department(),
    address: faker.address.city(),
  },
  // index = 2
  // JSON payload limit these fileds to be
  {
    firstName: '9999',
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(8, true),
    gender: 'F',
    jobRole: faker.name.jobTitle(),
    department: faker.commerce.department(),
    address: faker.address.city(),
  },
  // index = 3
  // JSON payload for invalid gender
  {
    firstName: faker.name.findName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(8, true),
    gender: 'FF',
    jobRole: faker.name.jobTitle(),
    department: faker.commerce.department(),
    address: faker.address.city(),
  },
  // index = 4
  // Valid Request
  {
    firstName: faker.name.findName(),
    lastName: faker.name.lastName(),
    email: 'sylvain@gmail.com',
    password: faker.internet.password(8, true),
    gender: 'M',
    jobRole: faker.name.jobTitle(),
    department: faker.commerce.department(),
    address: faker.address.city(),
  },
  // index = 5
  // Valid Request
  {
    firstName: faker.name.findName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(8, true),
    gender: 'M',
    jobRole: faker.name.jobTitle(),
    department: faker.commerce.department(),
    address: faker.address.city(),
  },
  // ############ SIGNUP DATA ENDS HERE ############

  // ############ SIGN IN DATA BEGINS HERE ############
  // index = 6
  // Request with no "email" field
  {
    password: faker.internet.password(8, true),
  },

  // index = 7
  // Valid Credentials
  {
    email: 'sylvain@gmail.com',
    password: 'password',
  },
  // index = 8
  // invalid Credentials
  {
    email: faker.internet.email(),
    password: faker.internet.password(8, true),
  },

  // ############ SIGN IN DATA ENDS HERE ############
];

export default users;
