/* Temporary: builds _probe.html (index.html + an automated interaction probe). */
const fs = require('fs');
const path = require('path');

const root = __dirname;
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const probe = `
<script>
(function () {
  var out = [];
  function log(k, v) { out.push(k + ' = ' + v); }
  function display(id) { return getComputedStyle(document.getElementById(id)).display; }

  setTimeout(function () {
    /* --- 1. overlay must not block the page on load --- */
    log('lightbox_display_on_load', display('lightbox'));
    log('toast_display_on_load', display('toast'));
    log('nav_overlay_display_on_load', display('navOverlay'));

    /* --- 2. contact-form icons --- */
    log('info_icons_svg_count', document.querySelectorAll('.info-list__icon svg').length);

    /* --- 3. gallery lightbox opens then closes --- */
    document.querySelector('.gallery__item').click();
    log('lightbox_display_after_open', display('lightbox'));
    document.getElementById('lightboxClose').click();
    log('lightbox_display_after_close', display('lightbox'));

    /* --- 4. empty form submit shows inline errors --- */
    var form = document.getElementById('reservationForm');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    log('errors_on_empty_submit', document.querySelectorAll('.field.has-error').length);
    log('name_error_text', (document.querySelector('[data-error-for="name"]') || {}).textContent);

    /* --- 5. invalid email is rejected --- */
    document.getElementById('resName').value = 'Jane Doe';
    document.getElementById('resPhone').value = '+1 555 111 2222';
    document.getElementById('resEmail').value = 'not-an-email';
    document.getElementById('resDate').value = '2030-05-20';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    log('bad_email_error', (document.querySelector('[data-error-for="email"]') || {}).textContent);

    /* --- 6. valid submit succeeds --- */
    document.getElementById('resEmail').value = 'jane@example.com';
    document.getElementById('resTime').value = '19:30';
    document.getElementById('resGuests').value = '4 guests';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    log('errors_after_valid_submit', document.querySelectorAll('.field.has-error').length);

    setTimeout(function () {
      var t = document.getElementById('toast');
      log('toast_shown_after_submit', t.classList.contains('is-shown'));
      log('toast_is_success', t.classList.contains('toast--ok'));
      log('toast_message', (t.textContent || '').trim());
      log('name_field_value_after_submit', '[' + document.getElementById('resName').value + ']');
      log('email_field_value_after_submit', '[' + document.getElementById('resEmail').value + ']');
      log('time_field_value_after_submit', '[' + document.getElementById('resTime').value + ']');
      log('date_field_value_after_submit', '[' + document.getElementById('resDate').value + ']');
      log('guests_field_value_after_submit', '[' + document.getElementById('resGuests').value + ']');
      log('submit_button_enabled', !document.getElementById('resSubmit').disabled);
      log('submit_button_label', document.getElementById('resSubmit').textContent.trim());

      /* --- 7. menu tab filter works --- */
      var pastaTab = document.querySelector('.tab[data-cat="pasta"]');
      pastaTab.click();
      setTimeout(function () {
        log('cards_after_pasta_filter', document.querySelectorAll('.menu-card').length);
        log('active_tab', (document.querySelector('.tab.is-active') || {}).textContent);

        var pre = document.createElement('pre');
        pre.id = '__probe';
        pre.textContent = '\\n' + out.join('\\n') + '\\n';
        document.body.appendChild(pre);
      }, 400);
    }, 1400);
  }, 1600);
})();
</script>
`;

html = html.replace('</body>', probe + '</body>');
fs.writeFileSync(path.join(root, '_probe.html'), html);
console.log('Wrote _probe.html');
