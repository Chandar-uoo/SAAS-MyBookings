
export function generateAvailableSlots(openTime:Date, closeTime:Date, avgDuration:number, bookings:any) {
  const slots = [];

  let current = openTime;
  console.log(openTime,closeTime,avgDuration,bookings);
  

  while (current < closeTime) {
      const next = new Date(current.getTime() + avgDuration * 60000);
    if (next > closeTime) break;

    // Convert generated slot to date
    const slotStart = current
    const slotEnd = next;

    // Check overlap with any booking
    const hasOverlap = bookings.some((b:any) => {
      const bookStart = new Date(b.start);
      const bookEnd = new Date(b.end);

      return slotStart < bookEnd && slotEnd > bookStart;
    });

    if (!hasOverlap) {
      slots.push({
        start: slotStart.toTimeString().slice(0, 5),
        end: slotEnd.toTimeString().slice(0, 5),
      });
    }

    current = next;
  }

  return slots;
}

