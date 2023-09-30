import { Room, Hotel } from '@prisma/client';
import { prisma } from '@/config';

import { HotelWithRooms } from '@/services/hotels-service';

async function getAllHotels(): Promise<Hotel[]> {
  const hotels = await prisma.hotel.findMany();
  return hotels;
}

async function getHotelWithRooms(hotelId: number) {
  const hotels = await prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
  return hotels;
}

export const hotelRepository = {
  getAllHotels,
  getHotelWithRooms,
};
