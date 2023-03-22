const aws = require("aws-sdk")
const crypto = require("crypto")
const { promisify } = require("util")
const randomBytes = promisify(crypto.randomBytes)
require("dotenv").config();

const region = "ap-south-1"
const bucketName = "restaurant-api-image-upload"
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Bucket = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4"
})


const getImageURL = async (base64Image, folderName) => {
    const rawBytes = crypto.randomBytes(16)
    const imageName = rawBytes.toString("hex")

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const params = {
        Bucket: bucketName,
        Key: `${folderName}/${imageName}`,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'image/png'
    };

    try {
        const data = await new Promise((resolve, reject) => {
            s3Bucket.upload(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        const url = data.Location;
        return url;
    } catch (err) {
        throw err;
    }
}

const deleteImageFromURL = async (url) => {
    const urlSplit = url.split('/');
    const bucketArray = urlSplit[2];
    const bucketName = bucketArray.split(".")[0]
    const objectKey = decodeURIComponent(urlSplit[3]+"/"+urlSplit[4]);

    console.log(objectKey)

    const params = {
        Bucket: bucketName,
        Key: objectKey
    };

    try {
        const data = await new Promise((resolve, reject) => {
            s3Bucket.deleteObject(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        });
        return data
    } catch (err) {
        console.log(err)
        throw err;
    }

}

module.exports.s3 = s3Bucket
module.exports.getImageURL = getImageURL
module.exports.deleteImageFromURL = deleteImageFromURL