const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv'

async function getInfoCampers() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(nombreBase);
    const collection = db.collection("Campers");
    const result = await collection.aggregate([
        {
          $lookup: {
            from: "Skills",
            localField: "Skills",
            foreignField: "_id",
            as: "SkillsInfo"
          }
        },
        {
          $lookup: {
            from: "Gender",
            localField: "Gender",
            foreignField: "_id",
            as: "GenderInfo"
          }
        },
        {
          $lookup: {
            from: "Document_Type",
            localField: "TypeDocument",
            foreignField: "_id",
            as: "DocumentTypeInfo"
          }
        },
        {
            $lookup: {
              from: "English_Levels",
              localField: "EnglishLevel",
              foreignField: "_id",
              as: "EnglishLevelInfo"
            }
        },
        {
            $lookup: {
                from: "CVs",
                localField: "_id",
                foreignField: "CamperId",
                as: "CVInfo"
          }
        },
        {
            $lookup: {
              from: "Social_Network",
              localField: "_id",
              foreignField: "CamperId",
              as: "SocialInfo"
            }
        },
        {
          $addFields: {
            "Skills": "$SkillsInfo.S_Name",
            "EnglishLevel": {
                $first: "$EnglishLevelInfo.E_Name"
            },
            "Gender": {
                $first: "$GenderInfo.Name"
            },
            "DocumentType": {
                $first: "$DocumentTypeInfo.Name"
            },
            "SocialInfo": "$SocialInfo",
            "CV": {
              $cond: {
                if: { $eq: [{ $size: "$CVInfo" }, 0] },
                then: null,
                else: "$CVInfo"
              }
            },
            "VideoCamper": {
              $cond: {
                if: { $eq: [{ $size: "$SocialInfo.DriveVideo" }, 0] },
                then: null,
                else: "$SocialInfo.DriveVideo"
              }
            }
          }
        },
        {
          $project: {
            "Skills": 1,
            "Gender": 1,
            "DocumentType": 1,
            "SocialMedia": {
                "Github": {
                    $first: "$SocialInfo.Github"
                },
                "LinkedIn": {
                    $first: "$SocialInfo.LinkedIn"
                },
                "DriveVideo": {
                    $first: "$SocialInfo.DriveVideo"
                },
            },
            "CV": 1,
            "VideoCamper": 1,
            "_id": 1,
            "Name": 1,
            "LastName": 1,
            "Email": 1,
            "Phone": 1,
            "identification": 1,
            "Location": 1,
            "Salary": 1,
            "EnglishLevel": 1,
            "Biography": 1,
            "Stacks": 1,
            "Working": 1,
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

module.exports = getInfoCampers;