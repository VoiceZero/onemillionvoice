document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitButton = document.querySelector('button[type="submit"]');
    const loading = document.getElementById("loading-spinner");
    const confirmation = document.getElementById("confirmation-message");

    loading.style.display = "block";
    confirmation.style.display = "none";
    submitButton.disabled = true;
    submitButton.textContent = window.translations.sending;

    const nameInput = document.getElementById("name")?.value.trim();
    const anonymousChecked = document.getElementById("anonymous")?.checked;

    if (!nameInput && !anonymousChecked) {
      alert(window.translations.errorMissingName);
      resetButton();
      return;
    }

    const name = anonymousChecked ? "Anonymous" : nameInput;
    const story = document.getElementById("story")?.value.trim();
    const format = document.querySelector('input[name="messageType"]:checked')?.value;

    if (format === "text" && !story) {
      alert(window.translations.errorMissingStory);
      resetButton();
      return;
    }

    if (format === "video") {
      alert(window.translations.errorVideoNotSupported);
      resetButton();
      return;
    }

    const payload = {
      name: name,
      message: story,
      messageType: format,
    };

    fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.text())
      .then((data) => {
        form.reset();
        confirmation.style.display = "block";
        confirmation.innerHTML = anonymousChecked
          ? window.translations.confirmationAnon
          : window.translations.confirmationFull;
      })
      .catch((error) => {
        alert(window.translations.errorGeneric);
        console.error("Error:", error);
      })
      .finally(() => {
        resetButton();
      });

    function resetButton() {
      loading.style.display = "none";
      submitButton.disabled = false;
      submitButton.textContent = window.translations.submitButton;
    }
  });

  // Switch tra testo e video
  document.querySelectorAll('input[name="messageType"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const format = document.querySelector('input[name="messageType"]:checked')?.value;
      document.getElementById("text-entry").style.display = format === "text" ? "block" : "none";
      document.getElementById("video-entry").style.display = format === "video" ? "block" : "none";
    });
  });
});


