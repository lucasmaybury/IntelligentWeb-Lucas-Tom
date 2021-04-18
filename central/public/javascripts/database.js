/*
 *  Copyright (C) The University of Sheffield - All Rights Reserved
 *  * Unauthorized copying of this software, via any medium is strictly prohibited
 *  * Proprietary and confidential
 *  * Written by Fabio Ciravegna (f.ciravegna@shef.ac.uk)
 *
 */
////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';

/*
Database Stores:

Image:
id, name, title, description, author, image

Messages:
id, user, text

Annotation:
tbd

Transitions:
id, source, destination
 */

let db;

const DB_NAME= 'db_spychat';
const IMAGE_STORE_NAME= 'store_image';
const MESSAGES_STORE_NAME= 'store_messages';
const ANNOTATIONS_STORE_NAME= 'store_annotations';
const TRANSITIONS_STORE_NAME= 'store_transitions';

/**
 * it inits the database
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(IMAGE_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(IMAGE_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('name', 'name', {unique: true, multiEntry: true});
                }

                if (!upgradeDb.objectStoreNames.contains(MESSAGES_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(MESSAGES_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('id', 'id', {unique: true, multiEntry: true});
                }

                if (!upgradeDb.objectStoreNames.contains(ANNOTATIONS_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(ANNOTATIONS_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('id', 'id', {unique: true, multiEntry: true});
                }

                if (!upgradeDb.objectStoreNames.contains(TRANSITIONS_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(TRANSITIONS_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('id', 'id', {unique: true, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;
/**
 * it saves the sum
 * @param sumObject: it contains  two numbers and their sum, e.g. {num1, num2, sum}
 */
async function storeSumData(sumObject) {
    console.log('inserting: '+JSON.stringify(sumObject));
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(SUMS_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(SUMS_STORE_NAME);
            await store.put(sumObject);
            await  tx.complete;
            console.log('added item to the store! '+ JSON.stringify(sumObject));
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        };
    }
    else localStorage.setItem(sumObject.sum, JSON.stringify(sumObject));
}
window.storeSumData= storeSumData;

/**
 * it retrieves all the numbers that have summed to sumValue
 * @param sumValue: a number
 * @returns objects like {num1, num2, sumValue}
 */
async function getSumData(sumValue) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching: ' + sumValue);
            let tx = await db.transaction(SUMS_STORE_NAME, 'readonly');
            let store = await tx.objectStore(SUMS_STORE_NAME);
            let index = await store.index('sum');
            let readingsList = await index.getAll(IDBKeyRange.only(sumValue));
            await tx.complete;
            if (readingsList && readingsList.length > 0) {
                let max;
                for (let elem of readingsList)
                    addToResults(elem);
            } else {
                const value = localStorage.getItem(sumValue);
                if (value == null)
                    addToResults();
                else addToResults(value);
            }
        } catch (error) {
            console.log('I could not retrieve the items because: '+error);
        }
    } else {
        const value = localStorage.getItem(sumValue);
        if (value == null)
            addToResults();
        else addToResults(value);
    }
}
window.getSumData= getSumData;
