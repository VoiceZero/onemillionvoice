window.translations = {};

window.translate = async function(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);
    const data = await response.json();
    window.translations = data;

    // Solo se presenti nella pagina
    const subtitle = document.querySelector('header p');
    if (subtitle) subtitle.textContent = data.headerSubtitle;

    const manifesto = document.querySelector('.manifesto');
    if (manifesto) {
      manifesto.innerHTML = `${data.manifestoLine1}<br>${data.manifestoLine2}<br><span>${data.manifestoAuthor}</span>`;
    }

    const cta = document.querySelector('.cta-button');
    if (cta) cta.textContent = data.ctaButton;

    const formTitle = document.querySelector('#form h2');
    if (formTitle) formTitle.textContent = data.formTitle;

    const nameLabel = document.querySelector('label[for="name"]');
    if (nameLabel) nameLabel.textContent = data.nameLabel;

    const nameInput = document.querySelector('input[name="name"]');
    if (nameInput) nameInput.placeholder = data.namePlaceholder;

    const formatLabel = document.querySelector('label[for="format"]');
    if (formatLabel) formatLabel.textContent = data.formatLabel;

    const textLabel = document.querySelector('label[for="text"]');
    if (textLabel) textLabel.textContent = data.textLabel;

    const videoLabel = document.querySelector('label[for="video"]');
    if (videoLabel) videoLabel.textContent = data.videoLabel;

    const storyLabel = document.querySelector('label[for="story"]');
    if (storyLabel) storyLabel.textContent = data.storyLabel;

    const storyInput = document.getElementById('story');
    if (storyInput) storyInput.placeholder = data.storyPlaceholder;

    const videoUpload = document.querySelector('label[for="videoUpload"]');
    if (videoUpload) videoUpload.textContent = data.videoUploadLabel;

    const anonLabel = document.getElementById('anonymous-label');
    if (anonLabel) anonLabel.textContent = data.anonymousLabel;

    const anonNote = document.getElementById('anonymous-note');
    if (anonNote) anonNote.textContent = data.anonymousNote;

    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = data.submitButton;

    const devBanner = document.querySelector('.dev-banner');
    if (devBanner) devBanner.textContent = data.devBanner;

    const msgTitle = document.getElementById('messages-title');
    if (msgTitle) msgTitle.textContent = data.messagesTitle;

  } catch (err) {
    console.error("Errore nella traduzione:", err);
  }
};
