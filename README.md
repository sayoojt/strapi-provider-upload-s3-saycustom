# strapi-provider-upload-s3-saycustom

*Added isPublic and baseUrl options on top of the existing configurations.
*Added one more option - ACL to pass exact ACL access as a string. Please check [here](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html) for the list of access possible with ACL. Possible values are : private,  public-read, public-read-write, aws-exec-read, authenticated-read, bucket-owner-read, bucket-owner-full-control & log-delivery-write
*if #####isPublic is true, ACL will be set to ######public-read and by default its false it will be ######private.
*if both #####isPublic and ACL mentioned priority will be for ACL and if incorrect ACL added, it depends on how AWS throws error.
*Added #####isBaseUrlHttps for deciding if the URL is https, by default its http

i have used the below code,

###### \app\config\plugins.js (as per strapi documentation)
```
module.exports = ({ env }) => ({
    upload: {
        provider: 's3-saycustom',
        providerOptions: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_ACCESS_SECRET'),
            region: env('AWS_REGION'),
            baseUrl: env('STATIC_DOMAIN_NAME'),
            params: {
                Bucket: env('AWS_BUCKET_NAME'),
            },
            isPublic: env('AWS_IS_PUBLIC'),
            ACL: env('AWS_ACL')
        },
    },
});
```
###### .env file
```
AWS_ACCESS_KEY_ID='YOUR AWS ACCESS KEY'
AWS_ACCESS_SECRET='YORU AWS ACCESS SECRET'
AWS_REGION='us-east-1' //add your region
AWS_BUCKET_NAME='ADD YOUR BUCKET NAME'
STATIC_DOMAIN_NAME='addyourdomain.com'//Add your domain or CDN, if this is not set it will use AWS S3 url by default.
//AWS_IS_PUBLIC=true //add this to true if you want to make your file publicly available. //commented this in my code as am using ACL option and priority will be for the ACL option.
AWS_ACL= 'public-read' //if you are totally clueless and not sure how to set this then use AWS_IS_PUBLIC to true dont worry about anything else.
```

Few tips to note when you are implementing this,
- Bucket has to be public.
- Added bucket policy to not to make it directly accessible, added AWS OAI policy.
```
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity XXXXXXXXX"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::BUCKETNAME/*"
        }
    ]
}
```
- Created CDN in AWS for better performance.
- We can also create custom domain in R53 or outside domain provider using CNAME entry and map into S3 endpoint.
