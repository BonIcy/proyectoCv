const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';

async function getUserInfo() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("User");

        const result = await collection.aggregate([
            {
                $lookup: {
                    from: "Data_User",
                    localField: "_id",
                    foreignField: "UserId",
                    as: "DataUserInfo"
                }
            },
            {
                $project: {
                    "_id": 1,
                    "Username": 1,
                    "Role": 1,
                    "Email": 1,
                    "Password": 1,
                    "CreatedAt": 1,
                    "DataUser": {
                        $cond: {
                            if: { $eq: [{ $size: "$DataUserInfo" }, 0] },
                            then: null,
                            else: {
                                $first: "$DataUserInfo"
                            }
                        }
                    }
                }
            }
        ]).toArray();

        return result;
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        client.close();
    }
}

module.exports = getUserInfo;
