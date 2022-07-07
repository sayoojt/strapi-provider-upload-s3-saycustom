'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
});
let s3 = new AWS.S3();
//  "path": "/asset/:type/:id",
module.exports = {
    getAssetByTypenId: async ctx => {
        const { id, type } = ctx.params;
        let asset = '';
        switch (type) {
            case 'football':
                asset = await strapi.query('football-image').findOne({ id });
                break;
            /* Image type if you want to add, otherwise implement a normal controller /asset/:id
              case 'cricket':
                asset = await strapi.query('cricket-image').findOne({ id });
                break;*/
        }
        if (asset == "") return "Not Found";
        const iKey = asset ? asset.image.hash + asset.image.ext : "";
        console.log(iKey);
        const image = await s3.getObject(
            {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: iKey
            }

        ).promise().then((img) => {
            ctx.response.set('content-type', img.ContentType);
            ctx.response.body = img.Body;
        }).catch((e) => {
            ctx.response.body = "Not Found";
        });

    },
    getAsset: async ctx => {
        const { name } = ctx.params;
        const iKey = name;
        const image = await s3.getObject(
            {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: iKey
            }

        ).promise().then((img) => {
            ctx.response.set('content-type', img.ContentType);
            ctx.response.body = img.Body;
        }).catch((e) => {
            ctx.response.body = "Not Found";
        });
    },
};
