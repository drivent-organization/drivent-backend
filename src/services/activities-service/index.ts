import { unauthorizedError, cannotSelectActivitiesError, notFoundError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";

async function checkPayment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw unauthorizedError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === TicketStatus.RESERVED) {
    throw unauthorizedError();
  }

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotSelectActivitiesError();
  }
}

async function getActivitiesDates(userId: number) {
  await checkPayment(userId);
  const dates = await activitiesRepository.findActivitiesDates();
  if (dates.length === 0) {
    throw notFoundError();
  }
  return dates;
}

async function getActivitiesByDate(dateId: number) {
  const activities = await activitiesRepository.findActivitiesByDate(dateId);
  if (activities.length === 0) {
    throw notFoundError();
  }
  return activities;
}

const activitiesService = {
  getActivitiesDates,
  getActivitiesByDate,
};

export default activitiesService;
