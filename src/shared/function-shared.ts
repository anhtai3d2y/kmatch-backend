/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HttpException, HttpStatus } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Downloader = require('nodejs-file-downloader');
export function stringToJson(data: string) {
  if (!JSON.parse(data))
    throw new HttpException(
      {
        error: 'IS_NOT_VALID',
        message: `common.IS_NOT_VALID`,
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      404,
    );

  return JSON.parse(data);
}

export function sortByObjectString(data) {
  if (data.sortBy) {
    return { $sort: stringToJson(data.sortBy) };
  }
  return { $sort: { createdAt: -1 } };
}

/**
 * @param date ngày ban đầu
 * @param days số ngày kể từ ngày ban đầu
 * @returns trả về ngày tiếp theo @param days kể từ ngày @param date
 */
export function caculateDates(date: string, days: any) {
  const arr_date = date.split('/');
  const newDay = Number(arr_date[2]) + days;
  const newDate = arr_date[0] + '/' + arr_date[1] + '/' + newDay;
  return newDate;
}

// Format param day = yyyy/mm/dd
export function startOneDay(day) {
  return new Date(day.replace('/', '-'));
}

// Format param day = yyyy/mm/dd
export function endOneDay(day) {
  return new Date(
    new Date(day.replace('/', '-')).getTime() + 24 * 60 * 60 * 1000,
  );
}

// change time = new Date()  to yyyy/mm/dd
export function getDateTime(time) {
  return `${time.getFullYear()}/${('0' + (time.getMonth() + 1)).slice(-2)}/${(
    '0' + time.getDate()
  ).slice(-2)}`;
}

// case insensitive search
export function caseInsensitiveSearch(text) {
  const textRegex = RegExp(text);
  return { $regex: textRegex, $options: 'i' };
}

// time in timezone VN
export function realTimeVn(time: Date) {
  return new Date(time.getTime() + 7 * 60 * 60 * 1000);
}

/**
 *
 * @param time string iso time example: "2021-10-28T18:13:21.278Z"
 * @returns string iso GTM +7
 */
export function getISOTimeVN(time: string) {
  return new Date(new Date(time).getTime() + 7 * 60 * 60 * 1000).toISOString();
}

// function to make arrange string
export function shuffle(array) {
  const arr_out: any = [...array];
  let currentIndex = arr_out.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arr_out[currentIndex];
    arr_out[currentIndex] = arr_out[randomIndex];
    arr_out[randomIndex] = temporaryValue;
  }
  if (JSON.stringify(array) === JSON.stringify(arr_out))
    return shuffle(arr_out);
  return arr_out;
}

export function unwindPre(path: string) {
  return {
    $unwind: {
      path: path,
      preserveNullAndEmptyArrays: true,
    },
  };
}
//translate function

// generate color
export function colorGenerator() {
  // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  // if (randomColor[0].toLocaleLowerCase() === 'f') return colorGenerator();
  // return '#' + randomColor;
  const colors = [
    '#5BB8FD',
    '#F07382',
    '#FFF000',
    '#E2654C',
    '#F99B28',
    '#8CD16E',
    '#DF82DB',
    '#81CCBF',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export async function htmlToBuffer(
  imageContent: string,
  fontsize: number,
): Promise<string | void | Buffer> {
  const html = `<html>
  <head>
     <style>
     /* vietnamese */
     @font-face {
     font-family: 'Quicksand';
     font-style: normal;
     font-weight: 600;
     font-display: swap;
     src: url(https://fonts.gstatic.com/s/quicksand/v24/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkCEv58m-wi40.woff2) format('woff2');
     unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
     }
     /* latin-ext */
     @font-face {
     font-family: 'Quicksand';
     font-style: normal;
     font-weight: 600;
     font-display: swap;
     src: url(https://fonts.gstatic.com/s/quicksand/v24/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkCEv58i-wi40.woff2) format('woff2');
     unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
     }
     /* latin */
     @font-face {
     font-family: 'Quicksand';
     font-style: normal;
     font-weight: 600;
     font-display: swap;
     src: url(https://fonts.gstatic.com/s/quicksand/v24/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkCEv58a-wg.woff2) format('woff2');
     unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
     }
     body {
      padding: '0 10px';
      fontWeight: '600';
      width: 622;
      height: 350;
      background-color: ${colorGenerator()};
      color: black;
      font-size: ${fontsize}px;
      display: grid;
      align-items: center;
      justify-content: center;
      place-items: center;
      font-family: 'Quicksand', sans-serif ;
    }
    div{
      text-align: center;
    }
    </style>
  </head>
  <body><div> ${imageContent}<div> </body>
</html>`;
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  await page.setContent(html);

  const content = await page.$('body');
  const imageBuffer = await content.screenshot({ omitBackground: true });
  await browser.close();
  return imageBuffer;
}

export function regexUrl(url: string) {
  const expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  const regex = new RegExp(expression);
  if (url.match(regex)) return true;
  return false;
}

/**
 * @param fileName is file locate in storage
 * @returns session url read only
 */
export async function getGoogleSignedUrl(fileName: string) {
  if (fileName) {
    // don't create signed key for public file
    if (fileName.includes('https://')) {
      return fileName;
    }
    const storage = new Storage();
    const bucketName = process.env.GCS_BUCKET_NAME || 'vsea_storage';
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
// check file existed in storage
export async function checkStorageFileExist(fileName: string) {
  const storage = new Storage();
  const bucketName = process.env.GCS_BUCKET_NAME || 'vsea_storage';
  const [status] = await storage.bucket(bucketName).file(fileName).exists();
  return status;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function convertLableAnswer(index: number) {
  switch (index) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    case 3:
      return 'D';
    default:
      return 'A';
  }
}

// for audit logs of action in ( libraries, exercises, games)
// user email
let publicVariableEmail = '';
export function updatePublicVarEmail(email: string) {
  publicVariableEmail = email;
}
export function writeAuditLogs(payload: {
  action: string;
  content: any;
  endpoint: string;
  entity:
    | 'customlib'
    | 'vocab-senten-lib'
    | 'basic-exercise'
    | 'advance-exercise'
    | 'game';
}) {
  try {
    const date = new Date();
    const audit = `${date}   user:${publicVariableEmail}   endpoint: ${payload.endpoint}   action:${payload.action}  content:${payload.content}\n`;
    // fs.appendFileSync(
    //   `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${
    //     payload.entity
    //   }.txt`,
    //   audit,
    //   { flags: 'a+' } as any,
    // );
    //file written successfully
  } catch (err) {
    console.error(err);
  }
}
