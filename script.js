document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();
// ⏳ Mostra spinner e disabilita il pulsante
document.getElementById('loading-spinner').style.display = 'block';
const submitButton = document.querySelector('button[type="submit"]');
submitButton.disabled = true;
submitButton.textContent = "Sending...";

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

  fetch("/api/submit", {
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
.finally(() => {
  // ✅ Nascondi spinner e riattiva pulsante
  document.getElementById('loading-spinner').style.display = 'none';
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = false;
  submitButton.textContent = "Submit";
});

});

// Cambio dinamico text/video
document.querySelectorAll('input[name="messageType"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const format = document.querySelector('input[name="messageType"]:checked')?.value;
    document.getElementById('text-entry').style.display = format === 'text' ? 'block' : 'none';
    document.getElementById('video-entry').style.display = format === 'video' ? 'block' : 'none';
  });
});
