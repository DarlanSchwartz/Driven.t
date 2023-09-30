import { Hotel, Room } from '@prisma/client';
import { notFoundErrorType2 } from '@/errors';
import { enrollmentRepository } from '@/repositories';
import { hotelRepository } from '@/repositories/hotels-repository';
import { paymentRequiredError } from '@/errors/payment-required-errors';

export type HotelWithRooms = Hotel & {
  Rooms: Room[];
};
/*
- Ambos os endpoints que serão implementados são do tipo **GET**, 
    e a listagem dos recursos só deve funcionar se para o respectivo usuário
    **existir uma inscrição** (`enrollment`) 
    com ticket **pago** (`PAID`) 
    que **inclua hospedagem** (`includesHotel`).
    - Se não existe inscrição, ticket ou hotel ⇒ `404 (not found)`.
    - Ticket não foi pago, é remoto ou não inclui hotel ⇒ `402 (payment required)`.

*/
async function getAllHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findEnrollmentWithTicket(userId);
  if (!enrollment) throw notFoundErrorType2('Enrollment not found, so no hotels for you');
  if (!enrollment.Ticket) throw notFoundErrorType2('Ticket not found, so no hotels for you');
  if (!enrollment.Ticket.TicketType.includesHotel) throw paymentRequiredError('This ticket does not include hotel');
  if (enrollment.Ticket.TicketType.isRemote) throw paymentRequiredError('This ticket is remote');
  if (enrollment.Ticket.status !== 'PAID') throw paymentRequiredError('You need to pay for the hotel');
  const hotels = await hotelRepository.getAllHotels();
  return hotels;
}

async function getHotelWithRooms(hotelId: number, userId: number): Promise<Hotel & { Rooms: Room[] }> {
  const enrollment = await enrollmentRepository.findEnrollmentWithTicket(userId);
  if (!enrollment) throw notFoundErrorType2('Enrollment not found, so no hotels for you');
  if (!enrollment.Ticket) throw notFoundErrorType2('Ticket not found, so no hotels for you');
  if (enrollment.Ticket.status !== 'PAID') throw paymentRequiredError('You need to pay for the ticket');
  if (!enrollment.Ticket.TicketType.includesHotel) throw paymentRequiredError('This ticket does not include hotel');
  if (enrollment.Ticket.TicketType.isRemote) throw paymentRequiredError('This ticket is remote');
  const hotels = await hotelRepository.getHotelWithRooms(hotelId);
  return hotels;
}

export const hotelService = {
  getHotelWithRooms,
  getAllHotels,
};
