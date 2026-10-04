/* Temporary: prints the probe results extracted from the dumped DOM. */
const fs = require('fs');
const h = fs.readFileSync(__dirname + '/_probe_dom.html', 'utf8');
const m = h.match(/<pre id="__probe">([\s\S]*?)<\/pre>/);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
fs.writeFileSync(__dirname + '/_probe_out.txt',
  (m ? decode(m[1]) : 'NO PROBE OUTPUT FOUND') + '\nDOM_BYTES=' + h.length + '\n');
