import { notFoundErrorType2 } from '@/errors';
import { bookingRepository } from '@/repositories/booking-repository';
import { forbiddenError } from '@/errors/forbidden-error';
import { ticketsRepository } from '@/repositories/tickets-repository';
import { enrollmentRepository } from '@/repositories';

async function getUserBooking(userId: number) {
  const result = await bookingRepository.getByUserId(userId);
  if (!result) throw notFoundErrorType2('Booking not found, so no hotels for you');
  delete result.userId;
  delete result.createdAt;
  delete result.updatedAt;
  delete result.roomId;
  return result;
}

async function createBooking(roomId: number, userId: number) {
  const room = await bookingRepository.roomIdExists(roomId);
  if (!room) throw notFoundErrorType2('Room not found');
  if (room.Booking.length >= room.capacity) throw forbiddenError('Room is full');
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenError('Enrollment not found');
  const ticket = await ticketsRepository.getTicket(userId);

  if (!ticket) throw forbiddenError('Ticket not found');
  if (!ticket.TicketType) throw forbiddenError('TicketType not found');
  if (ticket.TicketType.isRemote) throw forbiddenError('Ticket is remote');
  if (ticket.TicketType.includesHotel == false) throw forbiddenError('Ticket does not include hotel');
  if (ticket.status !== 'PAID') throw forbiddenError('Ticket is not paid');

  const result = await bookingRepository.create(userId, roomId);
  const response = { bookingId: result.id };
  return response;
}

async function updateBooking(roomId: number, bookingId: number | string | undefined | null, userId: number) {
  if (isNaN(Number(bookingId)) || bookingId == '0') throw notFoundErrorType2('BookingId is not a number');
  const room = await bookingRepository.roomIdExists(roomId);
  if (!room) throw notFoundErrorType2('Room not found');
  const booking = await bookingRepository.getByUserId(userId);

  if (!booking) throw forbiddenError('Booking not found');
  if (room.Booking.length >= room.capacity) throw forbiddenError('Room is full');

  const result = await bookingRepository.update(Number(bookingId), roomId);
  const response = { bookingId: result.id };
  return response;
}

export const bookingService = {
  getUserBooking,
  createBooking,
  updateBooking,
};
