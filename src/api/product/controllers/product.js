'use strict';

/**
 * product controller
 */

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::product.product',
  ({ strapi }) => ({
    async productStock(ctx) {
      try {
        const products = await strapi.db
          .query('api::product.product')
          .findMany({
            populate: {
              stockevents: true,
              imageUrl: true,
            },
          });
        const uniqueProducts = products.filter(
          (product, index, self) =>
            index ===
            self.findIndex((p) => p.documentId === product.documentId)
        );
        const result = uniqueProducts.map((product) => {
          const { totalEntries, totalExits, stock } =
            product.stockevents.reduce(
              (acc, event) => {
                if (event.type === 'add') {
                  acc.stock += event.qty;
                  acc.totalEntries += event.qty;
                } else if (['remove', 'sale'].includes(event.type)) {
                  acc.stock -= event.qty;
                  acc.totalExits += event.qty;
                }
                return acc;
              },
              { totalEntries: 0, totalExits: 0, stock: 0 }
            );
          return {
            id: product.id,
            documentId: product.documentId,
            name: product.name,
            price: product.price,
            totalEntries,
            totalExits,
            totalStock: stock,
            imageUrl: product.imageUrl?.url ?? null,
          };
        });
        return ctx.send({ data: result });
      } catch (error) {
        ctx.throw(
          500,
          `Error al obtener el stock de productos: ${error.message}`
        );
      }
    },
  })
);
