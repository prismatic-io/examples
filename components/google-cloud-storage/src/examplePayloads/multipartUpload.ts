export const createMultipartUploadPayloadExample = {
  results: {
    InitiateMultipartUploadResult: {
      Bucket: {
        _text: "bucketName",
      },
      Key: {
        _text: "your-image.png",
      },
      UploadId: {
        _text:
          "ABPnzm5uCe3g2XLS5kkxHPDZYrE68x87DhmcnJM1kKZ8ECXTtWCtJYHATzeych__ZDfWWN8",
      },
    },
  },
};

export const uploadPartPayloadExample = {
  PartNumber: 1,
  ETag: "5fbd6b4faa5393f343d276457f3f7d9f",
};

export const completeMultipartUploadPayloadExample = {
  results: {
    CompleteMultipartUploadResult: {
      Location: {
        _text: "http://storage.googleapis.com/test/test-image.png",
      },
      Bucket: {
        _text: "test",
      },
      Key: {
        _text: "test-image",
      },
      ETag: {
        _text: '"f15d9a861dedbc078f1f53a90f9b429c-1"',
      },
    },
  },
};
