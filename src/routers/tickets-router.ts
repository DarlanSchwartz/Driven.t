import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { newTicketSchema } from '@/schemas/tickets-schemas';
import { createTicket, getTicket, getTicketTypes } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', authenticateToken, getTicket)
  .get('/types', getTicketTypes)
  .post('/', authenticateToken, validateBody(newTicketSchema), createTicket);

export { ticketsRouter };
