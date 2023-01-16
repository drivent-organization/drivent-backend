import { unauthorizedError, cannotSelectActivitiesError, notFoundError, conflictError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Activity, TicketStatus } from "@prisma/client";
import { ActivityData } from "@/protocols";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import redisRepository from "@/repositories/redis-repository";

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

async function getActivitiesByDate(dateId: number, userId: number) {
  const activitiesKey = `activities_by_dateid_${dateId}`;
  const getActivitiesFromRedis = await redisRepository.findActivitiesByDate(activitiesKey);
  if (getActivitiesFromRedis) {
    const activitiesFromRedis = getActivitiesParams(getActivitiesFromRedis, userId);
    return activitiesFromRedis;
  }

  const activitiesData = await activitiesRepository.findActivitiesByDate(dateId);

  if (activitiesData.length === 0) {
    throw notFoundError();
  }
  await redisRepository.insertActivitiesByDate(activitiesKey, activitiesData);
  const activities = getActivitiesParams(activitiesData, userId);

  return activities;
}

function getActivitiesParams(activitiesData: ActivityData[], user_id: number) {
  const activities = activitiesData.map((activity) => {
    const subscribed = activity.Subscription.find(({ userId }) => Number(userId) === user_id);
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
      subscribed: subscribed ? true : false,
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

  await checkConflictTime(userId, activity);

  await activitiesRepository.createSubscription(userId, activityId);

  const activityObj = [
    {
      id: activity.id,
      name: activity.name,
      capacity: activity.capacity,
      weekdayId: activity.weekdayId,
      placeId: activity.placeId,
      startsAt: activity.startsAt,
      endsAt: activity.endsAt,
    },
  ];
  return activityObj;
}

async function checkConflictTime(userId: number, activity: Activity) {
  const subscriptions = await activitiesRepository.getUserSubscriptionsByUserId(userId);
  const activities = subscriptions.map((subscription) => subscription.Activity);
  const sameDayActivities = activities.filter(({ weekdayId }) => weekdayId === activity.weekdayId);
  const conflictTime = sameDayActivities.filter(
    ({ startsAt, endsAt }) => dayjs(activity.endsAt).isAfter(startsAt) && dayjs(activity.startsAt).isBefore(endsAt),
  );
  if (conflictTime.length !== 0) {
    throw conflictError("Date or time conflict");
  }
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
