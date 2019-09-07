import lodash from 'lodash';
import StatusCode from '../helpers/statusCode';
import generateAuthToken from '../helpers/tokenEncoder';
import encryptPassword from '../helpers/passwordEncryptor';
import comparePassword from '../helpers/passwordMatcher';

class User {
  constructor() {
    this.users = [
      {
        id: 1,
        firstName: 'TUYISENGE',
        lastName: 'Sylvain',
        email: 'sylvain@gmail.com',
        password: '$2b$10$nhZCvSMTdKg/MI7gVTWwj.WCeq7tTSpr4xj4xzVmIbdCoHnwj9nwy',
        gender: 'Male',
        jobRole: 'Web developer',
        department: 'IT',
        address: 'Kigali,Rwanda',
      },
    ];
  }

  // SignUp
    create = (payload) => {
      const {
        firstName, lastName,
        email, password, address,
        gender, jobRole, department,
      } = payload;
      const currentId = this.users.length + 1;
      let newUser = {
        token: generateAuthToken(currentId),
        id: currentId,
        firstName,
        lastName,
        email,
        password: encryptPassword(password),
        address,
        gender,
        jobRole,
        department,
      };
      this.users.push(newUser);
      newUser = {
        status: StatusCode.RESOURCE_CREATED,
        message: 'User created successfully',
        data: lodash.pick(newUser, ['token', 'id',
          'firstName', 'lastName', 'email',
          'address', 'jobRole', 'ogender', 'department']),
      };

      return newUser;
    };


    // SignIn
    login = (payload) => {
    // check if user email and password exists
    // in our users array
      let { email, password } = payload;
      const user = this.users.find(u => (u.email === email)
       && (comparePassword(password, u.password)));
      if (!user) {
        return {
          status: StatusCode.UNAUTHORIZED,
          error:
       'email or password is incorrect!',
        };
      }
      const {
        id,
        firstName, lastName,
        address,
        gender, jobRole, department,
      } = user;
      let result = {
        token: generateAuthToken(id),
        firstName,
        lastName,
        email,
        address,
        jobRole,
        department,
        gender,
      };
      result = {
        status: StatusCode.REQUEST_SUCCEDED,
        message: 'User is successfully logged in',
        data: result,
      };

      return result;
    };

    // Email conflict checker
    isEmailTaken = email => this.users.find(u => u.email === email);

    // User auto-incremet id availability checker
    isUserExist = userId => this.users.find(u => u.id === parseInt(userId, 10));
}

export default new User();
