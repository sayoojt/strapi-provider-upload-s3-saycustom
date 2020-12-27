'use strict';

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require('lodash');
const AWS = require('aws-sdk');

module.exports = {
    init(config) {
        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            ...config,
        });

        return {
            upload(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    // upload file on S3 bucket                    
                    const objectKey = `${file.hash}${file.ext}`;
                    s3.upload({
                        Key: objectKey,
                        Body: Buffer.from(file.buffer, 'binary'),
                        // ACL: 'public-read', // don't use this
                        ContentType: file.mime,
                        Bucket,
                        ...customParams,
                    }, (err, data) => {
                        if (err)
                            return reject(err);
                        // set the file url to the CDN instead of the bucket itself
                        file.url = `http://${config.baseUrl}/${objectKey}`;
                        resolve();
                    });
                });
            },
            delete(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    // delete file on S3 bucket
                    s3.deleteObject({
                        Key: `${file.hash}${file.ext}`,
                        ...customParams,
                    },
                        (err, data) => {
                            if (err) {
                                return reject(err);
                            }

                            resolve();
                        });
                });
            },
        };
    },
};
