import type { JSONSchemaType } from 'ajv';
import type { Booking } from '../models/booking.types.js';

export const bookingSchema: JSONSchemaType<Booking> = {
  type: 'object',
  properties: {
    firstname: {
      type: 'string',
    },
    lastname: {
      type: 'string',
    },
    totalprice: {
      type: 'number',
    },
    depositpaid: {
      type: 'boolean',
    },
    bookingdates: {
      type: 'object',
      properties: {
        checkin: {
          type: 'string',
          format: 'date',
        },
        checkout: {
          type: 'string',
          format: 'date',
        },
      },
      required: ['checkin', 'checkout'],
      additionalProperties: false,
    },
    additionalneeds: {
      type: 'string',
    },
  },
  required: [
    'firstname',
    'lastname',
    'totalprice',
    'depositpaid',
    'bookingdates',
    'additionalneeds',
  ],
  additionalProperties: false,
};
