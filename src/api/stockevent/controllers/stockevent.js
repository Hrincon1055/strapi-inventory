'use strict';

/**
 * stockevent controller
 */

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::stockevent.stockevent',
  ({ strapi }) => ({
    async stockProduct(ctx) {
      const stockevents = await strapi.db
        .query('api::stockevent.stockevent')
        .findMany({});
    },
  })
);
