import { ApplicationError } from "@/protocols";

export function cannotSelectActivitiesError(): ApplicationError {
  return {
    name: "CannotSelectActivitiesError",
    message: "Your ticket is remote type!",
  };
}
