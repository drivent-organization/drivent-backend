import { cannotBookingError, conflictError, notFoundError } from "@/errors";
import roomRepository from "@/repositories/room-repository";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import tikectRepository from "@/repositories/ticket-repository";

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotBookingError();
  }
  const ticket = await tikectRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBookingError();
  }
}

async function checkValidBooking(roomId: number, userId?: number) {
  const room = await roomRepository.findById(roomId);
  const bookings = await bookingRepository.findByRoomId(roomId);

  if (!room) {
    throw notFoundError();
  }
  if (room.capacity <= bookings.length) {
    throw cannotBookingError();
  }

  const userHasBooking = await bookingRepository.findByUserId(userId);
  if (userHasBooking && userId) {
    throw conflictError("Conflict");
  }
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.findByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function bookingRoomById(userId: number, roomId: number) {
  await checkEnrollmentTicket(userId);
  await checkValidBooking(roomId, userId);

  const booking = await bookingRepository.create({ roomId, userId });

  return {
    bookingId: booking.id,
    Hotel: {
      id: booking.Room.Hotel.id,
      name: booking.Room.Hotel.name,
      image: booking.Room.Hotel.image,
    },
    Room: {
      id: booking.Room.id,
      name: booking.Room.name,
      capacity: booking.Room.capacity,
      bookings: booking.Room.Booking.length,
    },
  };
}

async function changeBookingRoomById(userId: number, roomId: number) {
  await checkValidBooking(roomId);
  const booking = await bookingRepository.findByUserId(userId);

  if (!booking || booking.userId !== userId) {
    throw cannotBookingError();
  }

  const newBooking = await bookingRepository.upsertBooking({
    id: booking.id,
    roomId,
  });

  return {
    bookingId: newBooking.id,
    Hotel: {
      id: newBooking.Room.Hotel.id,
      name: newBooking.Room.Hotel.name,
      image: newBooking.Room.Hotel.image,
    },
    Room: {
      id: newBooking.Room.id,
      name: newBooking.Room.name,
      capacity: newBooking.Room.capacity,
      bookings: newBooking.Room.Booking.length,
    },
  };
}

const bookingService = {
  bookingRoomById,
  getBooking,
  changeBookingRoomById,
};

export default bookingService;
