const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const mediaConvert = new AWS.MediaConvert({
    endpoint: "https://xnbzilj6c.mediaconvert.ap-south-1.amazonaws.com",
    apiVersion: '2017-08-29'
});

// Function to convert the video URL to S3 URI
const convertToS3Uri = (url) => {
    const urlString = String(url);
    const withoutProtocol = urlString.replace(/^https:\/\//, '');
    const [bucketPart, ...filePathParts] = withoutProtocol.split('.s3.');
    if (!bucketPart || filePathParts.length === 0) {
        throw new Error('Invalid S3 URL format. Cannot extract bucket name and file path.');
    }
    const bucketName = bucketPart.split('.')[0];
    const filePath = filePathParts.join('').replace(/amazonaws\.com\//, '');

    let s3Uri = `s3://${bucketName}/${decodeURIComponent(filePath)}`;
    s3Uri = s3Uri.replace(/^s3:\/\/mgznstorage\/ap-south-1\./, 's3://mgznstorage/');
    return s3Uri;
};



const createMediaConvertJob = async (inputFilePath, roleArn) => {
    const s3Uri = convertToS3Uri(inputFilePath);

    const params = {
        Queue: "arn:aws:mediaconvert:ap-south-1:637423643789:queues/Default",
        Role: roleArn,
        Settings: {
            TimecodeConfig: {
                Source: "ZEROBASED"
            },
            OutputGroups: [
                {
                    Name: "Apple HLS",
                    Outputs: [
                        // 360p Output
                        {
                            ContainerSettings: {
                                Container: "M3U8",
                                M3u8Settings: {}
                            },
                            VideoDescription: {
                                Width: 640,
                                Height: 360,
                                CodecSettings: {
                                    Codec: "H_264",
                                    H264Settings: {
                                        MaxBitrate: 800000,  // Max bitrate for 360p
                                        RateControlMode: "QVBR",
                                        SceneChangeDetect: "TRANSITION_DETECTION"
                                    }
                                }
                            },
                            AudioDescriptions: [
                                {
                                    AudioSourceName: "Audio Selector 1",
                                    CodecSettings: {
                                        Codec: "AAC",
                                        AacSettings: {
                                            Bitrate: 96000,
                                            CodingMode: "CODING_MODE_2_0",
                                            SampleRate: 48000
                                        }
                                    }
                                }
                            ],
                            OutputSettings: {
                                HlsSettings: {}
                            },
                            NameModifier: "_360p"
                        },
                        // 480p Output
                        {
                            ContainerSettings: {
                                Container: "M3U8",
                                M3u8Settings: {}
                            },
                            VideoDescription: {
                                Width: 854,
                                Height: 480,
                                CodecSettings: {
                                    Codec: "H_264",
                                    H264Settings: {
                                        MaxBitrate: 1200000,  // Max bitrate for 480p
                                        RateControlMode: "QVBR",
                                        SceneChangeDetect: "TRANSITION_DETECTION"
                                    }
                                }
                            },
                            AudioDescriptions: [
                                {
                                    AudioSourceName: "Audio Selector 1",
                                    CodecSettings: {
                                        Codec: "AAC",
                                        AacSettings: {
                                            Bitrate: 96000,
                                            CodingMode: "CODING_MODE_2_0",
                                            SampleRate: 48000
                                        }
                                    }
                                }
                            ],
                            OutputSettings: {
                                HlsSettings: {}
                            },
                            NameModifier: "_480p"
                        },
                        // 720p Output
                        {
                            ContainerSettings: {
                                Container: "M3U8",
                                M3u8Settings: {}
                            },
                            VideoDescription: {
                                Width: 1280,
                                Height: 720,
                                CodecSettings: {
                                    Codec: "H_264",
                                    H264Settings: {
                                        MaxBitrate: 3000000,  // Max bitrate for 720p
                                        RateControlMode: "QVBR",
                                        SceneChangeDetect: "TRANSITION_DETECTION"
                                    }
                                }
                            },
                            AudioDescriptions: [
                                {
                                    AudioSourceName: "Audio Selector 1",
                                    CodecSettings: {
                                        Codec: "AAC",
                                        AacSettings: {
                                            Bitrate: 96000,
                                            CodingMode: "CODING_MODE_2_0",
                                            SampleRate: 48000
                                        }
                                    }
                                }
                            ],
                            OutputSettings: {
                                HlsSettings: {}
                            },
                            NameModifier: "_720p"
                        }
                    ],
                    OutputGroupSettings: {
                        Type: "HLS_GROUP_SETTINGS",
                        HlsGroupSettings: {
                            SegmentLength: 10,
                            Destination: "s3://mgzntranscode/",
                            MinSegmentLength: 0
                        }
                    }
                }
            ],
            FollowSource: 1,
            Inputs: [
                {
                    AudioSelectors: {
                        "Audio Selector 1": {
                            DefaultSelection: "DEFAULT"
                        }
                    },
                    VideoSelector: {},
                    TimecodeSource: "ZEROBASED",
                    FileInput: s3Uri // Input file from S3
                }
            ]
        },
        BillingTagsSource: "JOB",
        AccelerationSettings: {
            Mode: "DISABLED"
        },
        StatusUpdateInterval: "SECONDS_60",
        Priority: 0
    };

    try {
        const result = await mediaConvert.createJob(params).promise();
        console.log('MediaConvert Job Created:', result);
        return result;
    } catch (error) {
        console.error('Error creating MediaConvert Job:', error);
        throw error;
    }
};

module.exports = { createMediaConvertJob };
