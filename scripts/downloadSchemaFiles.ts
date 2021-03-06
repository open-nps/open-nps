#!/bin/bash
import https from 'https';
import fs from 'fs';

const httpGet = (url: string) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(data);
        });
      })
      .on('error', (err) => {
        console.log('Error: ' + err.message);
        reject(err);
      });
  });

export default async () => {
  const resolvePath = (path: string) => `${process.cwd()}/src/${path}`;

  if (process.env.SURVEY_SCHEMA) {
    const survey = await httpGet(process.env.SURVEY_SCHEMA);
    process.env.SURVEY_SCHEMA_JSON = survey as string;
  }

  if (process.env.REVIEWER_SCHEMA) {
    const reviewer = await httpGet(process.env.REVIEWER_SCHEMA);
    process.env.REVIEWER_SCHEMA_JSON = reviewer as string;
  }
};
