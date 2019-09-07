import User from '../models/userModel';
import StatusCode from '../helpers/statusCode';
import Validator from '../helpers/validator';

class UserController {
  // SignUP
    signUp = (req, res) => {
      const result = Validator.validateSignUpRequest(req.body);
      if (result.error == null) {
        let {
          firstName, lastName,
          email, password, address,
          gender, jobRole, department,
        } = req.body;
        // 1. Removing all special characters
        // 1.1 and eliminating empty data
        if (!Validator.validateData(firstName)
        || !Validator.validateData(lastName)
        || !Validator.validateData(address)
        || !Validator.validateData(gender)
        || !Validator.validateData(jobRole)
        || !Validator.validateData(department)
        || !Validator.validateData(password)
        ) {
          return res.status(StatusCode.BAD_REQUEST).send({
            status: StatusCode.BAD_REQUEST,
            error: 'firstName, lastName, address, gender, jobRole, department,password  can\'t be empty',
          });
        }
        // 2. first name, last name, job role, department and address
        // 2. 1 can't be numbers!
        if (!isNaN(firstName)
        || !isNaN(lastName)
        || !isNaN(jobRole)
        || !isNaN(department)
        || !isNaN(address)) {
          return res.status(StatusCode.BAD_REQUEST).send({
            status: StatusCode.BAD_REQUEST,
            error: 'firstName, lastName, JobRole, depatment and address can\'t be a number!',
          });
        }
        // 3. Validate gender # must be (male or female)
        // 3. 1 or (mor f)
        if (!Validator.isGenderValid(gender.toLowerCase().trim())) {
          return res.status(StatusCode.BAD_REQUEST).send({
            status: StatusCode.BAD_REQUEST,
            error: 'it seems that gender is invalid!',
          });
        }
        // 4. Email is unique key associated to only one user
        if (User.isEmailTaken(email)) {
          return res.status(StatusCode.REQUEST_CONFLICT).send({
            status: StatusCode.REQUEST_CONFLICT,
            error: 'Email is already taken!',
          });
        }
        // Trimming off spaces to be sure for request!
        let trustedPayload = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password: password.trim(),
          gender: gender.trim(),
          jobRole: jobRole.trim(),
          department: department.trim(),
          address: address.trim(),
        };

        // 5. Everything is okay, we allow sinup entry
        const user = User.create(trustedPayload);
        return res.status(StatusCode.RESOURCE_CREATED).send(user);
      }
      // 6. Request does not fullfill basic requirements@thrown by JOI NPM
      return res.status(StatusCode.BAD_REQUEST).send({
        status: StatusCode.BAD_REQUEST,
        error: `${result.error.details[0].message}`,
      });
    };

    // Login in
    signIn = (req, res) => {
      const result = Validator.validateSignInRequest(req.body);
      if (result.error == null) {
        let { email, password } = req.body;
        // Trimming off R and L spaces for request payload
        let trustedPayload = {
          email: email.trim(),
          password: password.trim(),
        };
        // Everything is okay
        // We fire up User model to login user
        const user = User.login(trustedPayload);
        if (user.status === StatusCode.REQUEST_SUCCEDED) {
          return res.status(StatusCode.REQUEST_SUCCEDED).send(user);
        }
        // Credentials do not match
        return res.status(StatusCode.UNAUTHORIZED).send(user);
      }
      // Request does not fullfill basic requirements thrown@ JOI NPM
      return res.status(StatusCode.BAD_REQUEST).send({
        status: StatusCode.BAD_REQUEST,
        error: `${result.error.details[0].message}`,
      });
    };
}

export default UserController;
