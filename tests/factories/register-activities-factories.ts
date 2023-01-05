import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createWeekday() {
  return prisma.weekday.create({
    data: {
      name: "terça-feira"
    }
  });
}

export async function createPlace() {
  return prisma.place.create({
    data: {
      name: "sexta-feira"
    }
  });
}

export async function createActivity(weekdayId: number, placeId: number) {
  return prisma.activity.create({
    data: {
      name: faker.name.findName(),
      capacity: 3,
      weekdayId,
      placeId,
      startsAt: faker.date.future(),
      endsAt: faker.date.future()
    }
  });
}

export async function createSubscription(activityId: number, userId: number) {
  return prisma.subscription.create({
    data: {
      activityId,
      userId 
    }
  });
}
