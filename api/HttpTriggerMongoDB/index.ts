import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { findDocuments, insertDocuments, removeDocuments, updateDocument } from '../shared/azure-cosmosdb-mongodb';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('MongoDB');

    const databaseName = (req.query.databaseName || (req.body && req.body.databaseName));
    const collectionName = (req.query.collectionName || (req.body && req.body.collectionName));
    const crudAction = (req.query.action || (req.body && req.body.action));

    let data = null;

    if (!databaseName || !collectionName) {

        data = { "error": "input body - missing databaseName and/or collectionName" };

        context.res = {
            status: 401,
            body: data
        };
        return;
    }

    switch (crudAction) {
        
        case "find":

            const query = (req.query.query || (req.body && req.body.query));
            const skip = (req.query.skip || (req.body && req.body.skip));
            const limit = (req.query.limit || (req.body && req.body.limit));

            data = await findDocuments(databaseName, collectionName, query, skip, limit);

            break;

        case "upsert":

            const id = (req.query.id || (req.body && req.body.id));
            const doc = (req.query.doc || (req.body && req.body.doc));
            const key = (req.query.key || (req.body && req.body.key));
            const value = (req.query.value || (req.body && req.body.value));

            if (id) {
                data = await updateDocument(databaseName, collectionName, id, doc)
            } else if (key) {
                // (find then update) or (not found then insert)
                const query = { [key]: value };
                data = await findDocuments(databaseName, collectionName, query);

                // data exists - just update
                if (data && data.length === 1) {
                    const id = data[0]._id.toString();
                    if (id) {
                        data = await updateDocument(databaseName, collectionName, id, doc)
                    }
                } else if (data && data.length === 0) {
                    // data doesn't exist - insert
                    data = await insertDocuments(databaseName, collectionName, doc)
                } else {
                    data = { "error": "upsert - found more than 1 matching record" }
                }
            } else {
                // just insert
                data = await insertDocuments(databaseName, collectionName, doc)
            }
            break;

        case "remove":

            const id = (req.query.id || (req.body && req.body.id));

            data = await removeDocuments(databaseName, collectionName, id)
            break;
        
        default:
            data = { "error": "no action found" }

            break;
    }
    context.res = {
        body: data
    };
}

export default httpTrigger;