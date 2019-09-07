import Comment from '../models/commentModel';
import Article from '../models/articleModel';
import StatusCode from '../helpers/statusCode';
import Validator from '../helpers/validator';

class CommentController {
  // Posting a comment
  commentOnArticle = (req, res) => {
    const result = Validator.validateCommentRequest(req.body);
    if (result.error == null) {
      let { comment } = req.body;
      let { articleId } = req.params;
      //  Trimming off spaces to be sure for request!
      let trustedPayload = {
        comment: comment.trim(),
      };
      articleId = articleId.trim();
      const employeeToken = req.header('x-auth-token').trim();
      // articleId must be a number
      if (isNaN(articleId)) {
        return res.status(StatusCode.BAD_REQUEST).send({
          status: StatusCode.BAD_REQUEST,
          error: 'articleId can\'t be a string!',
        });
      }
      // Comment can not be empty
      if (!Validator.validateData(comment)) {
        return res.status(StatusCode.BAD_REQUEST).send({
          status: StatusCode.BAD_REQUEST,
          error: 'comment can\'t be empty',
        });
      }
      // Does article id exist
      if (!Article.isArticleExist(articleId)) {
        return res.status(StatusCode.NOT_FOUND).send({
          status: StatusCode.NOT_FOUND,
          error: 'Such article is not found!',
        });
      }

      // Everything is okay, we allow Comment post
      const response = Comment.post(trustedPayload, articleId, employeeToken, res);
      return res.status(StatusCode.RESOURCE_CREATED).send(response);
    }
    // Request does not fullfill basic requirements@thrown by JOI NPM
    return res.status(StatusCode.BAD_REQUEST).send({
      status: StatusCode.BAD_REQUEST,
      error: `${result.error.details[0].message}`,
    });
  };
}

export default CommentController;
