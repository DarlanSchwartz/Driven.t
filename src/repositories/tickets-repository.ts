import { Enrollment, Ticket, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';
import { TicketResponse } from '@/services/tickets-service';

export type TicketResponseWithEnrollment = {
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
  Enrollment: Enrollment;
  createdAt: Date;
  updatedAt: Date;
};

async function getTicket(userId: number): Promise<TicketResponse | null> {
  const ticket = await prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId: userId,
      },
    },
    include: {
      TicketType: true,
    },
  });
  return ticket as TicketResponse;
}

async function getTicketWithEnrollment(tickedId: number): Promise<TicketResponseWithEnrollment | null> {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: tickedId,
    },
    include: {
      TicketType: true,
      Enrollment: true,
    },
  });
  return ticket as TicketResponseWithEnrollment;
}

async function getTicketPrice(tickedId: number): Promise<number | null> {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: tickedId,
    },
    include: {
      TicketType: true,
    },
  });

  return ticket.TicketType.price;
}
async function getTicketTypes() {
  return prisma.ticketType.findMany();
}
async function create(ticketId: number, enrollmentId: number): Promise<TicketResponse> {
  const ticket = await prisma.ticket.create({
    data: {
      enrollmentId: enrollmentId,
      ticketTypeId: ticketId,
      status: TicketStatus.RESERVED,
    },
  });
  const tickedType = await prisma.ticketType.findFirst({
    where: {
      id: ticketId,
    },
  });

  const result: TicketResponse = {
    id: ticket.id,
    status: ticket.status.toString(),
    ticketTypeId: ticket.ticketTypeId,
    enrollmentId: ticket.enrollmentId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    TicketType: tickedType,
  };

  return result;
}
async function ticketExists(ticketId: number): Promise<boolean> {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
  });
  return ticket !== null;
}

export const ticketsRepository = {
  create,
  getTicket,
  getTicketTypes,
  ticketExists,
  getTicketPrice,
  getTicketWithEnrollment,
};
