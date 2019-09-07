import express from 'express';
import ArticleController from '../controllers/articleController';
import CommentController from '../controllers/commentController';
import isEmployee from '../middleware/isEmployee';
import isValidContentType from '../middleware/isContentTypeValid';

const router = express.Router();
// Creation of Controller Object
const articleController = new ArticleController();
const commentController = new CommentController();
// POST /articles
// Create an article
router.post('/articles',
  isValidContentType,
  isEmployee,
  articleController.createArticle);
// PATCH /articles/<articleId>
// Edit an article
router.patch('/articles/:articleId',
  isValidContentType,
  isEmployee,
  articleController.editArticle);
// DELETE /articles/<articleId>
// Employees can delete their articles
router.delete('/articles/:articleId',
  isEmployee,
  articleController.deleteArticle);
// POST /articles/<articleId>/comments
// Employees can comment on other colleagues' article post.
router.post('/articles/:articleId/comments',
  isValidContentType,
  isEmployee,
  commentController.commentOnArticle);
// GET /articles/<articleId>
// Employees can view a specific article.
router.get('/articles/:articleId',
  articleController.getSpecificArticle);
// GET /feeds
// Employees can view all articles
// showing the most recently posted articles first.
router.get('/feeds',
  articleController.getAllArticle);


export default router;
