document.addEventListener("DOMContentLoaded", () => {
  const defaultLang = document.documentElement.lang || "it";
  window.translate(defaultLang);

  document.querySelectorAll("#language-selector button, .flag").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset?.lang || (btn.textContent.includes("Italiano") ? "it" : "en");
      document.documentElement.lang = lang;
      window.translate(lang);

      const title = document.getElementById("messages-title");
      if (title && window.translations?.messagesTitle) {
        title.textContent = window.translations.messagesTitle;
      }
    });
  });

  const form = document.querySelector("form");
  if (form) {
    const submitButton = document.querySelector('button[type="submit"]');
    const loading = document.getElementById("loading-spinner");
    const confirmation = document.getElementById("confirmation-message");

    document.querySelectorAll('input[name="messageType"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        const format = document.querySelector('input[name="messageType"]:checked')?.value;
        document.getElementById("text-entry").style.display = format === "text" ? "block" : "none";
        document.getElementById("video-entry").style.display = format === "video" ? "block" : "none";
      });
    });

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
        return resetButton();
      }

      const name = anonymousChecked ? "Anonymous" : nameInput;
      const story = document.getElementById("story")?.value.trim();
      const format = document.querySelector('input[name="messageType"]:checked')?.value;

      if (format === "text" && !story) {
        alert(window.translations?.errorMissingStory || "Per favore scrivi il tuo messaggio.");
        return resetButton();
      }

      if (format === "video") {
        alert(window.translations?.errorVideoNotSupported || "Il formato video non è ancora supportato.");
        return resetButton();
      }

      const timestamp = new Date().toISOString();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const payload = {
        name: name,
        message: story,
        "Message Type": format,
        timestamp: timestamp,
        timezone: timezone
      };

      console.log("Dati inviati al server:", payload);

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
          console.error("Errore:", error);
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
  }

  const grid = document.getElementById("messages-grid");
  if (grid) {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => {
        grid.innerHTML = '';
        data.forEach(msg => {
          console.log("📥 Messaggio ricevuto:", msg);

          let timestamp = "Data non valida";

          if (msg.timestamp) {
            let dateObj;

            if (!isNaN(Date.parse(msg.timestamp))) {
              dateObj = new Date(msg.timestamp);
            } else {
              const regex = /^(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{2}):(\d{2})$/;
              const match = msg.timestamp.match(regex);
              if (match) {
                const [, dd, mm, yyyy, hh, min] = match;
                const iso = `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
                dateObj = new Date(iso);
              }
            }

            if (dateObj && !isNaN(dateObj.getTime())) {
              timestamp =
                dateObj.toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) +
                " " +
                dateObj.toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit"
                });

              if (msg.timezone) {
                timestamp += ` (${msg.timezone})`;
              }
            } else {
              console.warn("⚠️ Errore parsing timestamp:", msg.timestamp);
            }
          }

          const div = document.createElement("div");
          div.className = "card";

          if (msg.type === "video") {
            div.innerHTML = `
              <video controls src="${msg.message}" class="video"></video>
              <div class="message-meta">
                <p class="name">${msg.name}</p>
                <p class="timestamp">${timestamp}</p>
              </div>`;
          } else {
            div.innerHTML = `
              <p class="message-text">"${msg.message}"</p>
              <div class="message-meta">
                <p class="name">– ${msg.name}</p>
                <p class="timestamp">${timestamp}</p>
              </div>`;
          }

          grid.appendChild(div);
        });
      })
      .catch(err => {
        grid.innerHTML = "<p>Errore nel caricamento dei messaggi.</p>";
        console.error(err);
      });
  }

  const title = document.getElementById("messages-title");
  if (title && window.translations?.messagesTitle) {
    title.textContent = window.translations.messagesTitle;
  }
});
