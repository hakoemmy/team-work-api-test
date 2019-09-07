import Article from '../models/articleModel';
import StatusCode from '../helpers/statusCode';
import Validator from '../helpers/validator';

class ArticleController {
  // Posting article
    createArticle = (req, res) => {
      const result = Validator.validateArticleRequest(req.body);
      if (result.error == null) {
        let { title, article } = req.body;
        // 1. Removing all special characters
        // 1.1 and eliminating empty data
        if (!Validator.validateData(title)
        || !Validator.validateData(article)
        ) {
          return res.status(StatusCode.BAD_REQUEST).send({
            status: StatusCode.BAD_REQUEST,
            error: 'title or article can\'t be empty',
          });
        }
        // 2. Avoid Employee to post article of numbers only
        if (!isNaN(title)
        || !isNaN(article)) {
          return res.status(StatusCode.BAD_REQUEST).send({
            status: StatusCode.BAD_REQUEST,
            error: 'title or article can\'t be a number!',
          });
        }

        //  3. Trimming off spaces to be sure for request!
        let trustedPayload = {
          title: title.trim(),
          article: article.trim(),
        };
        // 4. Everything is okay, we allow article post
        const response = Article.create(trustedPayload, req.header('x-auth-token'), res);
        return res.status(StatusCode.RESOURCE_CREATED).send(response);
      }
      // 5. Request does not fullfill basic requirements@thrown by JOI NPM
      return res.status(StatusCode.BAD_REQUEST).send({
        status: StatusCode.BAD_REQUEST,
        error: `${result.error.details[0].message}`,
      });
    };

    editArticle = (req, res) => {
      const result = Validator.validateArticleRequest(req.body);
      if (result.error == null) {
        let { title, article } = req.body;
        let { articleId } = req.params;
        // 1. Removing all special characters
        // 1.1 and eliminating empty data
        if (!Validator.validateData(title)
        || !Validator.validateData(article)
        ) {
          return res.status(StatusCode.BAD_REQUEST).send({
            status: StatusCode.BAD_REQUEST,
            error: 'title or article can\'t be empty',
          });
        }
        // 2. Avoid Employee to edit an article with numbers only
        if (!isNaN(title)
        || !isNaN(article)) {
          return res.status(StatusCode.BAD_REQUEST).send({
            status: StatusCode.BAD_REQUEST,
            error: 'title or article can\'t be a number!',
          });
        }

        // 3. Trimming off spaces to be sure for request!
        let trustedPayload = {
          title: title.trim(),
          article: article.trim(),
        };
        const employeeToken = req.header('x-auth-token').trim();
        articleId = articleId.trim();
        // 4. articleId must be a number
        if (isNaN(articleId)) {
          return res.status(StatusCode.BAD_REQUEST).send({
            status: StatusCode.BAD_REQUEST,
            error: 'articleId can\'t be a string!',
          });
        }
        // 5. Does article id exist
        if (!Article.isArticleExist(articleId)) {
          return res.status(StatusCode.NOT_FOUND).send({
            status: StatusCode.NOT_FOUND,
            error: 'Such article is not found!',
          });
        }
        // 6. Checking if Employee is the owner of article to do so
        if (!Article.isOwnerOfArticle(articleId, employeeToken, res)) {
          return res.status(StatusCode.FORBIDDEN).send({
            status: StatusCode.FORBIDDEN,
            error: 'Aww snap!.. you are not the owner of an article',
          });
        }
        // 7. Everything is okay, we allow article post
        const response = Article.edit(trustedPayload, articleId, employeeToken, res);
        return res.status(StatusCode.REQUEST_SUCCEDED).send(response);
      }
      // 8.Request does not fullfill basic requirements@thrown by JOI NPM
      return res.status(StatusCode.BAD_REQUEST).send({
        status: StatusCode.BAD_REQUEST,
        error: `${result.error.details[0].message}`,
      });
    };

    deleteArticle = (req, res) => {
      let { articleId } = req.params;
      articleId = articleId.trim();
      const employeeToken = req.header('x-auth-token').trim();
      // articleId must be a number
      if (isNaN(articleId)) {
        return res.status(StatusCode.BAD_REQUEST).send({
          status: StatusCode.BAD_REQUEST,
          error: 'articleId can\'t be a string!',
        });
      }
      // Does article id exist
      if (!Article.isArticleExist(articleId)) {
        return res.status(StatusCode.NOT_FOUND).send({
          status: StatusCode.NOT_FOUND,
          error: 'Such article is not found!',
        });
      }
      // Checking if Employee is the owner of article to do so
      if (!Article.isOwnerOfArticle(articleId, employeeToken, res)) {
        return res.status(StatusCode.FORBIDDEN).send({
          status: StatusCode.FORBIDDEN,
          error: 'Aww snap!.. you are not the owner of an article',
        });
      }
      // Everything is okay, we allow article post
      const response = Article.delete(articleId);
      return res.status(StatusCode.REQUEST_SUCCEDED).send(response);
    };

    getAllArticle = (req, res) => {
      const articleFeeds = Article.getAll();
      return res.status(StatusCode.REQUEST_SUCCEDED).send(articleFeeds);
    };

    getSpecificArticle = (req, res) => {
      let { articleId } = req.params;
      articleId = articleId.trim();
      // articleId must be a number
      if (isNaN(articleId)) {
        return res.status(StatusCode.BAD_REQUEST).send({
          status: StatusCode.BAD_REQUEST,
          error: 'articleId can\'t be a string!',
        });
      }
      // Does article id exist
      if (!Article.isArticleExist(articleId)) {
        return res.status(StatusCode.NOT_FOUND).send({
          status: StatusCode.NOT_FOUND,
          error: 'Such article is not found!',
        });
      }
      const article = Article.getArticleById(articleId);
      return res.status(StatusCode.REQUEST_SUCCEDED).send(article);
    };
}

export default ArticleController;
