import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";
import addressRepository from "@/repositories/address-repository";
import { Address } from "@prisma/client";

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function findById(enrollmentId: number) {
  return prisma.enrollment.findFirst({
    where: { id: enrollmentId },
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  await prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

async function upsertEnrollmentAddress(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
  createdAddress: CreateAddressParams,
  updatedAddress: UpdateAddressParams,
) {
  const [enrollment, address] = await prisma.$transaction([
    prisma.enrollment.upsert({
      where: {
        userId,
      },
      create: createdEnrollment,
      update: updatedEnrollment,
    }),
    prisma.address.upsert({
      where: {
        enrollment,
      },
      create: {
        ...createdAddress,
        Enrollment: { connect: { id: enrollmentId } },
      },
      update: updatedAddress,
    }),
  ]);
}

async function create(userId: number, createdEnrollment: CreateEnrollmentParams, createdAddress: CreateAddressParams) {
  await prisma.enrollment.create({
    data: {
      ...createdEnrollment,
      Address: {
        create: createdAddress,
      },
    },
  });
}

async function update(userId: number, updatedEnrollment: UpdateEnrollmentParams, updatedAddress: UpdateAddressParams) {
  await prisma.enrollment.update({
    where: {
      userId,
    },
    data: {
      ...updatedEnrollment,
      Address: {
        update: {
          data: {
            ...updatedAddress,
          },
        },
      },
    },
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, "userId">;
export type CreateAddressParams = Omit<Address, "id" | "createdAt" | "updatedAt" | "enrollmentId">;
export type UpdateAddressParams = CreateAddressParams;
const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
  create,
  update,
  findById,
};

export default enrollmentRepository;
