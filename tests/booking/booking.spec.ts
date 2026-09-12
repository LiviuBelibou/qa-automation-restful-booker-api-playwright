import { test, expect } from '../../fixtures/api.fixture.js';
import type { BookingId, CreatedBooking } from '../../models/booking.types.js';
import { buildBooking } from '../../test-data/booking-data.js';
import { bookingSchema } from '../../schemas/booking.schema.js';
import { validateSchema } from '../../utils/schema-validator.js';

test.describe('Booking API', () => {
  test(
    'user can create and retrieve a booking',
    { tag: ['@booking', '@smoke'] },
    async ({ bookingClient, authToken }) => {
      const bookingData = buildBooking();
      let bookingId: number | undefined;

      try {
        const createResponse = await bookingClient.createBooking(bookingData);

        expect(createResponse.status()).toBe(200);
        expect(createResponse.headers()['content-type']).toContain(
          'application/json',
        );

        const createdBooking = (await createResponse.json()) as CreatedBooking;

        bookingId = createdBooking.bookingid;

        expect(bookingId).toEqual(expect.any(Number));
        expect(createdBooking.booking).toEqual(bookingData);

        const getResponse = await bookingClient.getBookingById(bookingId);

        expect(getResponse.status()).toBe(200);

        const retrievedBooking: unknown = await getResponse.json();

        validateSchema(bookingSchema, retrievedBooking);
        expect(retrievedBooking).toEqual(bookingData);
      } finally {
        if (bookingId !== undefined) {
          const deleteResponse = await bookingClient.deleteBooking(
            bookingId,
            authToken,
          );

          expect(deleteResponse.status()).toBe(201);
        }
      }
    },
  );
  test(
    'authenticated user can fully update a booking',
    { tag: ['@booking', '@regression'] },
    async ({ bookingClient, authToken }) => {
      const originalBooking = buildBooking();
      const updatedBooking = buildBooking({
        firstname: 'Amelia',
        lastname: 'Updated',
        totalprice: 400,
        depositpaid: false,
        additionalneeds: 'Late checkout',
      });

      let bookingId: number | undefined;

      try {
        const createResponse =
          await bookingClient.createBooking(originalBooking);

        expect(createResponse.status()).toBe(200);

        const createdBooking = (await createResponse.json()) as CreatedBooking;

        bookingId = createdBooking.bookingid;

        const updateResponse = await bookingClient.updateBooking(
          bookingId,
          updatedBooking,
          authToken,
        );

        expect(updateResponse.status()).toBe(200);
        expect(await updateResponse.json()).toEqual(updatedBooking);

        const getResponse = await bookingClient.getBookingById(bookingId);

        expect(getResponse.status()).toBe(200);
        const retrievedBooking: unknown = await getResponse.json();
        validateSchema(bookingSchema, retrievedBooking);
        expect(retrievedBooking).toEqual(updatedBooking);
      } finally {
        if (bookingId !== undefined) {
          const deleteResponse = await bookingClient.deleteBooking(
            bookingId,
            authToken,
          );

          expect(deleteResponse.status()).toBe(201);
        }
      }
    },
  );
  test(
    'authenticated user can partially update a booking',
    { tag: ['@booking', '@regression'] },
    async ({ bookingClient, authToken }) => {
      const originalBooking = buildBooking();

      const bookingChanges = {
        firstname: 'Sophia',
        totalprice: 325,
      };

      const expectedBooking = {
        ...originalBooking,
        ...bookingChanges,
      };

      let bookingId: number | undefined;

      try {
        const createResponse =
          await bookingClient.createBooking(originalBooking);

        expect(createResponse.status()).toBe(200);

        const createdBooking = (await createResponse.json()) as CreatedBooking;

        bookingId = createdBooking.bookingid;

        const patchResponse = await bookingClient.partiallyUpdateBooking(
          bookingId,
          bookingChanges,
          authToken,
        );

        expect(patchResponse.status()).toBe(200);
        expect(await patchResponse.json()).toEqual(expectedBooking);

        const getResponse = await bookingClient.getBookingById(bookingId);

        expect(getResponse.status()).toBe(200);
        const retrievedBooking: unknown = await getResponse.json();
        validateSchema(bookingSchema, retrievedBooking);
        expect(retrievedBooking).toEqual(expectedBooking);
      } finally {
        if (bookingId !== undefined) {
          const deleteResponse = await bookingClient.deleteBooking(
            bookingId,
            authToken,
          );

          expect(deleteResponse.status()).toBe(201);
        }
      }
    },
  );
  test(
    'booking cannot be updated with an invalid token',
    { tag: ['@booking', '@negative'] },
    async ({ bookingClient, authToken }) => {
      const originalBooking = buildBooking();
      const updatedBooking = buildBooking({
        firstname: 'Unauthorized',
      });

      let bookingId: number | undefined;

      try {
        const createResponse =
          await bookingClient.createBooking(originalBooking);

        expect(createResponse.status()).toBe(200);

        const createdBooking = (await createResponse.json()) as CreatedBooking;

        bookingId = createdBooking.bookingid;

        const updateResponse = await bookingClient.updateBooking(
          bookingId,
          updatedBooking,
          'invalid-token',
        );

        expect(updateResponse.status()).toBe(403);

        const getResponse = await bookingClient.getBookingById(bookingId);

        expect(getResponse.status()).toBe(200);
        expect(await getResponse.json()).toEqual(originalBooking);
      } finally {
        if (bookingId !== undefined) {
          const deleteResponse = await bookingClient.deleteBooking(
            bookingId,
            authToken,
          );

          expect(deleteResponse.status()).toBe(201);
        }
      }
    },
  );
  test(
    'user can filter bookings by customer name',
    { tag: ['@booking', '@regression'] },
    async ({ bookingClient, authToken }) => {
      const uniqueFirstname = `Auto${Date.now()}`;
      const lastname = 'FilterTester';

      const bookingData = buildBooking({
        firstname: uniqueFirstname,
        lastname,
      });

      let bookingId: number | undefined;

      try {
        const createResponse = await bookingClient.createBooking(bookingData);

        expect(createResponse.status()).toBe(200);

        const createdBooking = (await createResponse.json()) as CreatedBooking;

        bookingId = createdBooking.bookingid;

        const filterResponse = await bookingClient.getBookingsByName(
          uniqueFirstname,
          lastname,
        );

        expect(filterResponse.status()).toBe(200);

        const filteredBookings = (await filterResponse.json()) as BookingId[];

        expect(filteredBookings).toContainEqual({
          bookingid: bookingId,
        });
      } finally {
        if (bookingId !== undefined) {
          const deleteResponse = await bookingClient.deleteBooking(
            bookingId,
            authToken,
          );

          expect(deleteResponse.status()).toBe(201);
        }
      }
    },
  );
  test(
    'authenticated user can delete a booking',
    { tag: ['@booking', '@regression'] },
    async ({ bookingClient, authToken }) => {
      const bookingData = buildBooking();

      let bookingId: number | undefined;
      let deletionSucceeded = false;

      try {
        const createResponse = await bookingClient.createBooking(bookingData);

        expect(createResponse.status()).toBe(200);

        const createdBooking = (await createResponse.json()) as CreatedBooking;

        bookingId = createdBooking.bookingid;

        const deleteResponse = await bookingClient.deleteBooking(
          bookingId,
          authToken,
        );

        deletionSucceeded = deleteResponse.status() === 201;

        expect(deleteResponse.status()).toBe(201);

        const getResponse = await bookingClient.getBookingById(bookingId);

        expect(getResponse.status()).toBe(404);
      } finally {
        if (bookingId !== undefined && !deletionSucceeded) {
          await bookingClient.deleteBooking(bookingId, authToken);
        }
      }
    },
  );
});
