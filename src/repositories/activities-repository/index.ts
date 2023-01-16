import { prisma } from "@/config";
import { Place, Weekday } from "@prisma/client";
import { ActivityData } from "@/protocols";

async function findActivitiesDates(): Promise<Weekday[]> {
  return prisma.weekday.findMany({});
}

async function findActivitiesByDate(dateId: number): Promise<ActivityData[]> {
  return prisma.activity.findMany({
    orderBy: {
      startsAt: "asc",
    },
    where: {
      weekdayId: dateId,
    },
    include: {
      Place: true,
      Subscription: true,
    },
  });
}

async function getActivity(activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId,
    },
  });
}

async function createSubscription(userId: number, activityId: number) {
  return prisma.subscription.create({
    data: {
      userId,
      activityId,
    },
  });
}

async function getSubscriptionsQTD(activityId: number) {
  return prisma.subscription.findMany({
    where: {
      activityId,
    },
  });
}

async function getUserSubscriptionsByUserId(userId: number) {
  return prisma.subscription.findMany({
    where: {
      userId,
    },
    include: {
      Activity: true,
    },
  });
}

async function findPlaces(): Promise<Place[]> {
  return prisma.place.findMany({});
}

const activitiesRepository = {
  findActivitiesDates,
  findActivitiesByDate,
  getActivity,
  createSubscription,
  getSubscriptionsQTD,
  getUserSubscriptionsByUserId,
  findPlaces,
};

export default activitiesRepository;
