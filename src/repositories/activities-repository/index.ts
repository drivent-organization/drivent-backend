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

async function getActivitie(activitieId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activitieId
    }
  });
}

async function createSubscription(userId: number, activitieId: number) {
  return prisma.subscription.create({
    data: {
      userId,
      activityId: activitieId
    }
  });
}

async function getSubscriptionsQTD(activitieId: number) {
  return prisma.subscription.findMany({
    where: {
      activityId: activitieId
    }
  });
}

async function getUserActivitiesByUserId(userId: number) {
  return prisma.subscription.findMany({
    where: {
      userId
    }, include: {
      Activity: true
    }
  });
}  

async function findPlaces(): Promise<Place[]> {
  return prisma.place.findMany({});
}

const activitiesRepository = {
  findActivitiesDates,
  findActivitiesByDate,
  getActivitie,
  createSubscription,
  getSubscriptionsQTD,
  getUserActivitiesByUserId,
  findPlaces
};

export default activitiesRepository;
