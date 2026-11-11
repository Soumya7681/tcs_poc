import { Router } from 'express';
import {
  getProducts,
  getStats,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/stats', getStats);
router.route('/').get(getProducts).post(createProduct);
router.route('/:id').put(updateProduct).delete(deleteProduct);

export default router;
