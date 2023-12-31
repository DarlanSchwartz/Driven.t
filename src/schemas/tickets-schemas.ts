import Joi from 'joi';
import { TicketTypeID } from '@/services/tickets-service';

export const newTicketSchema = Joi.object<TicketTypeID>({
  ticketTypeId: Joi.number().required(),
});
