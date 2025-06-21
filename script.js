const sheetId = '1kFkUUcvSt2LyOJKSweQLwmZ_ZIa5qTJoNKvDLQB46mo';
const sheetName = 'Regular-Season';
const stationNumbers = ['1', '2', '3', '4', '5', '6', '7', '8'];

async function loadSheetData() {
  try {
    const res = await fetch(`https://opensheet.vercel.app/${sheetId}/${sheetName}`);
    const data = await res.json();

    // --- INDIVIDUALS ---
    const individuals = data
      .filter(row => row.Name && !isNaN(parseInt(row.Total)))
      .map((row, index) => ({
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
      indivHTML += `
        <tr class="clickable ${highlightClass}" onclick="toggleDetails('${row.id}')">
          <td>${medal ? `<span class="medal">${medal}</span>` : ''}${row.name}</td>
          <td>${row.total}</td>
        </tr>
        <tr class="details" id="${row.id}" style="display: none;">
          <td colspan="2">
            <table class="station-table">
              <tr>${stationNumbers.map(n => `<th>${n}</th>`).join('')}</tr>
              <tr>${row.stations.map(s => `<td>${s}</td>`).join('')}</tr>
            </table>
          </td>
        </tr>
      `;
    });
    indivHTML += '</table>';
    document.getElementById('individual-board').innerHTML = indivHTML;

    // --- TEAMS ---
    const teamMap = {};
    data.forEach((row, idx) => {
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

window.addEventListener('DOMContentLoaded', () => {
  loadSheetData();
  loadPartnerLogos();
  setInterval(loadSheetData, 30000);
});

// Dynamically load all partner logos
function loadPartnerLogos() {
  const partnerContainer = document.getElementById('partner-strip');
  const partnerImages = [
    "logo-1.png", "logo-2.jpg", "logo-3.png", "logo-4.jpg", "logo-5.png logo-6.png logo-7.png logo-8.png logo-9.png logo-10.png logo-11.png logo-12.png logo-13.png logo-14.png"
    // Add or update filenames as needed here
  ];

  partnerImages.forEach(filename => {
    const img = document.createElement("img");
    img.src = `images/partners/${filename}`;
    img.alt = "Partner Logo";
    partnerContainer.appendChild(img);
  });

  // Duplicate the logos for smooth looping scroll
  partnerImages.forEach(filename => {
    const img = document.createElement("img");
    img.src = `images/partners/${filename}`;
    img.alt = "Partner Logo";
    partnerContainer.appendChild(img);
  });
}