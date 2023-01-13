import faker from "@faker-js/faker";
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
      id: 1,
      name: "Aula de montar PC com custom watercooler",
      capacity: 1,
      weekdayId: dateId,
      placeId: placeId,
      startsAt: new Date("2023/01/10 09:00:00"),
      endsAt: new Date("2023/01/10 11:00:00")
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

export async function createActivityWithConflictantTime({ dateId, placeId }: CreateActivityParams) {
  return prisma.activity.create({
    data: {
      id: 2,
      name: "Aula de montar PC com custom watercooler",
      capacity: 1,
      weekdayId: dateId,
      placeId: placeId,
      startsAt: new Date("2023/01/10 10:00:00"),
      endsAt: new Date("2023/01/10 12:00:00")
    }
  });
}
