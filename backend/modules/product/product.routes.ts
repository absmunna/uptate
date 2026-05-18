import { Router } from 'express';
import { getProducts, addProduct, deleteProduct } from './product.controller';

const router = Router();

router.get('/', getProducts);
router.post('/', addProduct);
router.delete('/:id', deleteProduct);

export const productRoutes = router;
