import faker from "@faker-js/faker";
import { Weekday } from "@prisma/client";
import { prisma } from "@/config";

export async function createWeekday() {
  return prisma.weekday.create({
    data: {
      name: faker.name.findName(),
    },
  });
}
