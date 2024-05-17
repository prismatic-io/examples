import snsActions from "../sns/actions";
import { headObject } from "./headObject";
import { headBucket } from "./headBucket";
import { listMultipartUploads } from "./listMultipartUploads";
import { deleteObjects } from "./deleteObjects";
import { deleteBucket } from "./deleteBucket";
import { putBucketNotificationConfiguration } from "./putBucketNotificationConfiguration";
import { getBucketNotificationConfiguration } from "./getBucketNotificationConfiguration";
import { putObjectLockConfiguration } from "./putObjectLockConfiguration";
import { getObjectLockConfiguration } from "./getObjectLockConfiguration";
import { putObjectRetention } from "./putObjectRetention";
import { getObjectRetention } from "./getObjectRetention";
import { getObjectAttributes } from "./getObjectAttributes";
import { listBuckets } from "./listBuckets";
import { copyObject } from "./copyObject";
import { deleteObject } from "./deleteObject";
import { getObject } from "./getObject";
import { listObjects } from "./listObjects";
import { createMultipartUpload } from "./createMultipartUpload";
import { abortMultipartUpload } from "./abortMultipartUpload";
import { completeMultipartUpload } from "./completeMultipartUpload";
import { listParts } from "./listParts";
import { generatePresignedForMultiparUploads } from "./generatePresignedForMultiparUploads";
import { generatePresignedUrl } from "./generatePresignedUrl";
import { getBucketLocation } from "./getBucketLocation";
import { getCurrentAccount } from "./getCurrentAccount";
import { putObject } from "./putObject";
import { uploadPart } from "./uploadPart";
import streamUploadActions from "./streamUpload";

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
