document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim() || "Anonymous";
  const story = document.getElementById('story')?.value.trim();
  const videoFile = document.getElementById('video')?.files[0];
  const format = document.querySelector('input[name="messageType"]:checked')?.value;

  if (format === 'text' && !story) {
    alert("Please enter your story.");
    return;
  }

  if (format === 'video') {
    alert("📽️ Video format is not yet supported. Only text messages are stored for now.");
    return;
  }

  const payload = {
    name: name,
    message: story,
    messageType: format
  };

  fetch("https://script.google.com/macros/s/AKfycbxIp3h4jTIWzn8NYQgrbVHXVU1Fdqf7QRH1SrYdu-EeJQN9TxQRzkvn3rERhLywVchOmQ/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.text())
    .then(data => {
      document.querySelector('form').reset();
      document.getElementById("confirmation-message").style.display = "block";
    })
    .catch(error => {
      alert("Something went wrong. Please try again.");
      console.error("Error:", error);
    });
});

// Cambio dinamico tra text e video
document.querySelectorAll('input[name="messageType"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const format = document.querySelector('input[name="messageType"]:checked')?.value;
    document.getElementById('text-entry').style.display = format === 'text' ? 'block' : 'none';
    document.getElementById('video-entry').style.display = format === 'video' ? 'block' : 'none';
  });
});
