import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import registerActivitiesRepository from "@/repositories/register-activities-repository";
import { notFoundError, unauthorizedError } from "@/errors";

async function enterActivities(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  
  if (!enrollment) {
    throw unauthorizedError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  
  if (!ticket || ticket.status === "RESERVED") {
    throw unauthorizedError();
  }

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw unauthorizedError();
  }
}

async function registerActivities(userId: number, activitieId: number) {
  await enterActivities(userId);

  const activitie = await registerActivitiesRepository.getActivitie(activitieId);
  if (!activitie) {
    throw notFoundError();
  }

  const subscriptionQTD = await registerActivitiesRepository.getSubscriptionsQTD(activitieId);
  const capacity = Number(activitie.capacity);
  if (subscriptionQTD.length + 1 >= capacity) {
    throw unauthorizedError();
  }

  // const getUserActivities = await registerActivitiesRepository.getUserActivitiesByUserId(userId);
  // const allActivities = getUserActivities.map((item) => item.Activity.endsAt);
  // const endTimeActivitie = allActivities.find(({ endsAt }) => Date.parse(endsAt) < Date.parse(activitie.startsAt));

  await registerActivitiesRepository.createSubscription(userId, activitieId);
  return activitie;
}

const registerActivitiesService = {
  registerActivities,
};

export default registerActivitiesService;
