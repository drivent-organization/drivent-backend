import { unauthorizedError, cannotSelectActivitiesError, notFoundError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";
import { ActivityData } from "@/protocols";
import dayjs from "dayjs";

async function checkPayment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw unauthorizedError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === TicketStatus.RESERVED) {
    throw unauthorizedError();
  }

  if (ticket.TicketType.isRemote) {
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

async function subscribeInActivity(userId: number, activitieId: number) {
  await checkPayment(userId);

  const activitie = await activitiesRepository.getActivitie(activitieId);
  if (!activitie) {
    throw notFoundError();
  }

  const subscriptionQTD = await activitiesRepository.getSubscriptionsQTD(activitieId);
  const capacity = Number(activitie.capacity);
  if (subscriptionQTD.length + 1 >= capacity) {
    throw unauthorizedError();
  }

  const getUserActivities = await activitiesRepository.getUserActivitiesByUserId(userId);
  const allActivities = getUserActivities.map((item) => item.Activity);

  const endTimeActivitie = allActivities.find(
    ({ endsAt }) => dayjs(endsAt).isAfter(dayjs(activitie.startsAt)) || 
    dayjs(endsAt).isSame(dayjs(activitie.startsAt)));
 
  if (endTimeActivitie) {
    throw unauthorizedError();
  }

  await activitiesRepository.createSubscription(userId, activitieId);

  const subscribedActivity = await activitiesRepository.getActivitie(activitieId);

  const activityObj = [{
    id: subscribedActivity.id,
    name: subscribedActivity.name,
    capacity: subscribedActivity.capacity,
    weekdayId: subscribedActivity.weekdayId,
    placeId: subscribedActivity.placeId,
    startsAt: subscribedActivity.startsAt,
    endsAt: subscribedActivity.endsAt
  }];
  
  return activityObj;
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
  subscribeInActivity,
  getPlaces

};

export default activitiesService;
