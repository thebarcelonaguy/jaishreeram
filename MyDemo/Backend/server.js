// Import required modules
const express = require("express");
const path = require("path");
const cors = require('cors');
const axios = require('axios');
const OAuthToken = require('./ebay_oauth_token.js');
// Create the Express application
const app = express();

const client_id = 'RahulAgg-HW2-PRD-47284ce84-5d0fe668';
const client_secret = 'PRD-7284ce842fb6-6139-48b3-aa96-e7a1';
const oauthToken = new OAuthToken(client_id, client_secret);



// CORS configuration
const corsOptions = {
  origin: '*', // This will allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply middleware
app.use(cors(corsOptions)); // Enable CORS for all routes // Logging middleware for incoming requests
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '..', 'dist', 'my-demo'); // Path to your Angular app's dist folder

// Serve the static files from the Angular app
app.use(express.static(publicPath));

app.post('/search', async (req, res) => {
  const {
    keyword, // Make sure all these variables match the names used in the form
    category,
    newCondition,
    used,
    unspecified,
    localPickup,
    freeShipping,
    distance,
    zipCode
  } = req.body;

  const base_url = "https://svcs.ebay.com/services/search/FindingService/v1";
  let filter_count = 0;
  let params = {
    "OPERATION-NAME": "findItemsAdvanced",
    "SERVICE-VERSION": "1.0.0",
    "SECURITY-APPNAME": "RahulAgg-HW2-PRD-47284ce84-5d0fe668", // Replace with your actual AppID
    "RESPONSE-DATA-FORMAT": "JSON",
    "REST-PAYLOAD": "",
    "paginationInput.entriesPerPage": 50,
    "keywords": keyword,
    "outputSelector(0)": "SellerInfo",
    "outputSelector(1)": "StoreInfo",
    // include category if selected and not "All Categories"
    ...(category && category !== 'All Categories' && { "categoryId": category }),
  };

  // Condition filter
  if (newCondition || used || unspecified) {
    params[`itemFilter(${filter_count}).name`] = "Condition";
    if (newCondition) {
      params[`itemFilter(${filter_count}).value(0)`] = "New";
    }
    if (used) {
      params[`itemFilter(${filter_count}).value(1)`] = "Used";
    }
    if (unspecified) {
      params[`itemFilter(${filter_count}).value(2)`] = "Unspecified";
    }
    filter_count++;
  }

  // Free shipping filter
  if (freeShipping) {
    params[`itemFilter(${filter_count}).name`] = "FreeShippingOnly";
    params[`itemFilter(${filter_count}).value`] = "true";
    filter_count++;
  }

  // Local pickup filter
  if (localPickup) {
    params[`itemFilter(${filter_count}).name`] = "LocalPickupOnly";
    params[`itemFilter(${filter_count}).value`] = "true";
    filter_count++;
  }

  // Distance filter
  if (distance && zipCode) {
    params[`itemFilter(${filter_count}).name`] = "MaxDistance";
    params[`itemFilter(${filter_count}).value`] = distance;
    params["buyerPostalCode"] = zipCode; // eBay API uses buyerPostalCode as a parameter for location
    filter_count++;
  }

  // Add other filters as needed, using similar patterns

  try {
    const response = await axios.get(base_url, { params });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from eBay API:', error);
    res.status(500).send('Error fetching data from eBay API');
  }
});

app.get('/geonameszip', async (req, res) => {
  const postalcode_startsWith = req.query.postalcode_startsWith;
  const geonamesUsername = 'rahulagg'; // Replace with your username
  const geonamesApiUrl = `http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=${query}&username=${geonamesUsername}&maxRows=5`;

  try {
    const response = await axios.get(geonamesApiUrl);
    const zipCodes = response.data.postalCodes.map(pc => pc.postalCode); // Adjust this if necessary
    res.json(zipCodes);
  } catch (error) {
    console.error('Error fetching data from Geonames API:', error);
    res.status(500).send('Error fetching data from Geonames API');
  }
});


app.get('/item-details/:item_id', async (req, res) => {
  try {
    const accessToken = await oauthToken.getApplicationToken();
    const item_id = req.params.item_id;
    console.log(`item ID LOVE is${item_id}`);

    const base_url = "https://open.api.ebay.com/shopping";
    const params = {
      "callname": "GetSingleItem",
      "responseencoding": "JSON",
      "appid": client_id,
      "siteid": "0",
      "version": "967",
      "ItemID": item_id,
      "IncludeSelector": "Description,Details,ItemSpecifics",
    };

    const headers = {
      "X-EBAY-API-IAF-TOKEN": accessToken
    };

    const response = await axios.get(base_url, { params: params, headers: headers });
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching data from eBay API' });
  }
});
app.get('/getSimilarItems', async (req, res) => {
  const item_id = req.params.item_id;
  console.log(`item ID LOVE is${item_id}`);

  const url = 'https://svcs.ebay.com/MerchandisingService';

  try {
    const response = await axios.get(url, {
      params: {
        'OPERATION-NAME': 'getSimilarItems',
        'SERVICE-NAME': 'MerchandisingService',
        'SERVICE-VERSION': '1.1.0',
        'CONSUMER-ID': client_id,
        'RESPONSE-DATA-FORMAT': 'JSON',
        'REST-PAYLOAD': '',
        'itemId': item_id,
        'maxResults': 20,
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error calling eBay API:', error.message);
    res.status(500).send('Error fetching similar items');
  }
});


// Catch all other routes and return the index file



// Add an endpoint for image search
app.get('/getImages', async (req, res) => {
  // Extract query from the request parameters
  const { query } = req.query;


  // Define the API URL and parameters for the Google Custom Search API
  const API_URL = 'https://www.googleapis.com/customsearch/v1';
  const API_KEY = 'AIzaSyA2Gez3O_Vw68n1nZ1M4Wyx8hei_4zeZAw'; // Replace with your actual API Key
  const CX = 'e00da1222af674623'; // Replace with your actual Custom Search Engine ID

  const googleApiParams = `?q=${encodeURIComponent(query)}&cx=${CX}&imgSize=large&num=8&searchType=image&key=${API_KEY}`;
  try {
    const response = await axios.get(`${API_URL}${googleApiParams}`);
    console.log(`Google API Response: ${JSON.stringify(response.data)}`); // Log the full response from the Google API

    if (response.data.items) {
      const images = response.data.items.map(item => item.link);
      res.json(images);
    } else {
      res.status(404).send('No images found');
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).send('Error fetching images');
  }
});
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});






app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

