import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meRouter from "./me";
import postsRouter from "./posts";
import productsRouter from "./products";
import vendorsRouter from "./vendors";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import miscRouter from "./misc";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meRouter);
router.use(postsRouter);
router.use(productsRouter);
router.use(vendorsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(miscRouter);

export default router;
