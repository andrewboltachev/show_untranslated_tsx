
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

const keys = [];
for (const item of normalizeWS(fs.readFileSync(process.env.EN_FILE_PATH, 'utf-8')).split('\n')) {
  const key = wordsToCamelCase(replaceNonEnglishSequencesWithSpace(item).split(' '));
  keys.push(key);
  console.log(key);
}
writeLinesToFileSync(process.env.KEY_FILE_PATH, keys);
