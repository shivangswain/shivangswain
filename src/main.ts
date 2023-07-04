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
        <span id='moon-icon' class="material-symbols-outlined">dark_mode</span>
        <span id='sun-icon' class="material-symbols-outlined">light_mode</span>
    </button>
</div>
`

// Select the toggle button
const toggleButton = document.querySelector<HTMLButtonElement>('#toggle')!;

// Call toggleDarkMode function
toggleDarkMode(toggleButton)