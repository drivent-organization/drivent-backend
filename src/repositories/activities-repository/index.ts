import { prisma } from "@/config";
import { Weekday, Activity, Place, Subscription } from "@prisma/client";

type ActivityData = Activity & {
  Place: Place;
  Subscription: Subscription[];
};

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

const activitiesRepository = {
  findActivitiesDates,
  findActivitiesByDate,
};

export default activitiesRepository;
