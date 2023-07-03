// Importing styles
import './styles/styles.scss';

// Importing the Light/Dark mode switcher component
import { toggleDarkMode } from './components/switcher';

// Select the app container and update its inner HTML
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
<div class='content'>
    <div class='main-text'>
        <h1>
            Hi, I'm Shivang<span class='slide-out'> P Swain</span>.
        </h1>
        <p>I'm a 23 year old cybersecurity analyst working in the Technology Risk division at Goldman
            Sachs.
        </p>
        <div class='links'>
            <a href='/github' target='_blank' aria-label='GitHub'><i class='fa-brands fa-github'></i></a>
            <a href='/linkedin' target='_blank' aria-label='LinkedIn'><i class='fa-brands fa-linkedin-in'></i></a>
            <a href='/instagram' target='_blank' aria-label='Instagram'><i class='fa-brands fa-instagram'></i></a>
        </div>
    </div>
    <button id='toggle' class='toggle' aria-label='Light/Dark Mode toggle'>
        <i id='moon-icon' class='fa-solid fa-moon hidden'></i>
        <i id='sun-icon' class='fa-solid fa-sun hidden'></i>
    </button>
</div>
`

// Try to run the function to set dark mode
try {
    // Select the toggle button
    const toggleButton = document.querySelector<HTMLButtonElement>('#toggle')!;

    // Call toggleDarkMode function
    toggleDarkMode(toggleButton)
}

// Console log errors if any
catch (e) {
    console.error('Dark Mode Switcher Error: ' + e)
}