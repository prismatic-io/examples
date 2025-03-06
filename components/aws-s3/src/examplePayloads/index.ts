import {
  AbortMultipartUploadCommandOutput,
  Bucket,
  CompleteMultipartUploadCommandOutput,
  CopyObjectOutput,
  CreateMultipartUploadCommandOutput,
  DeleteBucketCommandOutput,
  DeleteObjectOutput,
  DeleteObjectsCommandOutput,
  GetBucketNotificationConfigurationCommandOutput,
  GetObjectAttributesCommandOutput,
  GetObjectLockConfigurationCommandOutput,
  GetObjectRetentionCommandOutput,
  HeadBucketCommandOutput,
  HeadObjectCommandOutput,
  ListMultipartUploadsCommandOutput,
  ListPartsCommandOutput,
  PutBucketNotificationConfigurationCommandOutput,
  PutObjectLockConfigurationCommandOutput,
  PutObjectOutput,
  PutObjectRetentionCommandOutput,
} from "@aws-sdk/client-s3";
import {
  CreateTopicResponse,
  SetTopicAttributesCommandOutput,
  SubscribeResponse,
  UnsubscribeCommandOutput,
} from "@aws-sdk/client-sns";
import { GetCallerIdentityCommandOutput } from "@aws-sdk/client-sts";
import { UploadPartPayload } from "../types/UploadPartPayload";

export const headObjectPayload: { data: HeadObjectCommandOutput } = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "2GNCNQ9QYJF91H2H3",
      extendedRequestId:
        "20td2yhMFyFEFYm7Wh+P+qr8DDva152du5KA+JFU7ZRuHWLFZZxdLCOVfnMF41K2BYQ/12345=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    AcceptRanges: "bytes",
    LastModified: new Date("2021-08-25T20:00:00.000Z"),
    ContentLength: 65338,
    ETag: '"266b7131485849fcefe583dcce654321"',
    ContentType: "image/jpeg",
    ServerSideEncryption: "AES256",
    Metadata: {},
  },
};

export const headBucketPayload: { data: HeadBucketCommandOutput } = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "A6R8PTRGRVGVB123",
      extendedRequestId:
        "O1lqC0pMNa1+juScFrJbqgtJDQgkqvkcWDvLPfmcZBQNbxe+Bl4JE0WeIuswg/123456==",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
  },
};

export const listMultipartUploadsPayload: {
  data: ListMultipartUploadsCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "MSB2RAFETTBCQ123",
      extendedRequestId: "Ax6cjVx4lugZGOI+yo3dApqbvrtLD3U",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    Bucket: "some-bucket",
    IsTruncated: false,
    KeyMarker: "",
    MaxUploads: 1000,
    NextKeyMarker: "file.txt",
    NextUploadIdMarker: "itQ2Dw8eMZ01dGiwRIj2dwDqpx",
    UploadIdMarker: "",
    Uploads: [
      {
        UploadId: "hbZQmDNtym9xtdh8XwgT7Ys..FkRWJfV0MUgmNWg",
        Key: "new_file.txt",
        Initiated: new Date("2024-01-25T16:06:31.000Z"),
        StorageClass: "STANDARD",
        Owner: {
          ID: "0edc4b00d",
        },
        Initiator: {
          ID: "0edc4b00d",
        },
      },
    ],
  },
};

export const deleteObjectsPayload: { data: DeleteObjectsCommandOutput } = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "FAQAVT",
      extendedRequestId: "T/nk6UtPuVs11K6ji59C8phr==",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    Deleted: [
      {
        Key: "file.csv",
      },
      {
        Key: "audio.mp3",
      },
    ],
  },
};

export const deleteBucketPayload: { data: DeleteBucketCommandOutput } = {
  data: {
    $metadata: {
      httpStatusCode: 204,
      requestId: "CBD415E7",
      extendedRequestId:
        "WXvHrStedS7jFJZVw0Pt1LH3K3Nn99XFGuyELkK7UQANs3IOHs9GsR=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
  },
};

export const putBucketNotificationConfigurationPayload: {
  data: PutBucketNotificationConfigurationCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "3G6FNXP71KGVQ",
      extendedRequestId:
        "epeRYyT9tl3QOMTMck4AG+NqmGa5fRKv5nME7gRl8KMxfnCAKWZzKbWVKp4ED7RaZIGvVcS=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
  },
};

