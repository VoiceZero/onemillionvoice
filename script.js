document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim() || "Anonymous";
  const story = document.getElementById('story')?.value.trim();
  const videoFile = document.getElementById('video')?.files[0];
  const format = document.querySelector('input[name="messageType"]:checked')?.value;

  // ✅ Validazione testo
  if (format === 'text' && !story) {
    alert("Please enter your story.");
    return;
  }

  // ⚠️ Video non ancora supportato (messaggio informativo)
  if (format === 'video') {
    alert("📽️ Video format is not yet supported. Only text messages are stored for now.");
    return;
  }

  // ✅ Dati da inviare
  const payload = {
    name: name,
    message: story,
    type: format  // ✅ ATTENZIONE: deve essere "type", non "messageType"
  };

  // ✅ Invio al Google Apps Script
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

// 👇 Cambia visibilità dei campi in base al tipo selezionato
document.querySelectorAll('input[name="messageType"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const format = document.querySelector('input[name="messageType"]:checked')?.value;
    document.getElementById('text-entry').style.display = format === 'text' ? 'block' : 'none';
    document.getElementById('video-entry').style.display = format === 'video' ? 'block' : 'none';
  });
});
