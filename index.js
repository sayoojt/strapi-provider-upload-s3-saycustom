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
        if (!config.baseUrl || config.baseUrl == "") config.baseUrl = config.isPublic ? 'public-read' : 'private';
        return {
            upload(file) {
                return new Promise((resolve, reject) => {
                    const objectKey = `${file.hash}${file.ext}`;
                    s3.upload(Object.assign({
                        Key: objectKey,
                        Body: new Buffer(file.buffer, 'binary'),
                        ContentType: file.mime,
                    }, { ACL: config.ACL ? config.ACL : 'private' }, (err, data) => {
                        if (err)
                            return reject(err);
                        if (config.baseUrl) {
                            file.url = `${config.baseUrl}/${objectKey}`;
                        } else {
                            file.url = data.Location
                        }
                        resolve();
                    }));
                });
            },
            delete(file) {
                return new Promise((resolve, reject) => {
                    s3.deleteObject({
                        Key: `${file.hash}${file.ext}`,
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
