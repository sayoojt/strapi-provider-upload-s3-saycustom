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
        if (!config.ACL || config.baseACLUrl == "") config.ACL = config.isPublic ? 'public-read' : 'private';
        return {
            upload(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    const objectKey = `${file.hash}${file.ext}`;
                    s3.upload({
                        //ACL: config.ACL ? config.ACL : 'private',
                        ...customParams,
                        Key: objectKey,
                        Body: Buffer.from(file.buffer, 'binary'),
                        ContentType: file.mime,
                    }, (err, data) => {
                        if (err)
                            return reject(err);
                        if (config.baseUrl) {
                            file.url = `${config.baseUrl}/${objectKey}`;
                        } else {
                            file.url = data.Location
                        }
                        resolve();
                    });
                });
            },
            delete(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    s3.deleteObject({
                        Key: `${file.hash}${file.ext}`,
                        ...customParams,
                    }, (err, data) => {
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
