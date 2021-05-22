import { MongoClient } from 'mongodb';
const ObjectId = require('mongodb').ObjectID;

/* eslint no-return-await: 0 */

const DATABASE_URL = process.env.MONGO_URL;

if (!DATABASE_URL) throw Error("DATABASE_URL is empty");

console.log(DATABASE_URL);

let client = null;

export const insertDocuments = async (
    databaseName, collectionName, doc
) => {
    if (client == null) {
        await connect();
    }

    if (!doc) return {"error":"insert - no doc found to insert"};
    
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    return await collection.insertOne(doc);
}

export const findDocuments = async (
    databaseName, collectionName, query = {}, skip=0, limit=1000
) => {

    if (client == null) {
        await connect();
    }

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    return await collection.find(query).skip(skip).limit(limit).toArray();
}


export const updateDocument = async (
    databaseName, collectionName, id, doc
) => {
    if (client == null) {
        await connect();
    }

    // never delete all
    if (!id || !doc) return {"error":"update - missing id or doc"};
    
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    return await collection.replaceOne({ "_id": ObjectId(id) }, doc);
};

export const removeDocuments = async (
    databaseName, collectionName, id
) => {
    if (client == null) {
        await connect();
    }

    // never remove all
    if (!id) return {"error":"remove - no id specified"};
    
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    return await collection.deleteOne({ "_id": ObjectId(id) });
};

const connect = async () => {

    client = new MongoClient(DATABASE_URL, { useUnifiedTopology: true });
    await client.connect();
};
