import { prisma } from "@/config";

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

const registerActivitiesRepository = {
  getActivitie,
  createSubscription,
  getSubscriptionsQTD,
  getUserActivitiesByUserId
};

export default registerActivitiesRepository;
