const admin = require("firebase-admin");
const express = require("express");
// Make sure your service_account.json is in the same directory
const serviceAccount = require("./service_account.json");
// Import the badge generator function from our new file
const { generateSvgBadge } = require('./badge-generator.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
console.log('Firebase app initialized and Firestore instance obtained!');

const app = express();
const port = process.env.PORT || 3000; // Use environment port or default to 3000
app.use(express.json());

/**
 * Safely increments the visitor count for a given site in Firestore using a transaction.
 * @param {string} site - The ID of the site to track.
 * @returns {Promise<number>} - The *new* total visitor count.
 */
async function getTotalVisitorCount(site) {
  if (!site) {
    return 0;
  }
  
  try {
    const visitorDocRef = db.collection('visitors').doc(site);

    // Use a transaction to safely read-modify-write the count
    const newCount = await db.runTransaction(async (t) => {
      const doc = await t.get(visitorDocRef);
      
      if (!doc.exists) {
        // Document doesn't exist, create it with 1 visit
        t.set(visitorDocRef, {
          name: site,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          visits: 1
        });
        return 1;
      } else {
        // Document exists, increment visits
        const currentVisits = doc.data().visits || 0;
        const newVisits = currentVisits + 1;
        t.update(visitorDocRef, {
          visits: newVisits,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        return newVisits;
      }
    });

    return newCount; // Return the new, updated count
  } catch (error) {
    // This will now catch both "invalid path" errors and "transaction" errors
    console.error(`Error processing site "${site}":`, error.message);
    return 0; // Return 0 on error
  }
}

// --- Express.js Routes (API Endpoints) ---
// This route now returns an SVG image and accepts a 'style' query param
app.get('/', async (req, res) => {
  // FIX: Get 'site' and 'style' and strip any surrounding quotes
  // This cleans up inputs like %22flat-yellow%22 (which is "flat-yellow")
  const site = (req.query.site || '').replace(/^"|"$/g, '');
  const style = (req.query.style || '').replace(/^"|"$/g, '');
  const label = (req.query.label || '').replace(/^"|"$/g, '');

  if (!site) {
    // Return a "No Site" badge
    const errorSvg = generateSvgBadge(label,"No Site", style || 'flat-red'); // Use 'flat-red' for errors
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    return res.send(errorSvg);
  }

  // Get the new count (this also increments it)
  const visitorCount = await getTotalVisitorCount(site);
  
  // Generate the SVG badge with the new count AND the requested style
  const badgeSvg = generateSvgBadge(label,visitorCount, style);

  // Set headers to return an SVG image and, CRITICALLY, prevent caching
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1
  res.setHeader('Pragma', 'no-cache'); // HTTP 1.0
  res.setHeader('Expires', '0'); // Proxies

  // Send the SVG string as the response
  res.send(badgeSvg);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
  console.log('Endpoints available:');
  // Updated log message to remove quotes, matching the code's logic
  console.log(`Get http://localhost:${port}?site=your_site_name&style=style_name&label="value"`);
});

