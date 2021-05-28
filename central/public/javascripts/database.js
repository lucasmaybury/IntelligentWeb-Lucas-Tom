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

let db;

/**
 * Constants
 */
const DB_NAME= 'db_spychat';
const IMAGE_STORE_NAME= 'store_image';
const MESSAGES_STORE_NAME= 'store_messages';
const ANNOTATIONS_STORE_NAME= 'store_annotations';
const TRANSITIONS_STORE_NAME= 'store_transitions';

/**
 * initialises the database
 * sets up object stores if they dont exist
 * creates indexes on the object stores
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {

                //Image:
                // id, name, title, description, author, image
                if (!upgradeDb.objectStoreNames.contains(IMAGE_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(IMAGE_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('name', 'name', {unique: true, multiEntry: true});
                }

                //Messages:
                // id, roomId, userId, text, datetime
                if (!upgradeDb.objectStoreNames.contains(MESSAGES_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(MESSAGES_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('roomId', 'roomId', {unique: false, multiEntry: true});
                }

                //Annotation:
                // id, roomId, userId, canvasHeight, x1, y21, x2, y2, color, thickness
                if (!upgradeDb.objectStoreNames.contains(ANNOTATIONS_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(ANNOTATIONS_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('roomId', 'roomId', {unique: false, multiEntry: true});
                }

                //Transitions:
                // id, source, destination
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
 * CHAT MESSAGES
 */

/**
 * saves a message received from socket.io (or elsewhere) to the indexedDB
 * @param messageObject: the message to be saved
 * @returns {Promise<void>}
 */
async function storeMessageData(messageObject) {
    console.log('inserting: '+JSON.stringify(messageObject));
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(MESSAGES_STORE_NAME, 'readwrite'); //init transaction
            let store = await tx.objectStore(MESSAGES_STORE_NAME); //init store
            await store.put(messageObject); //write the object to the store
            await  tx.done; //end the transation
            console.log('added item to the store:'+ JSON.stringify(messageObject));
        } catch(error) {
            console.error('error storing message:\n'+error);
        };
    }
}
window.storeMessageData= storeMessageData;

/**
 * Gets all cached messages
 * @param roomId: the name of the room that the message was sent to
 * @returns {Promise<message object>}: a promise with the value of a collection of messages
 */
async function getRoomMessages(roomId) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching messages for: ' + roomId);
            let tx = await db.transaction(MESSAGES_STORE_NAME, 'readonly'); //init transaction
            let store = await tx.objectStore(MESSAGES_STORE_NAME); //init store
            let roomIndex = await store.index('roomId'); //init room index
            let readingsList = await roomIndex.getAll(IDBKeyRange.only(roomId));
            //get all messages where the roomId is the same as the requested value
            readingsList.sort((el1, el2) => el1.dateTime > el2.dateTime);
            //sort the values in javascript (performing this in indexedDB is possible but would take some work)
            await tx.complete; //end transaction
            return readingsList;
        } catch (error) {
            console.error(error)
            alert("unable to get chat history for this room")
        }
    } else {
        alert("Error starting database")
    }
}
window.getRoomMessages= getRoomMessages;


/**
 * ANNOTATIONS
 */

/**
 * saves an annotation to the indexedDB
 * @param annotationObject: the message to be saved
 * @returns {Promise<void>}
 */
async function storeAnnotationData(annotationObject) {
    console.log('inserting: '+JSON.stringify(annotationObject));
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(ANNOTATIONS_STORE_NAME, 'readwrite'); //init transaction
            let store = await tx.objectStore(ANNOTATIONS_STORE_NAME); //init store
            await store.put(annotationObject); //write the object to the store
            await  tx.done; //end the transation
            console.log('added item to the store:'+ JSON.stringify(annotationObject));
        } catch(error) {
            console.error('error storing message:\n'+error);
        };
    }
}
window.storeAnnotationData= storeAnnotationData;

/**
 * Gets all cached messages
 * @param roomId: the name of the room that the message was sent to
 * @returns {Promise<message object>}: a promise with the value of a collection of messages
 */
async function getRoomAnnotations(roomId) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching annotations for room: ' + roomId);
            let tx = await db.transaction(ANNOTATIONS_STORE_NAME, 'readonly'); //init transaction
            let store = await tx.objectStore(ANNOTATIONS_STORE_NAME); //init store
            let roomIndex = await store.index('roomId'); //init room index
            let readingsList = await roomIndex.getAll(IDBKeyRange.only(roomId));
            //get all annotations where the roomId is the same as the requested value
            await tx.complete; //end transaction
            return readingsList;
        } catch (error) {
            console.error(error)
            alert("unable to get annotation history for this room")
        }
    } else {
        alert("Error starting database")
    }
}
window.getRoomAnnotations= getRoomAnnotations;

