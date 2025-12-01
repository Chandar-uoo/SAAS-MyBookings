export interface ParsedBookingTimes {
  givenDate: Date;
  businessOpenTime: Date;
  businessCloseTime: Date;
  startDateTime?: Date | null;
  endDateTime?: Date | null;
}

export interface CreateBookingInputs {
  startDateTime: Date ;
  endDateTime: Date ;
  quantity?:number;
}
