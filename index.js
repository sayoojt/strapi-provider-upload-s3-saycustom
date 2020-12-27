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
        const S3 = new AWS.S3({
            apiVersion: '2006-03-01',
            ...config,
        });

        return {
            upload(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    // upload file on S3 bucket
                    const path = file.path ? `${file.path}/` : '';
                    const objectKey = `${path}${file.hash}${file.ext}`;
                    S3.upload(Object.assign({
                        Key: objectKey,
                        Body: Buffer.from(file.buffer, 'binary'),
                        ContentType: file.mime,
                        ...customParams,
                    }, config.isPublic ? { ACL: 'public-read' } : {}), (err, data) => {
                        if (err) {
                            return reject(err);
                        }

                        // set the bucket file url
                        file.url = `${config.baseUrl}/${objectKey}`;

                        resolve();
                    });
                });
            },
            delete(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    // delete file on S3 bucket
                    const path = file.path ? `${file.path}/` : '';
                    S3.deleteObject(
                        {
                            Key: `${path}${file.hash}${file.ext}`,
                            ...customParams,
                        },
                        (err, data) => {
                            if (err) {
                                return reject(err);
                            }

                            resolve();
                        }
                    );
                });
            },
        };
    },
};
