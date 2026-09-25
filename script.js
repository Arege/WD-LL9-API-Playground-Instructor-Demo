/* ============================================================
   COUNTRY EXPLORER — INSTRUCTOR DEMO
   ------------------------------------------------------------
   Live-code Steps 1-6 here with the class. Stop after Step 6
   and hand off to teams for Steps 7-10 (student-starter file).

   THE PATTERN (say this out loud at the end):
     1. Get user input
     2. Fetch data from an API
     3. Convert the response to JSON
     4. Pull the piece of data you need off the response
     5. Drop it into the page with .textContent / .src
   ============================================================ */

// --- Element references (already grabbed for you) -------------
const searchBtn     = document.getElementById('searchBtn');
const countryInput  = document.getElementById('countryInput');
const loadingEl      = document.getElementById('loading');
const errorEl        = document.getElementById('errorMessage');
const resultCard     = document.getElementById('resultCard');

const flagImg        = document.getElementById('flagImg');
const countryNameEl  = document.getElementById('countryName');
const capitalEl      = document.getElementById('capitalValue');
const regionEl       = document.getElementById('regionValue');
const populationEl   = document.getElementById('populationValue');
const languagesEl    = document.getElementById('languagesValue');


/* ------------------------------------------------------------
   STEP 1: Connect the button's click event.
   ------------------------------------------------------------ */
searchBtn.addEventListener('click', fetchCountry);
countryInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    fetchCountry();
  }
});


/* ------------------------------------------------------------
   STEP 2: Create fetchCountry()
   ------------------------------------------------------------ */
async function fetchCountry() {
  const name = countryInput.value.trim();
  if (!name) return;

  /* ------------------------------------------------------------
     STEP 3: Show "Loading..."
     ------------------------------------------------------------ */
  showLoading();

  /* ------------------------------------------------------------
     STEP 4: Build the fetch request
     Endpoint: https://restcountries.com/v3.1/name/{name}?fullText=true
     ------------------------------------------------------------ */
  try {
    let response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
    if (!response.ok) {
      // Fallback to fuzzy search if exact match isn't found
      response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
    }

    if (!response.ok) {
      throw new Error(`Country "${name}" not found. Chart another course.`);
    }

    /* ------------------------------------------------------------
       STEP 5: Convert response -> JSON
       ------------------------------------------------------------ */
    const data = await response.json();
    const country = data[0];

    /* ------------------------------------------------------------
       STEP 6: Display ONE property. Start simple.
       Display only: Country Name. Then STOP.

       Say to the class: "Everything else we build today follows
       this exact pattern."
       ------------------------------------------------------------ */
    countryNameEl.textContent = country.name?.common || country.name?.official || name;

    // Populate full field guide report card
    if (flagImg) {
      flagImg.src = country.flags?.svg || country.flags?.png || '';
      flagImg.alt = country.flags?.alt || `Flag of ${country.name?.common || name}`;
    }

    if (capitalEl) {
      capitalEl.textContent = Array.isArray(country.capital) && country.capital.length > 0
        ? country.capital.join(', ')
        : (country.capital || '—');
    }

    if (regionEl) {
      regionEl.textContent = country.region || '—';
    }

    if (populationEl) {
      populationEl.textContent = country.population ? country.population.toLocaleString() : '—';
    }

    if (languagesEl) {
      languagesEl.textContent = country.languages
        ? Object.values(country.languages).join(', ')
        : '—';
    }

    hideLoading();
    resultCard.classList.remove('hidden');
  } catch (error) {
    hideLoading();
    errorEl.textContent = error.message || 'Unable to fetch dispatch report. Please try again.';
    errorEl.classList.remove('hidden');
  }
}


/* ------------------------------------------------------------
   Helper functions — already built for you, use them in Step 3
   and beyond however you like.
   ------------------------------------------------------------ */
function showLoading() {
  loadingEl.classList.remove('hidden');
  errorEl.classList.add('hidden');
  resultCard.classList.add('hidden');
}

function hideLoading() {
  loadingEl.classList.add('hidden');
}
