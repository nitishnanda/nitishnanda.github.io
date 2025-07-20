// common.js

function renderNavbar() {
  const nav = document.getElementById('navbar');
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const darkMode = localStorage.getItem('darkMode') === 'true';

  const navHTML = `
    <div class="nav-left">
      <div class="logo-box">HA</div>
      <a href="profile.html">Profile</a>
      <a href="symptom-checker.html">Symptom Tracker</a>
      <a href="calendar.html">Calendar</a>
      <a href="appointments.html">Appointments</a>
    </div>
    <div class="nav-right">
      ${
        user
          ? `<div class="dropdown">
                <button class="dropbtn">${user.fullName.split(' ')[0]} &#x25BC;</button>
                <div class="dropdown-content">
                  <a href="profile.html">My Profile</a>
                  <a href="#" id="toggleTheme">${darkMode ? 'Light Mode' : 'Dark Mode'}</a>
                  <a href="#" id="logout">Log Out</a>
                </div>
              </div>`
          : `<a href="login.html">Login / Sign Up</a>`
      }
    </div>
  `;

  nav.innerHTML = navHTML;

  if (user) {
    const logoutBtn = document.getElementById('logout');
    if(logoutBtn) {
      logoutBtn.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
      });
    }

    const toggleThemeBtn = document.getElementById('toggleTheme');
    if(toggleThemeBtn) {
      toggleThemeBtn.addEventListener('click', e => {
        e.preventDefault();
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        }
        e.target.textContent = isDark ? 'Dark Mode' : 'Light Mode';
      });
    }
  }

  // Apply saved theme on page load
  if (darkMode) {
    document.documentElement.classList.add('dark');
  }
}