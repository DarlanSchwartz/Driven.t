import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelService } from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const hotels = await hotelService.getAllHotels(req.userId);
  return res.status(httpStatus.OK).send(hotels);
}

export async function getHotelWithRooms(req: AuthenticatedRequest, res: Response) {
  if (!req.params.hotelId || isNaN(parseInt(req.params.hotelId))) return res.sendStatus(httpStatus.NOT_FOUND);
  const hotelId = Number(req.params.hotelId);

  const hotel = await hotelService.getHotelWithRooms(hotelId, req.userId);
  return res.status(httpStatus.OK).send(hotel);
}
