import { prisma } from "@/config";
import { Booking, Hotel, Room } from "@prisma/client";

type CreateParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;
type UpdateParams = Omit<Booking, "userId" | "createdAt" | "updatedAt">;
type BookingData = Booking & {
  Room: Room & {
    Booking: Booking[];
    Hotel: Hotel;
  };
};
type BookingWithRoom = Booking & {
  Room: Room;
};

async function create({ roomId, userId }: CreateParams): Promise<BookingData> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
    include: {
      Room: {
        include: {
          Booking: true,
          Hotel: true,
        },
      },
    },
  });
}

async function findByRoomId(roomId: number): Promise<BookingWithRoom[]> {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function findByUserId(userId: number): Promise<BookingData> {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: {
        include: {
          Booking: true,
          Hotel: true,
        },
      },
    },
  });
}

async function upsertBooking({ id, roomId }: UpdateParams): Promise<BookingData> {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId,
    },
    include: {
      Room: {
        include: {
          Booking: true,
          Hotel: true,
        },
      },
    },
  });
}

const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  upsertBooking,
};

export default bookingRepository;
