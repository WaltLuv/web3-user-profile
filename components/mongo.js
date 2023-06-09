import axios from 'axios';

const mongokey = 'CnDpbq3ERV0tgEECUXZNJiI4HvZymO7SWzlbhvEWTHBIZ8LqizEea06kBzctFrvq'
const mongourl = 'https://data.mongodb-api.com/app/data-plwgy/endpoint/data/v1/action/'
const mongoheader =  {
    "Content-Type": "application/json",
    "api-key": mongokey,
  }

export async function storeWallet(addresstr, walletaddress, walletkey) {
    await axios.post(mongourl + "insertOne",
    {
        collection: "profiles",
        database: "brg-database",
        dataSource: "Cluster1",
        document: {
            wallet: addresstr,
            paywallet: walletaddress,
            private: walletkey,
        }
    },
    mongoheader
    ).catch((error) => {
        console.log('Call failed:' + error)
  })
}

export async function updateWallet(addresstr, newwallet) {
    await axios.post(mongourl + "updateOne",
    {
        collection: "profiles",
        database: "brg-database",
        dataSource: "Cluster1",
        filter: {
            wallet: addresstr,
        },
        update: {
            wallet: newwallet,
        }
    },
    mongoheader
    ).catch((error) => {
        console.log('Call failed:' + error)
  })
}

export async function getPayInfo(addresstr) {
    const getInfo = await axios.post(mongourl + "findOne",
    {
        collection: "profiles",
        database: "brg-database",
        dataSource: "Cluster1",
        filter: {
            wallet: addresstr,
        }
    },
    mongoheader
    ).catch((error) => {
        console.log('Call failed:' + error)
  })
  return getInfo.data.document.private;
}
