import { BookingInputDTO } from "../dto/userDto";
import { BookingRepository } from "../repositories/bookingRepositary";
import { ServiceRepositary } from "../repositories/serviceRepositary";
import { validateAndParseBookingInput } from "../validation/BookingValidators";
import { computeAvailabilty } from "../factory/computeAvailabilty";
import { ServiceEntity } from "../types/serviceEntity";
import PrismaSingleton from "../config/prisma.singleton";
import { AppError } from "../utils/errors";
import { CreateBookingInputs } from "../types/parsedBookingTimes";
import { TenantBusinessInfo } from "../types/tenant";
import { CreateBookingInput } from "../types/Booking";
import { IPaymentHandlers } from "../provider/interfaces/IPaymentHandlers";
import { BookingEngineFactory } from "../factory/bookingEngineFactory";

const prisma = PrismaSingleton.getInstance();

export class UserServices {
  constructor(
    private serviceRepositary: ServiceRepositary,
    private bookingReposiatry: BookingRepository,
    private paymentHandlers: IPaymentHandlers
  ) {}
  async readServices(tenant: TenantBusinessInfo) {
    //@ts-ignore
    const schemaName = `tenant_${tenant.slug}`;

    const services = await this.serviceRepositary.readAllService(schemaName);

    return { services };
  }

  async readSlots(
    service: ServiceEntity,
    tenant: TenantBusinessInfo,
    data: BookingInputDTO
  ) {
    const schemaName = `tenant_${tenant.slug}`;

    const resourceType = tenant.resourceType;

    const parsed = validateAndParseBookingInput({
      date: data.date,
      openTime: tenant.openTime,
      closeTime: tenant.closeTime,
      periodStart: data.startTime,
      periodEnd: data.endTime,
      daysAvailable: tenant.daysAvailable,
    });

    const result = await computeAvailabilty(
      resourceType,
      schemaName,
      service,
      this.bookingReposiatry,
      parsed,
      prisma,
      data.quantity
    );
    return result;
  }
  async BookingService(
    userId: string,
    tenant: TenantBusinessInfo,
    service: ServiceEntity,
    data: CreateBookingInput
  ) {
    const schemaName = `tenant_${tenant.slug}`;
    const status = tenant.paymentRequired ? "PENDING" : "CONFIRMED";
    const resourceType = tenant.resourceType;
    const hasCapcity =
      service.capacity !== null && service.capacity !== undefined;

    const { startDateTime, endDateTime } = validateAndParseBookingInput({
      date: data.date,
      openTime: tenant.openTime,
      closeTime: tenant.closeTime,
      periodStart: data.startTime,
      periodEnd: data.endTime,
    });

    if (!startDateTime || !endDateTime)
      throw new AppError("hrs of period needed", 400);

    const ctx = {
      schema: schemaName,
      start: startDateTime,
      end: endDateTime,
      userId,
      status,
      qty: data?.quantity,
      hasCapacity: hasCapcity,
    };

    // select the engine based on resourceType
    const engine = BookingEngineFactory.create(
      resourceType,
      this.bookingReposiatry,
      service,
      ctx
    );

    return prisma.$transaction(async (tx) => {
      // 1. validate slot or capacity
      await engine.validate(tx);

      // 2. create booking (common)
      const booking = await this.bookingReposiatry.createBookingOrder(
        schemaName,
        tx,
        startDateTime,
        endDateTime,
        userId,
        service.id,
        status,
        engine.getMeta()
      );
      const meta = {
        type: "BOOKING_PAYMENT",
        schemaName,
        bookingId: booking.id,
      };
      let easypay = null;
      // 3. create easy pay instance
      if (tenant.paymentRequired) {
        easypay = await this.paymentHandlers.createOrder(meta, service.price!);
      }

      return { booking, easypay };
    });
  }
}
