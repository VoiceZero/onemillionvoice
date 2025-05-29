function updateTexts(lang) {
  const translations = JSON.parse(document.getElementById(`lang-${lang}`).textContent);
  window.translations = translations;
  for (const key in translations) {
    const el = document.getElementById(key);
    if (el) el.textContent = translations[key];
  }
}

document.querySelectorAll(".flag").forEach((flag) => {
  flag.addEventListener("click", () => {
    const selectedLang = flag.dataset.lang;
    document.documentElement.lang = selectedLang;
    updateTexts(selectedLang);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const defaultLang = document.documentElement.lang || "it";
  updateTexts(defaultLang);

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitButton = document.querySelector('button[type="submit"]');
      const loading = document.getElementById("loading-spinner");
      const confirmation = document.getElementById("confirmation-message");

      loading.style.display = "block";
      confirmation.style.display = "none";
      submitButton.disabled = true;
      submitButton.textContent = window.translations?.sending || "Invio in corso...";

      const nameInput = document.getElementById("name")?.value.trim();
      const anonymousChecked = document.getElementById("anonymous")?.checked;

      if (!nameInput && !anonymousChecked) {
        alert(window.translations?.errorMissingName || "Per favore inserisci il tuo nome o spunta 'Anonimo'.");
        resetButton();
        return;
      }

      const name = anonymousChecked ? "Anonymous" : nameInput;
      const story = document.getElementById("story")?.value.trim();
      const format = document.querySelector('input[name="messageType"]:checked')?.value;

      if (format === "text" && !story) {
        alert(window.translations?.errorMissingStory || "Per favore scrivi il tuo messaggio.");
        resetButton();
        return;
      }

      if (format === "video") {
        alert(window.translations?.errorVideoNotSupported || "Il formato video non è ancora supportato.");
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
        .then(() => {
          form.reset();
          confirmation.style.display = "block";
          confirmation.innerHTML = anonymousChecked
            ? window.translations?.confirmationAnon || "Messaggio inviato in forma anonima."
            : window.translations?.confirmationFull || "Grazie per aver condiviso la tua voce!";
        })
        .catch((error) => {
          alert(window.translations?.errorGeneric || "Si è verificato un errore. Riprova.");
          console.error("Error:", error);
        })
        .finally(() => {
          resetButton();
        });

      function resetButton() {
        loading.style.display = "none";
        submitButton.disabled = false;
        submitButton.textContent = window.translations?.submitButton || "Invia";
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
  }
});
