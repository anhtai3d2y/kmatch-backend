/**
 * @param a
 */
import { formatRelative } from 'date-fns';

export const uuid = (a = ''): string =>
  a
    ? /* eslint-disable no-bitwise */
      ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, uuid);

export const realTimeVn = (time: Date) => {
  return new Date(time.getTime() + 7 * 60 * 60 * 1000);
};

export const formatDate = (date: Date) => {
  let formatedDate = '';
  if (date) {
    const messageDate = realTimeVn(date);
    const nowDate = realTimeVn(new Date());
    formatedDate = formatRelative(messageDate, nowDate);
    formatedDate = formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
  }
  return formatedDate;
};

export const calculateAge = (birthday: string) => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(birthday.split('/')[0]);
  return age;
};

export async function getGoogleSignedUrl(fileName: string) {
  if (fileName) {
    // don't create signed key for public file
    if (fileName.includes('https://')) {
      return fileName;
    }
    const storage = new Storage();
    const bucketName = process.env.GCS_BUCKET_NAME || 'kmatch_storage';
    // const publicUrl = process.env.GCS_URI;
    // fileName = fileName.replace(`${publicUrl}${bucketName}/`, '');
    const options: any = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 6 * 24 * 60 * 60 * 1000, //  6 days
    };
    // Get a v4 signed URL for reading the file
    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    return url;
  }
  return null;
}
