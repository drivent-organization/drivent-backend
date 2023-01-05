import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createHotel,
  createRoomWithHotelId,
  createWeekday,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /activities", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 401 when user has not a enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when user has not a ticket ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when user has ticket not paid yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 400 when user has a remote ticket type", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when theres no activities date", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and dates body when has activities dates available", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const weekday = await createWeekday();
      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([{
        id: weekday.id,
        name: weekday.name,
        createdAt: weekday.createdAt.toISOString(),
        updatedAt: weekday.updatedAt.toISOString(),
      }]);
    });
  });
});
