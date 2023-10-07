import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getUserBooking, postBooking, putBooking } from '@/controllers/booking-controller';
import { createBookingSchema } from '@/schemas/booking-schemas';

const bookingRouter = Router();

bookingRouter
  .get('/', authenticateToken, getUserBooking)
  .post('/', authenticateToken, validateBody(createBookingSchema), postBooking)
  .put('/:bookingId', authenticateToken, validateBody(createBookingSchema), putBooking);

export { bookingRouter };
