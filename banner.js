// Fetches the active row from the `banners` table in Supabase and renders it.
// Eddie edits the row directly in Supabase's Table Editor (message / sub_message /
// active) - no code change or redeploy needed to update or turn off the banner.
//
// Uses a direct REST call rather than the full supabase-js library, since this is
// a tiny static marketing page and doesn't need the rest of the SDK.

(function () {
  var SUPABASE_URL = "https://aphooqetvciylacztsig.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_cc_y5Q9zhmU9TM0GPIVKFA_S7T53uuN";

  var el = document.getElementById("banner");
  if (!el) return;

  var endpoint =
    SUPABASE_URL +
    "/rest/v1/banners?select=message,sub_message&active=eq.true&order=created_at.desc&limit=1";

  fetch(endpoint, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: "Bearer " + SUPABASE_ANON_KEY
    }
  })
    .then(function (res) {
      if (!res.ok) throw new Error("banner fetch failed: " + res.status);
      return res.json();
    })
    .then(function (rows) {
      if (!rows || !rows.length) return;
      var row = rows[0];
      if (!row.message) return;

      var msgEl = document.createElement("div");
      msgEl.className = "banner-msg";
      msgEl.textContent = row.message;
      el.appendChild(msgEl);

      if (row.sub_message) {
        var subEl = document.createElement("div");
        subEl.className = "banner-sub";
        subEl.textContent = row.sub_message;
        el.appendChild(subEl);
      }

      el.classList.add("show");
      fireConfettiOnce();
    })
    .catch(function (err) {
      // Fails quietly - a banner that doesn't load should never break the page
      // for a visitor trying to find the app.
      console.error("PancreaX banner:", err.message);
    });

  function fireConfettiOnce() {
    try {
      if (sessionStorage.getItem("px_confetti_seen")) return;
      sessionStorage.setItem("px_confetti_seen", "1");
    } catch (e) {
      // Private browsing / blocked storage - just skip the "once per visit" check
      // and let it fire once for this page load anyway.
    }
    if (typeof confetti !== "function") return;
    confetti({
      particleCount: 110,
      spread: 70,
      origin: { y: 0.3 },
      colors: ["#7c3aed", "#a855f7", "#ec4899", "#c4b5fd"]
    });
  }
})();
