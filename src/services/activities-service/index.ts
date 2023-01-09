import { unauthorizedError, cannotSelectActivitiesError, notFoundError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";
import { ActivityData } from "@/protocols";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

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

async function subscribeInActivity(userId: number, activityId: number) {
  await checkPayment(userId);

  const activity = await activitiesRepository.getActivity(activityId);
  if (!activity) {
    throw notFoundError();
  }

  const subscriptionQTD = await activitiesRepository.getSubscriptionsQTD(activityId);
  const capacity = Number(activity.capacity);
  if (subscriptionQTD.length >= capacity) {
    throw unauthorizedError();
  }

  const getUserActivities = await activitiesRepository.getUserActivitiesByUserId(userId);
  const allActivities = getUserActivities.map((item) => item.Activity);

  const activityEndTime = allActivities.find(({ endsAt }) => dayjs(endsAt).isSameOrAfter(dayjs(activity.startsAt)));
  if (activityEndTime) {
    throw unauthorizedError();
  }

  await activitiesRepository.createSubscription(userId, activityId);

  const subscribedActivity = await activitiesRepository.getActivity(activityId);

  const activityObj = [
    {
      id: subscribedActivity.id,
      name: subscribedActivity.name,
      capacity: subscribedActivity.capacity,
      weekdayId: subscribedActivity.weekdayId,
      placeId: subscribedActivity.placeId,
      startsAt: subscribedActivity.startsAt,
      endsAt: subscribedActivity.endsAt,
    },
  ];

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
  getPlaces,
};

export default activitiesService;
