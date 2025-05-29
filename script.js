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
          const div = document.createElement("div");
          div.className = "card";

          // FIX TIMESTAMP ROBUSTO
          let timestamp = "";
          if (msg.timestamp) {
            const parts = msg.timestamp.split(/[\s,]+/); // split su spazio e virgola
            const [part1, part2] = parts;
            let day, month, year, time;

            if (part1?.includes("/")) {
              const split = part1.split("/");
              if (split.length === 3) {
                // formato DD/MM/YYYY o MM/DD/YYYY
                if (split[0].length === 4) {
                  // Y/M/D => inusuale
                  year = split[0]; month = split[1]; day = split[2];
                } else if (split[2].length === 4) {
                  // D/M/Y
                  day = split[0]; month = split[1]; year = split[2];
                }
              }
            }

            time = part2 || "";

            if (day && month && year && time) {
              const isoString = `${year.padStart(4, "20")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${time}`;
              const dateObj = new Date(isoString);
              if (!isNaN(dateObj)) {
                timestamp = dateObj.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }) +
                            " " +
                            dateObj.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
              } else {
                timestamp = "Data non valida";
              }
            } else {
              timestamp = "Data non valida";
            }
          }

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
