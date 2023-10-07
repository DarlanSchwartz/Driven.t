import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getUserBooking, postBooking, putBooking } from '@/controllers/booking-controller';
import { createBookingSchema } from '@/schemas/booking-schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getUserBooking)
  .post('/', validateBody(createBookingSchema), postBooking)
  .put('/:bookingId', validateBody(createBookingSchema), putBooking);

export { bookingRouter };
