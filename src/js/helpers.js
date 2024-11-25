import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Refactoring the getJSON and sendJSON as they are nearly identical
export const AJAXRequest = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // We are setting a Race between the fetch and the timeout Promises to handle bad internet connections and break the program, so the website will break after TIMEOUT_SEC of not fetching the data.
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`); // Guard Clause
    return data;
  } catch (error) {
    throw error; // Here we are re-throwing the error to the calling module to handle it independently in each module
  }
};

/*

export const getJSON = async function (url) {
  try {
    // We are setting a Race between the fetch and the timeout Promises to handle bad internet connections and break the program, so the website will break after TIMEOUT_SEC of not fetching the data.
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`); // Guard Clause
    return data;
  } catch (error) {
    throw error; // Here we are re-throwing the error to the calling module to handle it independently in each module
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // We need a POST request to send the JSON to the API, we will also use fetch method for this.
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json(); // This will return the data back that we sent.

    if (!res.ok) throw new Error(`${data.message} (${res.status})`); // Guard Clause
    return data;
  } catch (error) {
    throw error; // Here we are re-throwing the error to the calling module to handle it independently in each module
  }
};

*/
