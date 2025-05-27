document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("story").value.trim();
  const type = document.querySelector('input[name="format"]:checked')?.value || "Not specified";

  if (!message) {
    alert("Please enter a message.");
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbxIp3h4jTIWzn8NYQgrbVHXVU1Fdqf7QRH1SrYdu-EeJQN9TxQRzkvn3rERhLywVchOmQ/exec", {
    method: "POST",
    body: JSON.stringify({
      name: name || "Anonymous",
      message: message,
      type: type
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.text())
  .then(data => {
    document.querySelector("form").reset();
    document.getElementById("confirmation-message").style.display = "block";
  })
  .catch(error => {
    alert("Something went wrong. Please try again.");
    console.error("Error:", error);
  });
});
