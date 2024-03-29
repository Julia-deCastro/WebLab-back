const express = require('express');

const imageRouter = express.Router();

const imageController = require('../../controllers/Image');
const imageValidator = require('../../validators/Image');
const auth = require('../../middlewares/authentication');

imageRouter.get('/',
  auth.authenticateToken,
  imageController.getAll
);
imageRouter.get(
  '/:experiment_id',
  imageValidator.getById,
  auth.authenticateToken,
  imageController.getById
);
imageRouter.post(
  '/',
  imageValidator.create,
  auth.authenticateToken,
  imageController.create
);
imageRouter.put(
  '/:experiment_id',
  imageValidator.update,
  auth.authenticateToken,
  imageController.update
);
imageRouter.delete(
  '/:experiment_id',
  imageValidator.delete,
  auth.authenticateToken,
  imageController.delete
);

module.exports = imageRouter;
