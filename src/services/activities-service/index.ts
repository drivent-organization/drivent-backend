import { cannotBookingError, conflictError, notFoundError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";

async function getActivitiesDates() {
  const dates = await activitiesRepository.findActivitiesDates();
  if (dates.length === 0) {
    throw notFoundError();
  }
  return dates;
}

async function getActivitiesByDate(dateId: number) {
  const activities = await activitiesRepository.findActivitiesByDate(dateId);
  if (activities.length === 0) {
    throw notFoundError();
  }
  return activities;
}

const activitiesService = {
  getActivitiesDates,
  getActivitiesByDate,
};

export default activitiesService;
