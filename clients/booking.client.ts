import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Booking } from '../models/booking.types.js';

export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async getAllBookings(): Promise<APIResponse> {
    return this.request.get('/booking');
  }

  async getBookingsByName(
    firstname: string,
    lastname: string,
  ): Promise<APIResponse> {
    return this.request.get('/booking', {
      params: {
        firstname,
        lastname,
      },
    });
  }

  async getBookingById(bookingId: number): Promise<APIResponse> {
    return this.request.get(`/booking/${bookingId}`);
  }

  async createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', {
      data: booking,
    });
  }

  async updateBooking(
    bookingId: number,
    booking: Booking,
    authToken: string,
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${bookingId}`, {
      data: booking,
      headers: {
        Cookie: `token=${authToken}`,
      },
    });
  }

  async partiallyUpdateBooking(
    bookingId: number,
    bookingChanges: Partial<Booking>,
    authToken: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${bookingId}`, {
      data: bookingChanges,
      headers: {
        Cookie: `token=${authToken}`,
      },
    });
  }

  async deleteBooking(
    bookingId: number,
    authToken: string,
  ): Promise<APIResponse> {
    return this.request.delete(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${authToken}`,
      },
    });
  }
}
