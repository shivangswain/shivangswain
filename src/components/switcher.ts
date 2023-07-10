// Function to toggle the dark mode of the page
export function toggleDarkMode(toggleButton: HTMLButtonElement) {
    // Select the body element and assign it to a variable
    const body = document.querySelector<HTMLElement>('body')!;
    // Select the moon icon element and assign it to a variable
    const moonIcon = document.querySelector<HTMLElement>('#moon-icon')!;
    // Select the sun icon element and assign it to a variable
    const sunIcon = document.querySelector<HTMLElement>('#sun-icon')!;

    // Check if the darkMode is already set in the local storage, otherwise check if the preferred color scheme is dark
    let isDarkMode = 'darkMode' in localStorage ? localStorage.getItem('darkMode') === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Add a click event listener to the toggle button
    toggleButton.addEventListener('click', () => {
        // Invert the dark mode state and update the local storage
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode.toString());
        updateUI();
    });

    // Function to update the UI based on the dark mode state
    function updateUI() {
        body.classList.toggle('dark', isDarkMode);
        body.classList.toggle('light', !isDarkMode);
        moonIcon.classList.toggle('hidden', isDarkMode);
        sunIcon.classList.toggle('hidden', !isDarkMode);
    }

    // Call the updateUI function to set the initial state of the page
    updateUI();
}