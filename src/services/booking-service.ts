import { notFoundErrorType2 } from '@/errors';
import { bookingRepository } from '@/repositories/booking-repository';
import { forbiddenError } from '@/errors/forbidden-error';
import { hotelRepository } from '@/repositories/hotels-repository';
import { ticketsRepository } from '@/repositories/tickets-repository';

async function getUserBooking(userId: number) {
  const result = await bookingRepository.getByUserId(userId);
  if (!result) throw notFoundErrorType2('Booking not found, so no hotels for you');
  delete result.userId;
  delete result.createdAt;
  delete result.updatedAt;
  delete result.roomId;
  return result;
}

/*
- `roomId` não existente ⇒ deve retornar status code `404 (Not Found)`.
- `roomId` sem vaga ⇒ deve retornar status code `403 (Forbidden)`.
    - Um quarto pode receber mais de um usuário, até o limite de sua capacidade.
    - Para verificar quantas pessoas já estão em um quarto, você deve olhar pelas reservas (`bookings`).
- Fora da regra de negócio ⇒ deve retornar status code `403 (Forbidden)`.

Retorna status 403 se o ticket do usuário é remoto?
DETALHES

Retorna status 403 se o ticket do usuário não inclui hotel?
DETALHES

Retorna status 403 se o ticket do usuário não foi pago?
*/

async function createBooking(roomId: number, userId: number) {
  const ticket = await ticketsRepository.getTicket(userId);
  if (ticket.TicketType.isRemote) throw forbiddenError('Ticket is remote');
  if (ticket.TicketType.includesHotel == false) throw forbiddenError('Ticket does not include hotel');
  if (ticket.status !== 'PAID') throw forbiddenError('Ticket is not paid');
  const room = await bookingRepository.roomIdExists(roomId);
  if (!room) throw notFoundErrorType2('Room not found');
  if (room.Booking.length >= room.capacity) throw forbiddenError('Room is full');
  const result = await bookingRepository.create(userId, roomId);
  const response = { bookingId: result.id };
  return response;
}

/*
- `roomId` não existente ⇒ deve retornar status code `404 (Not Found)`.
- `roomId` sem reserva ⇒ deve retornar status code `403 (Forbidden)`.
- `roomId` sem vaga no novo quarto ⇒ deve retornar status code `403 (Forbidden)`.
- Fora da regra de negócio ⇒ deve retornar status code `403 (Forbidden)`.
*/
async function updateBooking(roomId: number, bookingId: number | string | undefined | null, userId: number) {
  const room = await bookingRepository.roomIdExists(roomId);
  if (!room) throw notFoundErrorType2('Room not found');
  const ticket = await ticketsRepository.getTicket(userId);
  if (ticket.status !== 'RESERVED') throw forbiddenError('Ticket is not reserved');
  if (room.Booking.length >= room.capacity) throw forbiddenError('Room is full');
  if (isNaN(Number(bookingId))) throw notFoundErrorType2('BookingId is not a number');
  const result = await bookingRepository.update(Number(bookingId), roomId);
  const response = { bookingId: result.id };
  return response;
}

export const bookingService = {
  getUserBooking,
  createBooking,
  updateBooking,
};