export const getBucketNotificationConfigurationPayload: {
  data: GetBucketNotificationConfigurationCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "2KMYXFM4GHPES",
      extendedRequestId:
        "dLu9EloFaZ2UeACk5l4IovjfHXHTkM7kFLdThrbIJIjn05dgO7bdU3TUJ7/8DzZvcQ==",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    LambdaFunctionConfigurations: [
      {
        Id: "Lambda",
        LambdaFunctionArn: "arn:aws:lambda:us-east-2:1234:function:Function",
        Events: ["s3:ObjectRemoved:*"],
      },
    ],
    QueueConfigurations: [
      {
        Id: "Queue",
        QueueArn: "arn:aws:sqs:us-east-2:1234:Queue",
        Events: ["s3:ObjectCreated:*"],
      },
    ],
    TopicConfigurations: [
      {
        Id: "Topic",
        TopicArn: "arn:aws:sns:us-east-2:1234:Topic",
        Events: ["s3:ObjectRestore:*"],
      },
    ],
  },
};

export const putObjectLockConfigurationPayload: {
  data: PutObjectLockConfigurationCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "HRTN",
      extendedRequestId: "n2j6gnXOgOKm+PomoHrLsbOhatc7LMw1Su",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
  },
};

export const getObjectLockConfigurationPayload: {
  data: GetObjectLockConfigurationCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "J58R459KF4NH",
      extendedRequestId:
        "YLfHsBUyeXU06tYjF7ZLX7f7JhBL1FFZhA/UZKUr4WNTy0OHDOjYN=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    ObjectLockConfiguration: {
      ObjectLockEnabled: "Enabled",
      Rule: {
        DefaultRetention: {
          Mode: "GOVERNANCE",
          Years: 2,
        },
      },
    },
  },
};

export const putObjectRetentionPayload: {
  data: PutObjectRetentionCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "9GKTJZDRMJCGMNY6",
      extendedRequestId:
        "NKjiPDGEYKYtH7sHPWKSVpy9y9NtjbXzeJ7whq75y62jiH9JLuZOpMLCBiYyc+/hOlnOTCaTpWo=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
  },
};

export const getObjectRetentionPayload: {
  data: GetObjectRetentionCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "88W3KJSMC9E",
      extendedRequestId: "aJ3Rpb+v2F6Fqy47J6fWoPPCqe+LC8UX8vo5x3KK/YhN/=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    Retention: {
      Mode: "COMPLIANCE",
      RetainUntilDate: new Date("2024-08-25T20:00:00.000Z"),
    },
  },
};

export const getObjectAttributesPayload: {
  data: GetObjectAttributesCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "0AJN29JBC3D5BNB6",
      extendedRequestId:
        "sVW4/xKq7DkMI8kgvbJUNWbzzZ9H6GKqyVocDm3uE4y7dZ6GmZcFrIC9MPGDjSNXMMn8CtLO8Vy0SxOcNOwl2A==",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    LastModified: new Date("2024-03-08T22:20:41.000Z"),
    VersionId: "0Ec_RdbYOEQ1Un2HllBJbGG758RS3UuZ",
    ObjectSize: 515400,
  },
};

export const listBucketsPayload: { data: Bucket[] } = {
  data: [
    {
      Name: "bucket-1",
      CreationDate: new Date("2024-03-08T23:30:22.000Z"),
    },
  ],
};

export const copyObjectPayload: { data: CopyObjectOutput } = {
  data: {
    CopyObjectResult: { ETag: "Example", LastModified: new Date("2020-01-01") },
  },
};

export const deleteObjectPayload: { data: DeleteObjectOutput } = {
  data: {
    DeleteMarker: true,
    VersionId:
      "3/L4kqtJlcpXroDTDmJ+rmSpXd3dIbrHY+MTRCxf3vjVBH40Nr8X8gdRQBpUMLUo",
    RequestCharged: "requester",
  },
};

export const getObjectPayload = {
  data: Buffer.from("Example File Contents"),
  contentType: "application/octet",
};

export const listObjectsPayload: { data: string[] } = {
  data: ["Example Item 1", "Example Item 2", "Example Item 3"],
};

export const putObjectPayload: { data: PutObjectOutput } = {
  data: { ETag: "Example Tag", VersionId: "Example Version Id" },
};

export const generatePresignedUrlPayload: { data: string } = {
  data: "https://my-bucket.s3.us-east-2.amazonaws.com/my-file.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256...",
};

export const generatePresignedForMultiparUploadsPayload: {
  data: { url: string; partNumber: number }[];
} = {
  data: [
    {
      url: "https://my-bucket.s3.us-east-2.amazonaws.com/my-file.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256...",
      partNumber: 1,
    },
  ],
};

export const getBucketLocationPayload: { data: string } = { data: "us-east-1" };

export const getCurrentAccountPayload: {
  data: GetCallerIdentityCommandOutput;
} = {
  data: {
    $metadata: {},
    Account: "123456789012",
    Arn: "arn:aws:iam::123456789012:user/Alice",
    UserId: "ABCDEFGHIJKLMNOP:ABCDEFGHIJKLMNOP",
  },
};

