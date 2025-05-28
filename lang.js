async function translate(lang = 'it') {
  try {
    const res = await fetch(`lang/${lang}.json`);
    const t = await res.json();

    document.querySelector("h1").textContent = t.headerTitle;
    document.querySelector("header p").textContent = t.headerSubtitle;
    document.querySelector(".manifesto").innerHTML = `
      “${t.manifestoLine1}<br>${t.manifestoLine2}”<br>
      <span style="opacity: 0.7;">${t.manifestoAuthor}</span>
    `;
    document.querySelector(".cta-button").textContent = t.ctaButton;
    document.querySelector("h2").textContent = t.formTitle;

    document.querySelector('label[for="name"]').textContent = t.nameLabel;
    document.querySelector('#name').placeholder = t.namePlaceholder;

    document.querySelector('label[for="format"]').textContent = t.formatLabel;
    document.querySelector('label[for="text"]').textContent = t.textLabel;
    document.querySelector('label[for="video"]').textContent = t.videoLabel;

    document.querySelector('label[for="story"]').textContent = t.storyLabel;
    document.querySelector('#story').placeholder = t.storyPlaceholder;

    document.querySelector('label[for="videoUpload"]').textContent = t.videoUploadLabel;

    document.querySelector('label[for="anonymous"]').textContent = t.anonymousLabel;
    document.getElementById("anonymous-note").textContent = t.anonymousNote;

    document.querySelector('button[type="submit"]').textContent = t.submitButton;

    // Salva l’intero oggetto in una variabile globale per riutilizzarlo in script.js
    window.translations = t;

  } catch (err) {
    console.error("Errore nel caricamento lingua:", err);
  }
}
