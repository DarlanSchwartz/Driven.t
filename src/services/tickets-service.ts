import { Ticket, TicketType } from '@prisma/client';
import { ticketsRepository } from '@/repositories/tickets-repository';
import { enrollmentRepository } from '@/repositories';
import { notFoundErrorType2 } from '@/errors';

export type TicketResponse = {
  id: number;
  status: string; //RESERVED | PAID
  ticketTypeId: number;
  enrollmentId: number;
  TicketType: {
    id: number;
    name: string;
    price: number;
    isRemote: boolean;
    includesHotel: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};
async function createTicket(id: TicketTypeID, userId: number): Promise<TicketResponse> {
  const tickedTypeId = id.ticketTypeId;
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundErrorType2('Enrollment not found');
  }

  const result = ticketsRepository.create(tickedTypeId, enrollment.id);
  return result;
}

async function getTicketTypes(): Promise<TicketType[] | null> {
  const types = await ticketsRepository.getTicketTypes();
  return types;
}

async function getTicket(ownerId: number): Promise<TicketResponse | null> {
  const ticket = await ticketsRepository.getTicket(ownerId);
  if (!ticket) throw notFoundErrorType2('Ticket not found');
  return ticket;
}

export type TicketTypeID = { ticketTypeId: number };

export const ticketService = {
  createTicket,
  getTicket,
  getTicketTypes,
};
