document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const textEntry = document.getElementById("text-entry");
  const videoEntry = document.getElementById("video-entry");

  // Cambio dinamico tra Text e Video
  document.querySelectorAll('input[name="messageType"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "text") {
        textEntry.style.display = "block";
        videoEntry.style.display = "none";
      } else {
        textEntry.style.display = "none";
        videoEntry.style.display = "block";
      }
    });
  });

  // Gestione invio form
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim() || "Anonymous";
    const format = document.querySelector('input[name="messageType"]:checked')?.value;
    const story = document.getElementById("story")?.value.trim();
    const videoFile = document.getElementById("video")?.files[0];

    // Validazione
    if (format === "text" && !story) {
      alert("Please write your story.");
      return;
    }

    if (format === "video" && !videoFile) {
      alert("Please upload a video file.");
      return;
    }

    // Invio dati (solo testo per ora)
    if (format === "text") {
      fetch("https://script.google.com/macros/s/AKfycbxIp3h4jTIWzn8NYQgrbVHXVU1Fdqf7QRH1SrYdu-EeJQN9TxQRzkvn3rERhLywVchOmQ/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          message: story,
          type: "Text"
        })
      })
      .then(response => response.text())
      .then(data => {
        form.reset();
        textEntry.style.display = "block";
        videoEntry.style.display = "none";
        document.getElementById("confirmation-message").style.display = "block";
      })
      .catch(error => {
        console.error("Submission error:", error);
        alert("Something went wrong. Please try again.");
      });
    } else {
      alert("Video submission will be available soon.");
    }
  });
});
