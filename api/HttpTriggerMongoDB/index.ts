import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { findDocuments, insertDocuments, removeDocuments, updateDocument } from '../azure-cosmosdb-mongodb';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('MongoDB');

    const databaseName = (req.query.databaseName || (req.body && req.body.databaseName));
    const collectionName = (req.query.collectionName || (req.body && req.body.collectionName));
    const crudAction = (req.query.action || (req.body && req.body.action));

    let data = null;

    if (!databaseName || !collectionName) {
        data = { "error": "input body - missing databaseName and/or collectionName" };

        context.res = {
            body: data
        };
        return;
    } else {

        switch (collectionName) {
            case "User":

                if (crudAction === "find") {

                    const query = (req.query.query || (req.body && req.body.query));
                    const skip = (req.query.skip || (req.body && req.body.skip));
                    const limit = (req.query.limit || (req.body && req.body.limit));

                    data = await findDocuments(databaseName, collectionName, query, skip, limit)
                } else if (crudAction === "insert") {

                    const docs = (req.query.docs || (req.body && req.body.docs));

                    data = await insertDocuments(databaseName, collectionName, docs)
                } else if (crudAction === "update") {

                    const id = (req.query.id || (req.body && req.body.id));
                    const doc = (req.query.doc || (req.body && req.body.doc));

                    data = await updateDocument(databaseName, collectionName, id, doc)
                } else if (crudAction === "remove") {

                    const id = (req.query.id || (req.body && req.body.id));

                    data = await removeDocuments(databaseName, collectionName, id)
                } else {
                    data = { "error": "no action found" }
                }
                break;
        }
        context.res = {
            body: data
        };
    }


};

export default httpTrigger;