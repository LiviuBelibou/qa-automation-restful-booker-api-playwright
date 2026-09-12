import type { Booking } from '../models/booking.types.js';

export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const defaultBooking: Booking = {
    firstname: 'Olivia',
    lastname: 'Tester',
    totalprice: 250,
    depositpaid: true,
    bookingdates: {
      checkin: '2030-06-01',
      checkout: '2030-06-07',
    },
    additionalneeds: 'Breakfast',
  };

  return {
    ...defaultBooking,
    ...overrides,
    bookingdates: {
      ...defaultBooking.bookingdates,
      ...overrides.bookingdates,
    },
  };
}
