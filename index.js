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
                    // upload file on S3 bucket                    
                    const objectKey = `${file.hash}${file.ext}`;
                    s3.upload(Object.assign({
                        Key: objectKey,
                        Body: new Buffer(file.buffer, 'binary'),
                        ACL: config.ACL ? config.ACL : 'private', // don't use this
                        ContentType: file.mime,
                    }, (err, data) => {
                        if (err)
                            return reject(err);
                        // set the file url to the CDN instead of the bucket itself
                        //file.url = `http://${config.baseUrl}/${objectKey}`;
                        if (config.baseUrl) {
                            file.url = `${config.baseUrl}/${objectKey}`;
                        } else {
                            file.url = data.Location // current behavior
                        }
                        resolve();
                    });
                });
            },
            delete(file) {
                return new Promise((resolve, reject) => {
                    // delete file on S3 bucket
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
