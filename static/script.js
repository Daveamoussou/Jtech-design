// ---------- Données des services et de leurs options ----------
const SERVICES = {
  os: {
    titre: "Systèmes d'exploitation",
    options: [
      "Windows 8",
      "Windows 10",
      "Windows 11 (22H2)",
      "Windows 11 (24H2)",
      "Windows 11 (25H2)",
    ],
  },
  office: {
    titre: "Suite Office",
    options: ["Office 2016", "Office 2019", "Office 2021"],
  },
  utilitaires: {
    titre: "Utilitaires",
    options: ["VLC", "Google Chrome", "Google"],
  },
};

const overlay = document.getElementById("orbit-overlay");
const orbitItems = document.getElementById("orbit-items");
const orbitTitle = document.getElementById("orbit-title");
const orbitClose = document.getElementById("orbit-close");
const selectionRecap = document.getElementById("selection-recap");
const messageField = document.getElementById("message");

// ---------- Ouverture de la fenêtre circulaire ----------
function ouvrirOrbit(cle) {
  const service = SERVICES[cle];
  if (!service) return;

  orbitTitle.textContent = service.titre;
  orbitItems.innerHTML = "";

  const total = service.options.length;
  const rayon = 42; // distance du centre en % du diamètre de la sphère

  service.options.forEach((option, index) => {
    // Répartition équitable des options sur le cercle (360° / nombre d'options)
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = 50 + rayon * Math.cos(angle);
    const y = 50 + rayon * Math.sin(angle);

    const bouton = document.createElement("button");
    bouton.className = "orbit-item";
    bouton.textContent = option;
    bouton.style.left = x + "%";
    bouton.style.top = y + "%";
    bouton.style.animationDelay = index * 0.05 + "s";

    bouton.addEventListener("click", () => {
      choisirOption(service.titre, option);
    });

    orbitItems.appendChild(bouton);
  });

  overlay.classList.remove("hidden");
}

function fermerOrbit() {
  overlay.classList.add("hidden");
}

// ---------- Sélection d'une option ----------
function choisirOption(categorie, option) {
  selectionRecap.textContent = `Sélection : ${categorie} — ${option}`;
  selectionRecap.classList.remove("hidden");

  if (!messageField.value.includes(option)) {
    messageField.value = messageField.value
      ? messageField.value + `\nSouhaite : ${categorie} — ${option}`
      : `Souhaite : ${categorie} — ${option}`;
  }

  fermerOrbit();
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
}

// ---------- Écouteurs ----------
document.querySelectorAll(".card").forEach((carte) => {
  carte.addEventListener("click", () => {
    ouvrirOrbit(carte.dataset.service);
  });
});

orbitClose.addEventListener("click", fermerOrbit);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) fermerOrbit();
});

// ---------- Formulaire de contact ----------
document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nom = document.getElementById("nom").value;
  const email = document.getElementById("email").value;
  const message = messageField.value;

  const confirmation = document.getElementById("confirmation");

  try {
    const reponse = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, email, message }),
    });

    const resultat = await reponse.json();

    if (resultat.succes) {
      confirmation.textContent = "Merci ! Votre message a bien été envoyé.";
      confirmation.style.color = "#4dd97f";
      this.reset();
      selectionRecap.classList.add("hidden");
    } else {
      confirmation.textContent = "Erreur : " + resultat.erreur;
      confirmation.style.color = "#ff6b6b";
    }
  } catch (erreur) {
    confirmation.textContent = "Impossible de contacter le serveur.";
    confirmation.style.color = "#ff6b6b";
    console.error(erreur);
  }

  confirmation.classList.remove("hidden");
});
  
