import { Prisma, PrismaClient } from "@prisma/client";

// Helper types
export type TimeRange = { start: Date; end: Date };

export class BookingRepository {
  private sanitizeSchema(schema: string): string {
    if (!/^[a-zA-Z0-9_]+$/.test(schema)) {
      throw new Error("Invalid schema name");
    }
    return schema;
  }

  async getBookingsForDate(
    schemaName: string,
    serviceId: string,
    date: Date,
    client: PrismaClient
  ): Promise<TimeRange[]> {
    schemaName = this.sanitizeSchema(schemaName);
    const rows: any[] = await client.$queryRawUnsafe(
      `SELECT start_ts, end_ts FROM "${schemaName}".bookings
       WHERE service_id = $1::uuid
         AND status = 'CONFIRMED'
         AND DATE(start_ts) = $2
         ORDER BY start_ts ASC
         `,
      serviceId,
      date
    );

    return rows.map((r) => ({
      start: new Date(r.start_ts),
      end: new Date(r.end_ts),
    }));
  }

  async countOverLapping(
    schemaName: string,
    serviceId: string,
    startDateTime: Date,
    endDateTime: Date,
    client: PrismaClient | Prisma.TransactionClient
  ): Promise<number> {
    schemaName = this.sanitizeSchema(schemaName);
    const rows: any[] = await client.$queryRawUnsafe(
      `
      SELECT COUNT(*)::int AS conflict
      FROM "${schemaName}".bookings
      WHERE service_id = $1::uuid
        AND status = 'CONFIRMED'
        AND start_ts < $3
        AND end_ts > $2;
    `,
      serviceId,
      startDateTime,
      endDateTime
    );

    // rows = [{ conflict: number }]
    return rows[0]?.conflict ?? 0;
  }
  async sumOverlappingQuantities(
    schemaName: string,
    serviceId: string,
    startDateTime: Date,
    endDateTime: Date,
    client: PrismaClient | Prisma.TransactionClient
  ): Promise<number> {
    schemaName = this.sanitizeSchema(schemaName);

    const rows: any[] = await client.$queryRawUnsafe(
      `
      SELECT COALESCE(SUM((meta->>'quantity')::int), 0)::int AS used_qty
      FROM "${schemaName}".bookings
      WHERE service_id = $1::uuid
        AND status = 'CONFIRMED'
        AND start_ts < $3
        AND end_ts > $2;
      `,
      serviceId,
      startDateTime,
      endDateTime
    );

    return rows[0]?.used_qty ?? 0;
  }
  async isAppointmentSlotTaken(
    schemaName: string,
    serviceId: string,
    client: PrismaClient | Prisma.TransactionClient,
    start: Date,
    end: Date
  ): Promise<boolean> {
    schemaName = this.sanitizeSchema(schemaName);

    const rows: { count: number }[] = await client.$queryRawUnsafe(
      `
      SELECT COUNT(*)::INT AS count
      FROM "${schemaName}".bookings
      WHERE "service_id" = $1::uuid
        AND status IN ('PENDING','CONFIRMED')
        AND start_ts < $2
        AND end_ts > $3
    `,
      serviceId,
      end,
      start
    );

    return rows.length > 0 && rows[0].count > 0;
  }
  async createBookingOrder(
    schemaName: string,
    client: Prisma.TransactionClient,
    start_ts: Date,
    end_ts: Date,
    user_id: string,
    service_id: string,
    status: string,
    meta?: any
  ): Promise<any> {
    schemaName = this.sanitizeSchema(schemaName);

    const result = await client.$queryRawUnsafe(
      `
      INSERT INTO "${schemaName}".bookings
        (user_id, service_id, start_ts, end_ts, status, meta)
      VALUES
        ($1::uuid, $2::uuid, $3, $4, $5, $6::jsonb)
      RETURNING *
    `,
      user_id,
      service_id,
      start_ts,
      end_ts,
      status,
      JSON.stringify(meta ?? {})
    );

    return (result as any[])[0];
  }
  async finalisingBookingOrder(
    client: Prisma.TransactionClient,
    ctx: {
      schemaName: string;
      status: string;
      bookingId: string;
      paymentId: string;
    }
  ) {
    ctx.schemaName = this.sanitizeSchema(ctx.schemaName);

    const query = `
    UPDATE "${ctx.schemaName}".bookings
    SET
      status = $1,
      payment_id = $2::uuid
    WHERE id = $3::uuid;
  `;

    await client.$queryRawUnsafe(
      query,
      ctx.status,
      ctx.paymentId,
      ctx.bookingId
    );
  }
}
