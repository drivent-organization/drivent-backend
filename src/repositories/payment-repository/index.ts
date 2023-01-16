import { prisma } from "@/config";
import { Payment, TicketStatus } from "@prisma/client";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    }
  });
}

async function createPayment(ticketId: number, params: PaymentParams) {
  return await prisma.$transaction([
    prisma.payment.create({
      data: {
        ticketId,
        ...params,
      }
    }),
    prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: TicketStatus.PAID,
      },
    })
  ]);
}

export type PaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
};

export default paymentRepository;
