/**
 * Comparison table component for blog articles.
 * Renders a feature comparison table from JSON data.
 * Usage: <div data-comparison-table data-competitor="launchie"></div>
 */
(function () {
  const CELL_STYLE = 'padding:12px 18px;border-bottom:1px solid rgba(255,255,255,0.12);color:#e6f1fa;font-size:15px;';
  const CELL_LAST_STYLE = 'padding:12px 18px;border-bottom:none;color:#e6f1fa;font-size:15px;';
  const CELL_CENTER = 'text-align:center;';
  const TH_STYLE = 'background:#1a2d42;color:#e6f1fa;font-weight:600;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.12);font-size:15px;';
  const TABLE_STYLE = 'width:100%;border-collapse:collapse;background:#0f2536;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.12);';
  const CAPTION_STYLE = 'text-align:left;font-size:18px;font-weight:700;padding:16px 18px;background:rgba(255,255,255,0.04);color:#e6f1fa;border-bottom:1px solid rgba(255,255,255,0.12);';
  const WRAPPER_STYLE = 'margin:32px 0;width:100%;overflow-x:auto;';

  function renderTable(container, data, competitor) {
    if (!data || !data.features || !data.competitors || !competitor) return;
    const comp = data.competitors[competitor];
    if (!comp) return;

    const competitorName = comp.name || competitor;
    const overrides = comp.overrides || {};
    const features = data.features;
    const last = features.length - 1;

    let html = '<div class="blog-comparison-table-wrap" style="' + WRAPPER_STYLE + '">';
    html += '<table class="blog-comparison-table" aria-label="Features comparison LaunchMe vs ' + escapeHtml(competitorName) + '" style="' + TABLE_STYLE + '">';
    html += '<caption style="' + CAPTION_STYLE + '">Features comparison LaunchMe vs ' + escapeHtml(competitorName) + '</caption>';
    html += '<thead><tr>';
    html += '<th scope="col" style="' + TH_STYLE + 'text-align:left;">Features</th>';
    html += '<th scope="col" style="' + TH_STYLE + 'text-align:center;">LaunchMe</th>';
    html += '<th scope="col" style="' + TH_STYLE + 'text-align:center;">' + escapeHtml(competitorName) + '</th>';
    html += '</tr></thead><tbody>';

    features.forEach(function (row, i) {
      const feature = row[0];
      const launchMe = row[1];
      const compVal = overrides[feature] !== undefined ? overrides[feature] : '–';
      const rowStyle = i === last ? CELL_LAST_STYLE : CELL_STYLE;
      const tdCenter = rowStyle + CELL_CENTER;
      html += '<tr>';
      html += '<td style="' + rowStyle + '">' + escapeHtml(feature) + '</td>';
      html += '<td style="' + tdCenter + '">' + escapeHtml(launchMe) + '</td>';
      html += '<td style="' + tdCenter + '">' + escapeHtml(compVal) + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function init() {
    const containers = document.querySelectorAll('[data-comparison-table]');
    if (containers.length === 0) return;

    var firstEl = document.querySelector('[data-comparison-table]');
    var dataPath = (firstEl && firstEl.getAttribute('data-source')) || 'data/comparison-data.json';
    fetch(dataPath)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        containers.forEach(function (el) {
          const competitor = el.getAttribute('data-competitor');
          if (competitor) renderTable(el, data, competitor);
        });
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
