document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const story = document.getElementById('story')?.value.trim();
  const videoFile = document.getElementById('video')?.files[0];
  const format = document.querySelector('input[name="format"]:checked').value;

  if (format === 'text' && !story) {
    alert("Please enter your story.");
    return;
  }

  if (format === 'video' && !videoFile) {
    alert("Please select a video file.");
    return;
  }

  const formData = {
    name: name || "Anonymous",
    type: format,
    message: format === 'text' ? story : '(video uploaded)'
  };

  fetch("https://script.google.com/macros/s/AKfycbxIp3h4jTIWzn8NYQgrbVHXVU1Fdqf7QRH1SrYdu-EeJQN9TxQRzkvn3rERhLywVchOmQ/exec", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json"
    }
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

// 👇 Cambio dinamico formato text/video
document.querySelectorAll('input[name="format"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const format = document.querySelector('input[name="format"]:checked').value;
    document.getElementById('text-entry').style.display = format === 'text' ? 'block' : 'none';
    document.getElementById('video-entry').style.display = format === 'video' ? 'block' : 'none';
  });
});
