// lang.js

const translations = {
  it: {
    headerTitle: "OneMillionVoices",
    headerSubtitle: "Un milione di voci. Una alla volta.",
    manifestoLine1: "Ogni voce che non viene ascoltata resta un’eco dentro il silenzio.",
    manifestoLine2: "Questa è la mia. La prima. E non sarà l’ultima.",
    manifestoAuthor: "– VoiceZero",
    ctaButton: "Condividi la tua voce",
    formTitle: "Invia la tua voce",
    nameLabel: "Nome o nickname",
    namePlaceholder: "Anonimo se preferisci",
    formatLabel: "Scegli il formato:",
    textLabel: "Testo",
    videoLabel: "Video",
    storyLabel: "La tua storia (max 100 parole)",
    storyPlaceholder: "Scrivi qui la tua storia...",
    videoUploadLabel: "Carica il tuo video (max 60 sec)",
    anonymousLabel: "Rimani anonimo",
    anonymousNote: "La tua voce può restare anonima, ma non sarà mai ignorata.",
    submitButton: "Invia",
    confirmation: "Grazie. La tua voce è stata registrata. È parte di qualcosa che resterà per sempre.",
    errorMissingName: "Inserisci il nome o seleziona 'Rimani anonimo'.",
    errorMissingStory: "Per favore scrivi la tua storia.",
    errorVideoNotSupported: "📽️ Il formato video non è ancora supportato. Solo i testi vengono salvati al momento.",
    errorGeneric: "Qualcosa è andato storto. Riprova.",
    sending: "Invio in corso..."
  }
};

function translate(lang = 'it') {
  const t = translations[lang];

  document.querySelector("h1").textContent = t.headerTitle;
  document.querySelector("header p").textContent = t.headerSubtitle;
  document.querySelector(".manifesto").innerHTML = `
    “${t.manifestoLine1}<br>${t.manifestoLine2}”<br>
    <span style="opacity: 0.7;">${t.manifestoAuthor}</span><br><br>
    <em>“${t.manifestoLine1}<br>${t.manifestoLine2}”</em><br>
    <span style="opacity: 0.6;">${t.manifestoAuthor}</span>
  `;
  document.querySelector(".cta-button").textContent = t.ctaButton;
  document.querySelector("h2").textContent = t.formTitle;

  document.querySelector('label[for="name"]').textContent = t.nameLabel;
  document.querySelector('#name').placeholder = t.namePlaceholder;

  document.querySelector('label[for="format"]').textContent = t.formatLabel;
  document.querySelector('input[value="text"]').nextSibling.textContent = " " + t.textLabel;
  document.querySelector('input[value="video"]').nextSibling.textContent = " " + t.videoLabel;

  document.querySelector('label[for="story"]').textContent = t.storyLabel;
  document.querySelector('#story').placeholder = t.storyPlaceholder;

  document.querySelector('label[for="video"]').textContent = t.videoUploadLabel;

  document.querySelector('label[for="anonymous"]').textContent = t.anonymousLabel;
  document.getElementById("anonymous-note").textContent = t.anonymousNote;

  document.querySelector('button[type="submit"]').textContent = t.submitButton;
}
