import { Activity, Place, Subscription } from "@prisma/client";

export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

//Regra de Negócio
export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  error?: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type ActivityData = Activity & {
  Place: Place;
  Subscription: Subscription[];
};

export type ActivitiesParams = {
  id: number;
  activityName: string;
  capacity: number;
  dateId: number;
  placeId: number;
  placeName: string;
  startsAt: Date;
  endsAt: Date;
  subscribed: boolean;
}[];
