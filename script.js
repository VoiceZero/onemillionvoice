document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  // ⏳ Spinner + blocco bottone
  document.getElementById('loading-spinner').style.display = 'block';
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  const nameInput = document.getElementById('name').value.trim();
  const anonymousChecked = document.getElementById('anonymous-checkbox').checked;

  // ✅ Controllo nome obbligatorio se NON anonimo
  if (!nameInput && !anonymousChecked) {
    alert("Per favore inserisci un nome o seleziona 'Stay anonymous'.");
    document.getElementById('loading-spinner').style.display = 'none';
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
    return;
  }

  const name = anonymousChecked ? "Anonymous" : nameInput;
  const story = document.getElementById('story')?.value.trim();
  const format = document.querySelector('input[name="messageType"]:checked')?.value;

  if (format === 'text' && !story) {
    alert("Please enter your story.");
    document.getElementById('loading-spinner').style.display = 'none';
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
    return;
  }

  if (format === 'video') {
    alert("📽️ Video format is not yet supported. Only text messages are stored for now.");
    document.getElementById('loading-spinner').style.display = 'none';
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
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
    const confirmation = document.getElementById("confirmation-message");
    confirmation.style.display = "block";
    confirmation.innerHTML = anonymousChecked
      ? `Grazie. <strong>La tua voce può restare anonima, ma non sarà mai ignorata.</strong><br>È parte di qualcosa che resterà per sempre.`
      : `Grazie. La tua voce è stata registrata.<br>È parte di qualcosa che resterà per sempre.`;
  })
  .catch(error => {
    alert("Something went wrong. Please try again.");
    console.error("Error:", error);
  })
  .finally(() => {
    document.getElementById('loading-spinner').style.display = 'none';
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
<script src="lang.js"></script>
<script>
  translate('it'); // Applicazione iniziale della lingua italiana
</script>
