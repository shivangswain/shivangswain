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

    function updateUI() {
        // If dark mode is enabled, add the 'dark' class to the body element and remove the 'light' class
        // Hide the moon icon and show the sun icon
        if (isDarkMode) {
            body.classList.add('dark');
            body.classList.remove('light');
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        }
        // If dark mode is not enabled, add the 'light' class to the body element and remove the 'dark' class
        // Show the moon icon and hide the sun icon
        else {
            body.classList.add('light');
            body.classList.remove('dark');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
    }

    // Call the updateUI function to set the initial state of the page
    updateUI();
}
