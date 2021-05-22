/**
 * Call Azure Function api to store and retrieve 
 * application information specific to the authenticated user
 */
 import axios from "axios";

 const baseUrl = process.env["REACT_APP_AZURE_FUNCTION_APP_BASE_URL"] || "http://localhost:7071";
 
 export const insertUser = async (appUserId: string, appUserNameOrEmail: string): Promise<string> => {
     
     const url = baseUrl + "/api/HttpTriggerMongoDB";
     
     const sendBody = {
         "action": "upsert",
         "databaseName": "app-db-1",
         "collectionName": "User",
         "key": "azureAppUserId",
         "doc": {
             "azureAppUserId": appUserId,
             "azureAppUserEmail": appUserNameOrEmail,
             "lastConnection": new Date().toISOString()
         }
     }
     
     const result = await axios.post(url, sendBody);
     if (result?.data?.ok!=1) throw Error("insert User failed");
 }
 
 export const updateColor = async (user: any, favoriteColor: string): Promise<string> => {
     
     const url = baseUrl + "/api/HttpTriggerMongoDB";
     
     const sendBody = {
         "action": "upsert",
         "databaseName": "app-db-1",
         "collectionName": "User",
         "key": "azureAppUserId",
         "value": user.azureAppUserId,
         "doc": { ...user,
             "color": favoriteColor,
             "lastConnection": new Date().toISOString()
         }
     }
     
     const result = await axios.post(url, sendBody);
     
     // return MongoDB ID for user
     return result.data._id.toString();
 }
 
 export const getUser = async (appUserId: string): Promise<Object> => {
     const url = baseUrl + "/api/HttpTriggerMongoDB";
     
     const sendBody = {
         "action": "find",
         "databaseName": "app-db-1",
         "collectionName": "User",
         "query": {"appUserId": appUserId}
     }
     
     const result = await axios.post(url, sendBody);
     
     // return MongoDB ID for user
     return result.data;
 }
 
 export const isKnownUser = async (appUserId: string): Promise<Object> => {
     const user = await getUser(appUserId);
     
     return (user ? true : false);
 }
 