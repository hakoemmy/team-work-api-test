import Joi from 'joi';

class Validator {
  // General Validation method for all ones
  validate = (request, schema) => {
    const result = Joi.validate(request, schema);
    return result;
  };

  // SignUp validator fn
  validateSignUpRequest = (request) => {
    const schema = {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      address: Joi.string().required(),
      gender: Joi.string().required(),
      jobRole: Joi.string().required(),
      department: Joi.string().required(),
    };
    return this.validate(request, schema);
  };

  // LogIn validator fn
  validateSignInRequest = (request) => {
    const schema = {
      email: Joi.string().email().required(),
      password: Joi.required(),
    };
    return this.validate(request, schema);
  };

  validateData = (field) => {
    const entity = field.replace(/[^a-zA-Z0-9]/g, '');
    if (entity) return true;
    return false;
  };

  isGenderValid = (gender) => {
    if (gender === 'female'
    || gender === 'f'
    || gender === 'male'
    || gender === 'm') {
      return true;
    }
    return false;
  };

  // Posting article validator fn
  validateArticleRequest = (request) => {
    const schema = {
      title: Joi.string().required(),
      article: Joi.string().required(),
    };
    return this.validate(request, schema);
  };

  // Comment post validator fn
  validateCommentRequest = (request) => {
    const schema = {
      comment: Joi.string().required(),
    };
    return this.validate(request, schema);
  };
}

export default new Validator();
