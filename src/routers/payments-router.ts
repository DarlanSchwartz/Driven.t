import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPaymentSchema } from '@/schemas/payments-schemas';
import { createPayment, getPayment } from '@/controllers/payment-controller';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPayment)
  .post('/process', validateBody(createPaymentSchema), createPayment);

export { paymentsRouter };
