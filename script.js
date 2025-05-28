document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  // ⏳ Spinner + blocco bottone
  document.getElementById('loading-spinner').style.display = 'block';
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = window.translations.sending;

  const nameInput = document.getElementById('name').value.trim();
  const anonymousChecked = document.getElementById('anonymous').checked;

  // ✅ Controllo nome obbligatorio se NON anonimo
  if (!nameInput && !anonymousChecked) {
    alert(window.translations.errorMissingName);
    document.getElementById('loading-spinner').style.display = 'none';
    submitButton.disabled = false;
    submitButton.textContent = window.translations.submitButton;
    return;
  }

  const name = anonymousChecked ? "Anonymous" : nameInput;
  const story = document.getElementById('story')?.value.trim();
  const format = document.querySelector('input[name="messageType"]:checked')?.value;

  if (format === 'text' && !story) {
    alert(window.translations.errorMissingStory);
    document.getElementById('loading-spinner').style.display = 'none';
    submitButton.disabled = false;
    submitButton.textContent = window.translations.submitButton;
    return;
  }

  if (format === 'video') {
    alert(window.translations.errorVideoNotSupported);
    document.getElementById('loading-spinner').style.display = 'none';
    submitButton.disabled = false;
    submitButton.textContent = window.translations.submitButton;
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
      ? `<strong>${window.translations.anonymousNote}</strong><br>${window.translations.confirmation}`
      : window.translations.confirmation;
  })
  .catch(error => {
    alert(window.translations.errorGeneric);
    console.error("Error:", error);
  })
  .finally(() => {
    document.getElementById('loading-spinner').style.display = 'none';
    submitButton.disabled = false;
    submitButton.textContent = window.translations.submitButton;
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
