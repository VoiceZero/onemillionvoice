window.translations = {};

async function translate(lang) {
  try {
    localStorage.setItem('language', lang); // salva preferenza
    const response = await fetch(`lang/${lang}.json`);
    const data = await response.json();
    window.translations = data;

    // HEADER
    document.querySelector('header p').textContent = data.headerSubtitle;
    document.querySelector('.manifesto').innerHTML = `${data.manifestoLine1}<br>${data.manifestoLine2}<br><span style="font-weight: bold;">${data.manifestoAuthor}</span>`;
    document.querySelector('.cta-button').textContent = data.ctaButton;

    // FORM
    document.querySelector('#form h2').textContent = data.formTitle;
    document.querySelector('label[for="name"]').textContent = data.nameLabel;
    document.querySelector('#name').placeholder = data.namePlaceholder;

    document.querySelector('label[for="format"]').textContent = data.formatLabel;
    document.getElementById('label-text').textContent = data.textLabel;
    document.getElementById('label-video').textContent = data.videoLabel;

    document.querySelector('label[for="story"]').textContent = data.storyLabel;
    document.querySelector('#story').placeholder = data.storyPlaceholder;

    document.querySelector('label[for="videoUpload"]').textContent = data.videoUploadLabel;

    document.getElementById('anonymous-label').textContent = data.anonymousLabel;
    document.getElementById('anonymous-note').textContent = data.anonymousNote;

    document.querySelector('button[type="submit"]').textContent = data.submitButton;

    // DEV BANNER
    document.querySelector('.dev-banner').textContent = "🛠 " + (data.devBanner || "Questo progetto è in sviluppo. Resta connesso!");
  } catch (error) {
    console.error("Errore nel caricamento della lingua:", error);
  }
}

// Funzione richiamata dai bottoni
function setLang(lang) {
  translate(lang);
}

// Applica lingua al primo avvio (o ricorda da localStorage)
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("language") || "it";
  translate(savedLang);
});
