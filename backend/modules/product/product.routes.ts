import { Router } from 'express';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from './product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export const productRoutes = router;

