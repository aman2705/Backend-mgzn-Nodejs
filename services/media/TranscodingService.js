const AWS = require('aws-sdk');
require('dotenv').config();
const mediaConvert = new AWS.MediaConvert({ region: process.env.AWS_REGION });

const createMediaConvertJob = async (s3InputPath, s3OutputPath) => {
    const params = {
        Role: 'arn:aws:iam::637423643789:role/MediaConvertRole', // IAM role with proper permissions
        Settings: {
            OutputGroups: [{
                Name: 'HLS group',
                OutputGroupSettings: {
                    Type: 'HLS_GROUP_SETTINGS',
                    HlsGroupSettings: {
                        SegmentLength: 10,
                        Destination: s3OutputPath // Output to S3
                    }
                },
                Outputs: [
                    {
                        VideoDescription: {
                            Width: 1280,
                            Height: 720,
                            CodecSettings: {
                                Codec: 'H.264',
                                H264Settings: {
                                    MaxBitrate: 5000000,
                                    RateControlMode: 'CBR'
                                }
                            }
                        }
                    },
                    {
                        VideoDescription: {
                            Width: 640,
                            Height: 360,
                            CodecSettings: {
                                Codec: 'H.264',
                                H264Settings: {
                                    MaxBitrate: 1000000,
                                    RateControlMode: 'CBR'
                                }
                            }
                        }
                    }
                ]
            }]
        },
        Input: {
            FileInput: s3InputPath // Input video from S3
        }
    };

    return mediaConvert.createJob(params).promise();
};
module.exports={createMediaConvertJob}