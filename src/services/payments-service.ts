import { ticketService } from './tickets-service';
import { PaymentBody } from '@/schemas/payments-schemas';
import { notFoundErrorType2, unauthorizedErrorType2 } from '@/errors';
import { ticketsRepository } from '@/repositories/tickets-repository';
import { paymentRepository } from '@/repositories';
import { badCepRequestError, badRequestError } from '@/errors/bad-request-error';

export type PaymentResponse = {
  id: number;
  ticketId: number;
  value: number;
  cardIssuer: string; // VISA | MASTERCARD
  cardLastDigits: string;
  createdAt: Date;
  updatedAt: Date;
};

async function createPayment(body: PaymentBody, userId: number): Promise<PaymentResponse | null> {
  const ticket = await ticketsRepository.ticketExists(Number(body.ticketId));
  if (!ticket) throw notFoundErrorType2('Ticket not found');

  const ticketOfUser = await ticketsRepository.getTicketWithEnrollment(body.ticketId);
  if (!ticketOfUser || ticketOfUser.Enrollment.userId !== userId)
    throw unauthorizedErrorType2('User does not own this ticket');
  const payment = await paymentRepository.createPayment(body, ticketOfUser.TicketType.price);
  return payment;
}

/*
 × should respond with status 400 if query param ticketId is missing (184 ms)
      × should respond with status 404 when given ticket doesnt exist (197 ms)
      × should respond with status 401 when user doesnt own given ticket (262 ms)
*/

async function getPayment(ticketId: number, userRequesterId: number): Promise<PaymentResponse | null> {
  if (!ticketId || isNaN(ticketId)) throw badRequestError('TicketId is required');
  const ticketExists = await ticketsRepository.ticketExists(Number(ticketId));
  if (!ticketExists) throw notFoundErrorType2('Ticket not found');
  const ticketOfUser = await ticketsRepository.getTicketWithEnrollment(ticketId);
  if (!ticketOfUser || ticketOfUser.Enrollment.userId !== userRequesterId)
    throw unauthorizedErrorType2('User does not own this ticket');
  const payment = await paymentRepository.getPayment(ticketId);
  if (!payment) throw notFoundErrorType2('Payment not found');
  return payment;
}

export const paymentService = {
  getPayment,
  createPayment,
};
