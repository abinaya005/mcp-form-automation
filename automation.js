const axios = require("axios");

const BASE_URL = "http://localhost:3000";

(async () => {
  try {
    await axios.post(`${BASE_URL}/start`);
    console.log("✅ Browser launched");

    await axios.post(`${BASE_URL}/goto`, {
      url: "http://localhost:3000/test-form.html",
    });

    // Step 1
    await axios.post(`${BASE_URL}/fill`, { selector: "#name", value: "Abinaya" });
    await axios.post(`${BASE_URL}/fill`, { selector: "#dob", value: "2002-04-27" });
    await axios.post(`${BASE_URL}/click`, { selector: "#next1" });

    // Step 2
    await axios.post(`${BASE_URL}/fill`, { selector: "#email", value: "abhi@example.com" });
    await axios.post(`${BASE_URL}/fill`, { selector: "#phone", value: "9876543210" });
    await axios.post(`${BASE_URL}/fill`, { selector: "#address", value: "Coimbatore" });
    await axios.post(`${BASE_URL}/click`, { selector: "#next2" });

    // Step 3
    await axios.post(`${BASE_URL}/click`, { selector: "#newsletter" });
    await axios.post(`${BASE_URL}/fill`, { selector: "#interests", value: "Tech, AI" });
    await axios.post(`${BASE_URL}/click`, { selector: "#next3" });

    // Step 4
    await axios.post(`${BASE_URL}/click`, { selector: "#submitBtn" });

    console.log("🎉 Form automation completed!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
