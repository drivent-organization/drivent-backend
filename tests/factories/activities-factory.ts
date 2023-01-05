import faker from "@faker-js/faker";
import { Weekday } from "@prisma/client";
import { prisma } from "@/config";

type CreateActivityParams = {
  dateId: number;
  placeId: number;
};

type CreateSubscriptionParams = {
  activityId: number;
  userId: number;
};

export async function createWeekday() {
  return prisma.weekday.create({
    data: {
      name: faker.name.findName(),
    },
  });
}

export async function createPlace() {
  return prisma.place.create({
    data: {
      name: faker.name.findName(),
    },
  });
}

export async function createActivity({ dateId, placeId }: CreateActivityParams) {
  return prisma.activity.create({
    data: {
      name: faker.name.findName(),
      capacity: 1,
      weekdayId: dateId,
      placeId: placeId,
      startsAt: faker.date.soon(),
      endsAt: faker.date.soon(),
    },
  });
}

export async function createSubscription({ activityId, userId }: CreateSubscriptionParams) {
  return prisma.subscription.create({
    data: {
      activityId,
      userId,
    },
  });
}
