(function () {
  "use strict";

  const AppConfig = window.AppConfig;

  const loginScreen = document.getElementById("login-screen");
  const settingsScreen = document.getElementById("settings-screen");
  const loginForm = document.getElementById("login-form");
  const passwordInput = document.getElementById("password-input");
  const loginError = document.getElementById("login-error");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (AppConfig.checkPassword(passwordInput.value)) {
      loginScreen.style.display = "none";
      settingsScreen.style.display = "block";
      loginError.textContent = "";
      passwordInput.value = "";
      renderMaterials(AppConfig.loadMaterials());
    } else {
      loginError.textContent = "Hibás jelszó.";
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  const materialsList = document.getElementById("materials-list");
  const addMaterialBtn = document.getElementById("add-material-btn");
  const saveBtn = document.getElementById("save-btn");
  const resetDefaultsBtn = document.getElementById("reset-defaults-btn");
  const saveStatus = document.getElementById("save-status");

  function renderMaterials(materials) {
    materialsList.innerHTML = "";
    materials.forEach(function (mat) {
      addMaterialRow(mat.name, mat.pricePerKg);
    });
    clearStatus();
  }

  function addMaterialRow(name, price) {
    const row = document.createElement("div");
    row.className = "material-row";
    row.innerHTML =
      '<input type="text" class="material-name-input" placeholder="Anyag megnevezése">' +
      '<input type="number" class="material-price-input" min="0" step="0.01" placeholder="0,00">' +
      '<button type="button" class="remove-material-btn" title="Anyag törlése">&times;</button>';

    row.querySelector(".material-name-input").value = name || "";
    row.querySelector(".material-price-input").value = typeof price === "number" ? price : "";

    row.querySelector(".remove-material-btn").addEventListener("click", function () {
      row.remove();
      clearStatus();
    });

    materialsList.appendChild(row);
  }

  function collectMaterials() {
    const rows = materialsList.querySelectorAll(".material-row");
    const materials = [];
    rows.forEach(function (row) {
      const name = row.querySelector(".material-name-input").value.trim();
      const priceRaw = row.querySelector(".material-price-input").value;
      const price = parseFloat(priceRaw);
      if (name !== "" && isFinite(price) && price >= 0) {
        materials.push({ name: name, pricePerKg: price });
      }
    });
    return materials;
  }

  function showStatus(text, isError) {
    saveStatus.textContent = text;
    saveStatus.style.color = isError ? "var(--danger)" : "var(--accent-dark)";
  }

  function clearStatus() {
    saveStatus.textContent = "";
  }

  addMaterialBtn.addEventListener("click", function () {
    addMaterialRow("", "");
    clearStatus();
  });

  saveBtn.addEventListener("click", function () {
    const materials = collectMaterials();
    if (materials.length === 0) {
      showStatus("Legalább egy érvényes anyagot adj meg (név + ár).", true);
      return;
    }
    AppConfig.saveMaterials(materials);
    renderMaterials(materials);
    showStatus("Mentve. A kalkulátor a következő belépéskor már ezt az árlistát használja.", false);
  });

  resetDefaultsBtn.addEventListener("click", function () {
    if (confirm("Biztosan visszaállítod az alapértelmezett árlistát? A mostani egyéni árak elvesznek.")) {
      AppConfig.resetMaterials();
      renderMaterials(AppConfig.loadMaterials());
      showStatus("Az alapértelmezett árlista visszaállítva.", false);
    }
  });

})();
