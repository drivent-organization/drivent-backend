import { prisma } from "@/config";
import { Booking, Hotel, Room } from "@prisma/client";

type CreateParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;
type UpdateParams = Omit<Booking, "createdAt" | "updatedAt">;
type BookingData = Booking & {
  Room: Room & {
    Booking: Booking[];
    Hotel: Hotel;
  };
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

async function findByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function findByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function upsertBooking({ id, roomId, userId }: UpdateParams) {
  return prisma.booking.upsert({
    where: {
      id,
    },
    create: {
      roomId,
      userId,
    },
    update: {
      roomId,
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
