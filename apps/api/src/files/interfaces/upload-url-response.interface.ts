export type UploadUrlResponse = {
  uploadUrl: string;
  s3Key: string;
  method: 'PUT';
  headers: {
    'Content-Type': string;
  };
};
