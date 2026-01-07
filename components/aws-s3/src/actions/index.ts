import snsActions from "../sns/actions";
import { abortMultipartUpload } from "./abortMultipartUpload";
import { completeMultipartUpload } from "./completeMultipartUpload";
import { copyObject } from "./copyObject";
import { createMultipartUpload } from "./createMultipartUpload";
import { deleteBucket } from "./deleteBucket";
import { deleteObject } from "./deleteObject";
import { deleteObjects } from "./deleteObjects";
import { generatePresignedForMultiparUploads } from "./generatePresignedForMultiparUploads";
import { generatePresignedUrl } from "./generatePresignedUrl";
import { getBucketLocation } from "./getBucketLocation";
import { getBucketNotificationConfiguration } from "./getBucketNotificationConfiguration";
import { getCurrentAccount } from "./getCurrentAccount";
import { getObject } from "./getObject";
import { getObjectAttributes } from "./getObjectAttributes";
import { getObjectLockConfiguration } from "./getObjectLockConfiguration";
import { getObjectRetention } from "./getObjectRetention";
import { headBucket } from "./headBucket";
import { headObject } from "./headObject";
import { listBuckets } from "./listBuckets";
import { listMultipartUploads } from "./listMultipartUploads";
import { listObjects } from "./listObjects";
import { listParts } from "./listParts";
import { putBucketNotificationConfiguration } from "./putBucketNotificationConfiguration";
import { putObject } from "./putObject";
import { putObjectLockConfiguration } from "./putObjectLockConfiguration";
import { putObjectRetention } from "./putObjectRetention";
import streamUploadActions from "./streamUpload";
import { uploadPart } from "./uploadPart";

export const actions = {
  copyObject,
  deleteObject,
  getObject,
  listObjects,
  putObject,
  generatePresignedUrl,
  ...snsActions,
  createMultipartUpload,
  uploadPart,
  completeMultipartUpload,
  abortMultipartUpload,
  listBuckets,
  listParts,
  getBucketLocation,
  getCurrentAccount,
  generatePresignedForMultiparUploads,
  headObject,
  headBucket,
  listMultipartUploads,
  deleteObjects,
  deleteBucket,
  putBucketNotificationConfiguration,
  getBucketNotificationConfiguration,
  putObjectLockConfiguration,
  getObjectLockConfiguration,
  putObjectRetention,
  getObjectRetention,
  getObjectAttributes,
  ...streamUploadActions,
};
