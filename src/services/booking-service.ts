import { notFoundErrorType2 } from '@/errors';
import { bookingRepository } from '@/repositories/booking-repository';
import { forbiddenError } from '@/errors/forbidden-error';

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
*/

async function createBooking(roomId: number, userId: number) {
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
  if (room.Booking.length == 0) throw forbiddenError('Room is empty');
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
