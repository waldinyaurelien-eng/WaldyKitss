// ===== WaldyKits Shop Page Logic =====

let wkActiveLeague = "all";
let wkActiveKit = "all";
let wkSearchTerm = "";

function wkMatchesFilters(product) {
  const leagueOk = wkActiveLeague === "all" || product.league === wkActiveLeague;
  const kitOk = wkActiveKit === "all" || product.kit === wkActiveKit;
  const searchOk = wkSearchTerm === "" || product.name.toLowerCase().includes(wkSearchTerm.toLowerCase());
  return leagueOk && kitOk && searchOk;
}

function wkProductCardHTML(product) {
  const badgeClass = product.badge && product.badge.toLowerCase().includes("new") ? "product-badge new" : "product-badge";
  const priceFormatted = product.price.toLocaleString();
  return `
    <div class="product-card">
      <div class="product-img" data-video-id="${product.id}">
        <img src="${product.img}" alt="${product.name}" style="${product.id === 'chelsea-home-2526' ? 'object-fit: contain; object-position: center;' : ''}" />
        ${product.badge ? `<span class="${badgeClass}">${product.badge}</span>` : ""}
        <span class="play-hint">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px;"><path d="M8 5C8 3.34 9.79 2.4 11.12 3.33l8.56 5.98a2 2 0 0 1 0 3.38l-8.56 5.98C9.79 19.6 8 18.66 8 17V5z"/></svg>
        </span>
      </div>
      <div class="product-info">
        <div class="product-league">${product.league === "Haiti" ? "Ekip Nasyonal Ayiti" : product.league === "International" ? "Entènasyonal" : product.league}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-kit">Mayo ${product.kit}</div>
        <div class="product-footer">
          <div class="product-price">${priceFormatted}<small>Goud (HTG)</small></div>
          <div class="product-actions">
            <a class="wa-btn" data-wa-id="${product.id}" target="_blank" rel="noopener" aria-label="Kòmande sou WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <button class="add-btn" data-add-id="${product.id}" aria-label="Ajoute nan panyen">+</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function wkFindProduct(id) {
  return WK_CLUB_PRODUCTS.find(p => p.id === id) || WK_INTL_PRODUCTS.find(p => p.id === id);
}

function wkRenderGrid(gridId, noResultsId, products) {
  const grid = document.getElementById(gridId);
  const noResults = document.getElementById(noResultsId);
  const filtered = products.filter(wkMatchesFilters);
  if (filtered.length === 0) {
    grid.innerHTML = "";
    grid.style.display = "none";
    noResults.style.display = "block";
  } else {
    grid.style.display = "grid";
    noResults.style.display = "none";
    grid.innerHTML = filtered.map(wkProductCardHTML).join("");
  }
}

function wkRenderAll() {
  wkRenderGrid("clubGrid", "clubNoResults", WK_CLUB_PRODUCTS);
  wkRenderGrid("intlGrid", "intlNoResults", WK_INTL_PRODUCTS);
  wkAttachCardEvents();
}

function wkAttachCardEvents() {
  // WhatsApp direct order buttons
  document.querySelectorAll("[data-wa-id]").forEach(link => {
    const product = wkFindProduct(link.getAttribute("data-wa-id"));
    if (!product) return;
    const message = `Bonjou! Mwen vle achte mayo "${product.name}" (Mayo ${product.kit}) pou ${product.price} HTG nan WaldyKits.`;
    link.href = `https://wa.me/50940303686?text=${encodeURIComponent(message)}`;
    link.addEventListener("click", function (e) { e.stopPropagation(); });
  });

  // Add to cart buttons
  document.querySelectorAll("[data-add-id]").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const product = wkFindProduct(this.getAttribute("data-add-id"));
      if (!product) return;
      wkAddToCart({ id: product.id, name: product.name, price: product.price, img: product.img, kit: product.kit });
      this.classList.add("added");
      this.textContent = "✓";
      setTimeout(() => { this.classList.remove("added"); this.textContent = "+"; }, 1200);
    });
  });

  // Click image → zoom popup
  document.querySelectorAll("[data-video-id]").forEach(imgWrap => {
    imgWrap.addEventListener("click", function () {
      const product = wkFindProduct(this.getAttribute("data-video-id"));
      if (product) wkOpenZoom(product);
    });
  });
}

function wkOpenZoom(product) {
  const overlay = document.getElementById("videoOverlay");
  const box = document.getElementById("videoBox");
  box.innerHTML = `
    <button class="video-close" id="videoCloseBtn" aria-label="Fèmen">&times;</button>
    <img src="${product.img}" alt="${product.name}"
      style="width:100%; max-height:78vh; object-fit:contain; display:block; background:#111; border-radius:12px;" />
    <div class="video-caption">${product.name} &nbsp;·&nbsp; ${product.price.toLocaleString()} HTG</div>
  `;
  overlay.classList.add("open");
  document.getElementById("videoCloseBtn").addEventListener("click", wkCloseZoom);
}

function wkCloseZoom() {
  document.getElementById("videoOverlay").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", function () {
  wkRenderAll();

  // Pre-fill search from homepage hero search bar (?search=...)
  const searchInput = document.getElementById("searchInput");
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get("search");
  if (initialSearch) {
    searchInput.value = initialSearch;
    wkSearchTerm = initialSearch;
    wkRenderAll();
  }
  searchInput.addEventListener("input", function () {
    wkSearchTerm = this.value.trim();
    wkRenderAll();
  });

  // League filters
  document.querySelectorAll("#leagueFilters .filter-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll("#leagueFilters .filter-tab").forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      wkActiveLeague = this.getAttribute("data-league");
      wkRenderAll();
    });
  });

  // Kit filters
  document.querySelectorAll("#kitFilters .filter-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll("#kitFilters .filter-tab").forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      wkActiveKit = this.getAttribute("data-kit");
      wkRenderAll();
    });
  });

  // Click overlay backdrop to close zoom
  document.getElementById("videoOverlay").addEventListener("click", function (e) {
    if (e.target === this) wkCloseZoom();
  });
});