function applyConfig() {
  document.title = `${CONFIG.eventTitle} - ${CONFIG.eventSubtitle}`;
  document.getElementById('event-logo').src = CONFIG.eventLogo;
  document.getElementById('event-title').textContent = CONFIG.eventTitle;
  document.getElementById('event-subtitle').textContent = CONFIG.eventSubtitle;
  document.getElementById('scores-label').textContent = CONFIG.scoresLabel;
  document.getElementById('event-date').textContent = CONFIG.eventDate;

  const toggle = document.getElementById('score-toggle');
  CONFIG.tabs.forEach((tab, i) => {
    const btn = document.createElement('button');
    const isDefault = tab.default || (i === 0 && !CONFIG.tabs.some(t => t.default));
    btn.className = 'toggle-btn' + (isDefault ? ' active' : '');
    btn.dataset.tab = tab.sheet;
    btn.textContent = tab.name;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadSheetData(tab.sheet);
    });
    toggle.appendChild(btn);
  });

  if (CONFIG.archiveLink) {
    const a = document.createElement('a');
    a.href = CONFIG.archiveLink.url;
    a.textContent = CONFIG.archiveLink.label;
    document.getElementById('archive-link').appendChild(a);
  }
}

function getTabConfig(sheetName) {
  return CONFIG.tabs.find(t => t.sheet === sheetName);
}

async function loadSheetData(sheetName) {
  const tab = getTabConfig(sheetName);
  if (!tab) return;
  const stationNumbers = tab.stations;

  try {
    const res = await fetch(`https://opensheet.vercel.app/${CONFIG.sheetId}/${sheetName}`);
    const data = await res.json();

    // INDIVIDUALS
    const individuals = data
      .filter(row => row.Name && !isNaN(parseInt(row.Total)))
      .map((row, index) => ({
        number: row["Player Number"] || '',
        name: row.Name,
        total: parseInt(row.Total),
        stations: stationNumbers.map(n => row[`Station ${n}`] || '0'),
        id: `detail-${index}`
      }))
      .sort((a, b) => b.total - a.total);

    let indivHTML = '<table><tr><th>Name</th><th>Total</th></tr>';
    individuals.forEach((row, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
      const highlightClass = index < 3 ? 'highlight' : '';
      const displayName = `${row.number} - ${row.name}`;
      indivHTML += `
        <tr class="clickable ${highlightClass}" onclick="toggleDetails('${row.id}')">
          <td>${medal ? `<span class="medal">${medal}</span>` : ''}${displayName}</td>
          <td>${row.total}</td>
        </tr>
        <tr class="details" id="${row.id}" style="display: none;">
          <td colspan="2">
            <table class="station-table">
              <tr>${stationNumbers.map(n => `<th>${n}</th>`).join('')}<th>Total</th></tr>
              <tr>${row.stations.map(s => `<td>${s}</td>`).join('')}<td>${row.total}</td></tr>
            </table>
          </td>
        </tr>
      `;
    });
    indivHTML += '</table>';
    document.getElementById('individual-board').innerHTML = indivHTML;

    const indivNote = document.getElementById("individual-note");
    if (indivNote) {
      indivNote.style.display = tab.officialNote ? 'block' : 'none';
    }

    // TEAMS
    const teamMap = {};
    data.forEach((row) => {
      const team = row.Team;
      if (!teamMap[team]) teamMap[team] = [];
      teamMap[team].push({
        name: row.Name,
        total: parseInt(row.Total),
        stations: stationNumbers.map(n => row[`Station ${n}`] || '0')
      });
    });

    const sortedTeams = Object.entries(teamMap)
      .map(([teamName, players], i) => ({
        team: teamName,
        total: players.reduce((sum, p) => sum + (isNaN(p.total) ? 0 : p.total), 0),
        players: players,
        id: `team-detail-${i}`
      }))
      .sort((a, b) => b.total - a.total);

    let teamHTML = '<table><tr><th>Team</th><th>Total</th></tr>';
    sortedTeams.forEach((team, index) => {
      const highlightClass = index < 4 ? 'highlight' : '';
      teamHTML += `
        <tr class="clickable ${highlightClass}" onclick="toggleDetails('${team.id}')">
          <td>${team.team}</td>
          <td>${team.total}</td>
        </tr>
        <tr class="details" id="${team.id}" style="display: none;">
          <td colspan="2">
            <table class="station-table team-subtable">
              <tr>
                <th>Name</th>
                ${stationNumbers.map(n => `<th>${n}</th>`).join('')}
                <th>Total</th>
              </tr>
              ${team.players.map(player => `
                <tr>
                  <td>${player.name}</td>
                  ${player.stations.map(s => `<td>${s}</td>`).join('')}
                  <td>${isNaN(player.total) ? 0 : player.total}</td>
                </tr>
              `).join('')}
            </table>
          </td>
        </tr>
      `;
    });
    teamHTML += '</table>';
    document.getElementById('team-board').innerHTML = teamHTML;

  } catch (err) {
    document.getElementById('individual-board').innerHTML = 'Error loading data.';
    document.getElementById('team-board').innerHTML = 'Error loading data.';
    console.error(err);
  }
}

function toggleDetails(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = el.style.display === 'table-row' ? 'none' : 'table-row';
  }
}

function loadPartnerLogos() {
  const partnerContainer = document.getElementById('partner-strip');
  // Render the list twice for a seamless scrolling loop.
  for (let i = 0; i < 2; i++) {
    CONFIG.partnerLogos.forEach(filename => {
      const img = document.createElement('img');
      img.src = `${CONFIG.partnersDir}/${filename}`;
      img.alt = 'Partner Logo';
      partnerContainer.appendChild(img);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  const initialTab = (CONFIG.tabs.find(t => t.default) || CONFIG.tabs[0]).sheet;
  loadSheetData(initialTab);
  loadPartnerLogos();
  setInterval(() => {
    const activeBtn = document.querySelector('.toggle-btn.active');
    if (activeBtn) loadSheetData(activeBtn.dataset.tab);
  }, CONFIG.refreshIntervalMs);
});
