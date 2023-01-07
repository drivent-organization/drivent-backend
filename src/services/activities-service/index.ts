import { unauthorizedError, cannotSelectActivitiesError, notFoundError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";
import { ActivityData } from "@/protocols";

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
  const activitiesData = await activitiesRepository.findActivitiesByDate(dateId);
  if (activitiesData.length === 0) {
    throw notFoundError();
  }

  const activities = getActivitiesParams(activitiesData);

  return activities;
}

function getActivitiesParams(activitiesData: ActivityData[]) {
  const activities = activitiesData.map((activity) => {
    const vacancies = activity.capacity - activity.Subscription.length;
    const activityParams = {
      id: activity.id,
      activityName: activity.name,
      capacity: activity.capacity,
      vacancies,
      dateId: activity.weekdayId,
      placeId: activity.placeId,
      placeName: activity.Place.name,
      startsAt: activity.startsAt,
      endsAt: activity.endsAt,
    };
    return activityParams;
  });
  return activities;
}

async function getPlaces() {
  const places = await activitiesRepository.findPlaces();
  if (places.length === 0) {
    throw notFoundError();
  }

  return places;
}

const activitiesService = {
  getActivitiesDates,
  getActivitiesByDate,
  getPlaces,
};

export default activitiesService;
