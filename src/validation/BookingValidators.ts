import { combineDateTime } from "../utils/combineDateTime";
import { toDate } from "../utils/dateCovert";
import { AppError } from "../utils/errors";

export function validateAndParseBookingInput(input: {
  date: string;
  openTime: string;
  closeTime: string;
  periodStart?: string;
  periodEnd?: string;
  daysAvailable?: string[];
}) {
  const { date, openTime, closeTime, periodStart, periodEnd, daysAvailable } =
    input;

  const givenDate = toDate(date);
  const today = new Date();

  const openingHrs = new Date(openTime);
  const closingHrs = new Date(closeTime);

  const businessOpenTime = combineDateTime(
    date,
    openingHrs.toTimeString().slice(0, 5)
  );
  const businessCloseTime = combineDateTime(
    date,
    closingHrs.toTimeString().slice(0, 5)
  );

  const startDateTime = periodStart ? combineDateTime(date, periodStart) : null;
  const endDateTime = periodEnd ? combineDateTime(date, periodEnd) : null;

  if (givenDate < today) throw new AppError("Date is in past", 400);

  if (startDateTime && endDateTime && startDateTime > endDateTime)
    throw new AppError("start time cant be in future", 400);

  const dayNumber = givenDate.getDay();
  const tenantDayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  if (daysAvailable && !daysAvailable.includes(tenantDayNames[dayNumber]))
    throw new AppError("Service not available that day", 400);

  return {
    givenDate,
    businessOpenTime,
    businessCloseTime,
    startDateTime,
    endDateTime,
  };
}
