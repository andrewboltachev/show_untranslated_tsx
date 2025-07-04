import dotenv from "dotenv";

// the main glob() and globSync() resolve/return array of filenames
dotenv.config();

const normalizeWS = (s) => {
  return s.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
}
/**
 * Replaces sequences of non-English alphabet characters with a single space,
 * then trims leading/trailing spaces from the result.
 *
 * @param {string} inputString The string to process.
 * @returns {string} A new string with non-English sequences replaced by single spaces, and trimmed.
 */
function replaceNonEnglishSequencesWithSpace(inputString) {
  if (typeof inputString !== 'string') {
    inputString = String(inputString);
  }

  // Regex breakdown:
  // [^a-zA-Z]+
  // [^a-zA-Z]: Matches any single character that is NOT an English letter (a-z or A-Z).
  // +: Matches one or more occurrences of the preceding character set.
  // g: Global flag, ensures all sequences are replaced, not just the first.
  const processedString = inputString.replace(/[^a-zA-Z]+/g, ' ');

  // Trim any leading or trailing spaces that might result from the replacement
  return processedString.trim();
}

/**
 * Converts an array of words into a camel-cased string.
 *
 * @param {string[]} wordsArray An array of strings, where each string is a word.
 * It's assumed that the words in the array are already
 * clean (e.g., no internal spaces, generally contain
 * only English letters, possibly from a previous processing step).
 * @returns {string} The camel-cased string.
 */
function wordsToCamelCase(wordsArray) {
    // Handle empty or non-array inputs
    if (!Array.isArray(wordsArray) || wordsArray.length === 0) {
        return "";
    }

    // Process the first word: make it entirely lowercase
    let camelCasedString = wordsArray[0].toLowerCase();

    // Process the rest of the words: capitalize the first letter, lowercase the rest
    for (let i = 1; i < wordsArray.length; i++) {
        const word = wordsArray[i];
        if (word.length > 0) {
            // Take the first character, convert to uppercase
            // Take the rest of the string from the second character, convert to lowercase
            camelCasedString += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        // If an empty string word exists in the array, it will be skipped
    }

    return camelCasedString;
}

import fs from "fs";
import path from "path";

/**
 * Writes an array of lines to a file synchronously.
 *
 * @param {string} filePath The path to the file where lines will be written.
 * @param {string[]} linesArray An array of strings, where each string is a line.
 * @returns {void}
 * @throws {Error} Throws an error if the write operation fails.
 */
function writeLinesToFileSync(filePath, linesArray) {
    const fileContent = linesArray.join('\n'); // Join lines with newline character

    try {
        // fs.writeFileSync(file, data, [options])
        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`Successfully wrote ${linesArray.length} lines to ${filePath} (Sync).`);
    } catch (err) {
        console.error(`Error writing file ${filePath}:`, err);
        throw err; // Re-throw the error for the caller to handle
    }
}

/**
 * Reads a JSON file, updates its content synchronously using a provided function,
 * and then saves the updated content back to the file.
 *
 * @param {string} filePath The path to the JSON file.
 * @param {function(Object): Object | void} updateFn A function that takes the parsed JSON object
 * as an argument, modifies it, and can optionally return the modified object.
 * If nothing is returned, the original object passed to it is assumed to be mutated.
 * @throws {Error} Throws an error if the file cannot be read/written, or if JSON parsing/stringifying fails.
 */
function updateJsonFileSynchronously(filePath, updateFn) {
    let fileContent;
    let data;

    try {
        // Step 1: Read the JSON file synchronously
        console.log(`[SYNC] Reading file: ${filePath}...`);
        fileContent = fs.readFileSync(filePath, 'utf8');
        console.log('[SYNC] File content read.');

        // Step 2: Parse the JSON string into a JavaScript object
        data = JSON.parse(fileContent);
        console.log('[SYNC] JSON parsed.');

        // Step 3: Update the JavaScript object using the provided updateFn
        console.log('[SYNC] Calling update function...');
        const updatedData = updateFn(data); // updateFn might return a new object or mutate 'data'

        // Use the returned data if updateFn returns something, otherwise use the mutated 'data'
        data = updatedData !== undefined ? updatedData : data;
        console.log('[SYNC] Data updated.');

        // Step 4: Stringify the modified JavaScript object back into a JSON string
        // Indent with 2 spaces for readability
        const updatedJsonContent = JSON.stringify(data, null, 2);
        console.log('[SYNC] JSON stringified.');

        // Step 5: Write the JSON string back to the file synchronously
        fs.writeFileSync(filePath, updatedJsonContent, 'utf8');
        console.log('[SYNC] File saved successfully!');

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`[SYNC] Error: File not found at ${filePath}.`);
        } else if (error instanceof SyntaxError) {
            console.error(`[SYNC] Error parsing JSON from ${filePath}: ${error.message}`);
            console.error('[SYNC] The file might contain invalid JSON.');
        } else {
            console.error(`[SYNC] An unexpected error occurred while processing ${filePath}:`, error);
        }
        // Re-throw the error so the caller knows the operation failed
        throw error;
    }
}

const ruFile = [];
for (const item of normalizeWS(fs.readFileSync(process.env.RU_FILE_PATH, 'utf-8')).split('\n')) {
  ruFile.push(item);
}
const enFile = [];
for (const item of normalizeWS(fs.readFileSync(process.env.EN_FILE_PATH, 'utf-8')).split('\n')) {
  enFile.push(item);
}
const keys = [];
for (const item of normalizeWS(fs.readFileSync(process.env.KEY_FILE_PATH, 'utf-8')).split('\n')) {
  keys.push(item);
}

const ru_json = {};
const en_json = {};

for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!key) continue;
    const ru = ruFile[i];
    const en = enFile[i];
    // console.log({key, ru, en});
    ru_json[key] = ru;
    en_json[key] = en;
}

updateJsonFileSynchronously(`${process.env.PROJECT_DIR}/static/lang/ru.json`, (x) => ({...x, auto: ru_json}));
updateJsonFileSynchronously(`${process.env.PROJECT_DIR}/static/lang/en.json`, (x) => ({...x, auto: en_json}));

//writeLinesToFileSync(process.env.KEY_FILE_PATH, keys);
