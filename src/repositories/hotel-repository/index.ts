import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number): Promise<HotelWithRooms> {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: {
        include: {
          Booking: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
}

type HotelWithRooms = Hotel & {
  Rooms: (RoomWithVacancyInfo & {
    Booking: {
      id: number;
    }[];
  })[];
};

type RoomWithVacancyInfo = {
  id: number;
  name: string;
  capacity: number;
  hotelId: number;
  vacancies?: number;
  createdAt: Date;
  updatedAt: Date;
};

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
};

export default hotelRepository;
