import faker from '@faker-js/faker';
import { generateCPF, getStates } from '@brazilian-utils/brazilian-utils';
import { User } from '@prisma/client';

import { createUser } from './users-factory';
import { prisma } from '@/config';

/*
 id        Int       @id @default(autoincrement())
  name      String
  capacity  Int
  hotelId   Int
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  Hotel     Hotel     @relation(fields: [hotelId], references: [id])
  Booking   Booking[]

*/

export async function createHotel(includeRooms: boolean) {
  return prisma.hotel.create({
    data: {
      image: faker.image.imageUrl(),
      name: faker.name.findName(),
      Rooms: {
        create: {
          capacity: faker.datatype.number(),
          name: faker.name.findName(),
        },
      },
    },
    include: {
      Rooms: includeRooms,
    },
  });
}
