import { Ticket, TicketType } from '@prisma/client';
import { ticketsRepository } from '@/repositories/tickets-repository';
import { enrollmentRepository } from '@/repositories';
import { notFoundErrorType2 } from '@/errors';
/*
    {
    "id": 38,
    "ticketTypeId": 66,
    "enrollmentId": 120,
    "status": "RESERVED",
    "createdAt": "2023-09-22T22:06:36.826Z",
    "updatedAt": "2023-09-22T22:06:36.827Z"
    }

    {
    id: number,
    status: string, //RESERVED | PAID
    ticketTypeId: number,
    enrollmentId: number,
    TicketType: {
        id: number,
        name: string,
        price: number,
        isRemote: boolean,
        includesHotel: boolean,
        createdAt: Date,
        updatedAt: Date,
    },
    createdAt: Date,
    updatedAt: Date,
    }
*/
//Ticket and ticked type
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
export async function createTicket(id: TicketTypeID, userId: number): Promise<TicketResponse> {
  const tickedTypeId = id.ticketTypeId;
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundErrorType2('Enrollment not found');
  }

  const result = ticketsRepository.create(tickedTypeId, enrollment.id);
  return result;
}

export async function getTicketTypes(): Promise<TicketType[] | null> {
  const types = await ticketsRepository.getTicketTypes();
  return types;
}

export async function getTicket(ownerId: number): Promise<TicketResponse | null> {
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
