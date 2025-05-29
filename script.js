function updateTexts(lang) {
  const translations = JSON.parse(document.getElementById(`lang-${lang}`).textContent);
  window.translations = translations;
  for (const key in translations) {
    const el = document.getElementById(key);
    if (el) el.textContent = translations[key];
  }
}

document.querySelectorAll("#language-selector button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.textContent.includes("Italiano") ? "it" : "en";
    document.documentElement.lang = lang;
    updateTexts(lang);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const defaultLang = document.documentElement.lang || "it";
  updateTexts(defaultLang);

  const form = document.querySelector("form");
  if (form) {
    const submitButton = document.querySelector('button[type="submit"]');
    const loading = document.getElementById("loading-spinner");
    const confirmation = document.getElementById("confirmation-message");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

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

    // Selezione radio text/video
    document.querySelectorAll('input[name="messageType"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        const format = document.querySelector('input[name="messageType"]:checked')?.value;
        document.getElementById("text-entry").style.display = format === "text" ? "block" : "none";
        document.getElementById("video-entry").style.display = format === "video" ? "block" : "none";
      });
    });
  }

  // Caricamento messaggi se siamo su messages.html
  const grid = document.getElementById("messages-grid");
  if (grid) {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => {
        grid.innerHTML = '';
        data.forEach(msg => {
          const div = document.createElement("div");
          div.className = "card";
          if (msg.type === "video") {
            div.innerHTML = `<video controls src="${msg.message}" class="video"></video><p>${msg.name}</p>`;
          } else {
            div.innerHTML = `<p>"${msg.message}"</p><p><strong>– ${msg.name}</strong></p>`;
          }
          grid.appendChild(div);
        });
      })
      .catch(err => {
        grid.innerHTML = "<p>Errore nel caricamento dei messaggi.</p>";
        console.error(err);
      });
  }
});

