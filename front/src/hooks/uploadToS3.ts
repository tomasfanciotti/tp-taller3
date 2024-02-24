import { useMutation, useQueryClient } from 'react-query';

type S3UploadMutationData = {
  file: File;
  fileName: string;
};

type S3UploadMutationResponse = string;

const uploadFileToS3 = async (file: File, bucketName: string, fileName: string): Promise<string> => {
  const url = `https://s3.us-east-2.amazonaws.com/${bucketName}/${fileName}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to S3');
  }

  return url;
};

export const useS3UploadMutation = (bucketName: string, queriesToInvalidate: string[] = []) => {
  const queryClient = useQueryClient();

  const s3UploadMutation = useMutation<S3UploadMutationResponse, Error, S3UploadMutationData>(async (data) => {
    return uploadFileToS3(data.file, bucketName, data.fileName);
  }, {
    onSettled: async () => {
      if (queriesToInvalidate.length > 0) {
        await queryClient.invalidateQueries(queriesToInvalidate);
      }
    },
  });

  return s3UploadMutation;
};
