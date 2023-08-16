import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from './secrets.ts'
import AWS from 'aws-sdk'

export const COVER_PATH: string = 'cover/'
export const STORY_BANNER_PATH: string = 'banner/'

export const AWS_S3_REGION: string = 'us-east-1'

export const sendToS3 = async (bucketName: string, key: string, body: File) => {
    const accessKeyId: string = ACCESS_KEY_ID
    const secretAccessKey: string = SECRET_ACCESS_KEY
    const region: string = AWS_S3_REGION
    try {
        const s3 = new AWS.S3({
            accessKeyId,
            secretAccessKey,
            region,
            signatureVersion: 'v4',
        })

        const params = {
            Bucket: bucketName,
            Key: key,
            Body: body,
        }

        await s3.upload(params).promise()
    } catch (error) {
        console.error('Error uploading file:', error)
        alert('Failed to upload images. Please try again later.')
    }
}
