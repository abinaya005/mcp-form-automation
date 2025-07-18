const axios = require('axios');

const BASE_URL = 'https://mcp-form-automation.onrender.com';

// Retry logic to wait until the server is awake
async function waitForServerReady(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(`${BASE_URL}/index.html`);
      if (res.status === 200) {
        console.log("✅ Render server is ready!");
        return;
      }
    } catch (e) {
      console.log(`⏳ Waiting for server to wake up... (${i + 1})`);
      await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 seconds
    }
  }
  throw new Error("❌ Server not responding after multiple retries.");
}

(async () => {
  try {
    await waitForServerReady();

    await axios.post(`${BASE_URL}/start`);
    console.log("✅ Browser launched.");

    await axios.post(`${BASE_URL}/goto`, {
      url: `${BASE_URL}/index.html`
    });
    console.log("✅ Navigated to the form.");

    // Step 1 – Personal Info
    await axios.post(`${BASE_URL}/fill`, { selector: 'input[name="name"]', value: 'Abinaya Ananthan' });
    await axios.post(`${BASE_URL}/fill`, { selector: 'input[name="dob"]', value: '2002-04-27' });
    await axios.post(`${BASE_URL}/click`, { selector: '#step1 .next-btn' });
    console.log("✅ Step 1 completed.");

    // Step 2 – Contact Details
    await axios.post(`${BASE_URL}/fill`, { selector: 'input[name="email"]', value: 'abinaya@example.com' });
    await axios.post(`${BASE_URL}/fill`, { selector: 'input[name="phone"]', value: '9876543210' });
    await axios.post(`${BASE_URL}/click`, { selector: '#step2 .next-btn' });
    console.log("✅ Step 2 completed.");

    // Step 3 – Preferences
    await axios.post(`${BASE_URL}/click`, { selector: 'select[name="interests"]' }); // click to open dropdown
    await axios.post(`${BASE_URL}/fill`, { selector: 'select[name="interests"]', value: 'tech' });
    await axios.post(`${BASE_URL}/click`, { selector: '#subscribeBtn' });
    await axios.post(`${BASE_URL}/click`, { selector: '#step3 .next-btn' });
    console.log("✅ Step 3 completed.");

    // Step 4 – Submit
    await axios.post(`${BASE_URL}/click`, { selector: '#step4 .submit-btn' });
    console.log("🎉 Form submitted successfully!");

  } catch (error) {
    console.error("❌ Error during automation:", error.message);
  }
})();