export const createTopicPayload: {
  data: CreateTopicResponse;
} = {
  data: {
    TopicArn: "arn:aws:Example Topic Arn",
  },
};

export const subscribeToTopicPayload: {
  data: SubscribeResponse;
} = {
  data: {
    SubscriptionArn:
      "arn:aws:sns:us-east-2:123456789012:MyExampleTopic:00000000-00000000-00000000-00000000",
  },
};

export const createMultipartUploadPayload: {
  data: CreateMultipartUploadCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "J4Q9AY99DPMR1234",
      extendedRequestId:
        "P59zKeH2C4Jz3VAC1I+12345Gty4d4gyl9JYQmc4udM6bCB6w/MEg8AKKWUuBH1x0EU2dufwkw=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    ServerSideEncryption: "AES256",
    Bucket: "bucket-name",
    Key: "file.txt",
    UploadId:
      "9DWJzLdFIcK05G2Yq.TNhJbCU57dDZyIRlO_tHcdFgYqWQgtu6XdASs7h.DJlcWk2M9vmEx72gXcS8q5SBu_12345ccg-",
  },
};

export const abortMultipartUploadPayload: {
  data: AbortMultipartUploadCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 204,
      requestId: "DZ1ZJB3H2JB1234",
      extendedRequestId:
        "0D9BDVoAGoHqu3dIW4WHmaO4kkiWecrbf0yLRMe/JmUfX7N/12345=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
  },
};

export const updateTopicPolicyPayload: {
  data: SetTopicAttributesCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "b81eb768-e79a-52a1-9be8-e90175212345",
      extendedRequestId: null,
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
  },
};

export const bucketEventTriggerConfigurationPayload: {
  data: PutBucketNotificationConfigurationCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "73B4K590MABCMWV",
      extendedRequestId:
        "AHYlhdFxyrlbc3otaMb/gcjlmDEY+UT3xt7Vz6ZQ8F4B1234GZQSGN7D6yDV7mEC+U/1xU0pKc=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
  },
};

export const unsubscribeFromTopicPayload: { data: UnsubscribeCommandOutput } = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "059f8a07-f312-5e3b-9b7c-d46e66ee8a58",
      extendedRequestId: null,
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
  },
};

export const uploadPartPayload: { data: UploadPartPayload } = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "3Z9FSV3QYRYCK123",
      extendedRequestId:
        "nhNCxtYGnVN+nxfdPaCPgAc23cJw2rphbIU1Z5ZUEmUDXIvF+Ra3eUXv2MNdOoWTIKXEym12345=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    ServerSideEncryption: "AES256",
    ETag: '"266b7131485849fcefe583dcce071234"',
    part: {
      ETag: '"266b7131485849fcefe583dcce071234"',
      PartNumber: 1,
    },
  },
};

export const listPartsPayload: { data: ListPartsCommandOutput } = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "3Z9CNHKT01WVE123",
      extendedRequestId: "AYcUJyiexeUBBf5Uynsj4m1PojM18tHSxlyKMWzjM+123456=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    Bucket: "bucket-name",
    Initiator: {
      ID: "0edc4b00d1bfae1ebe33617c5cfe04e17b6f1fb9c5c2c55796123456",
    },
    IsTruncated: false,
    Key: "image.jpg",
    MaxParts: 1000,
    NextPartNumberMarker: "1",
    Owner: {
      ID: "0edc4b00d1bfae1ebe33617c5cfe04e17b6f1fb9c5c2c55796123456",
    },
    PartNumberMarker: "0",
    Parts: [
      {
        PartNumber: 1,
        LastModified: new Date("2024-03-11T23:47:51.000Z"),
        ETag: '"266b7131485849fcefe583dcce071234"',
        Size: 65338,
      },
    ],
    StorageClass: "STANDARD",
    UploadId:
      "iHtFwRT6d6IAPwGTlT6tO1iBApulQGCA2sG7yn_BzUKItrnLrWykCbDheQBJrb1MUGHgGfihOY07XfnCeU2CWCZM0kD6VbyC46MJ4123456-",
  },
};

export const completeMultipartUploadPayload: {
  data: CompleteMultipartUploadCommandOutput;
} = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "GD4Y1XMZ6MFV1234",
      extendedRequestId:
        "Ego8CAUdYnt2THhZmBLnbfmTPY0HR8zA9rEMkSg+OB0t/uldGkuBlI6UF9X+123456=",
      cfId: null,
      attempts: 1,
      totalRetryDelay: 0,
    },
    ServerSideEncryption: "AES256",
    Bucket: "bucket-name",
    ETag: '"d96cf49f8c439501eb19c4728712345-1"',
    Key: "image.jpg",
    Location: "https://bucketname.s3.us-east-2.amazonaws.com/image.jpg",
  },
};
