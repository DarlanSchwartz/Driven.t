import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentService } from '@/services';
import { PaymentBody } from '@/schemas/payments-schemas';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const payment = await paymentService.getPayment(Number(req.query.ticketId), req.userId);
  return res.status(httpStatus.OK).send(payment);
}

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const payment = await paymentService.createPayment(req.body as PaymentBody, req.userId);
  return res.status(httpStatus.OK).send(payment);
}
