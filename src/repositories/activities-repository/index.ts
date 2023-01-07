import { prisma } from "@/config";
import { Place, Weekday } from "@prisma/client";
import { ActivityData } from "@/protocols";

async function findActivitiesDates(): Promise<Weekday[]> {
  return prisma.weekday.findMany({});
}

async function findActivitiesByDate(dateId: number): Promise<ActivityData[]> {
  return prisma.activity.findMany({
    where: {
      weekdayId: dateId,
    },
    include: {
      Place: true,
      Subscription: true,
    },
  });
}

async function findPlaces(): Promise<Place[]> {
  return prisma.place.findMany({});
}

const activitiesRepository = {
  findActivitiesDates,
  findActivitiesByDate,
  findPlaces,
};

export default activitiesRepository;
