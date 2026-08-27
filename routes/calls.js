const axios = require("axios");
require("dotenv").config();


const KEY = process.env.CMC_API_KEY;

async function price() {
  const response = await axios.get(
    "https://pro-api.coinmarketcap.com/public-api/v1/simple/price?ids=38138&convert=USD",
    // {
    //   headers: {
    //     "X-CMC_PRO_API_KEY": `${KEY}`,
    //   },
    // },
  );

  // ==========================================
  // 12. 
  // ==========================================

  let answer = response.data;

  if (!answer) {
    throw new Error("API returned an empty response.");
  }

  const prices = Number(answer.data[0]?.price).toFixed(4)

  return `$${prices}`;
}

module.exports = price;

