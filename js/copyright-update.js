// helper function for automatically updating the copyright year

document.addEventListener('DOMContentLoaded', () => {
    // Set the current year
    document.querySelector('#current-year').textContent = new Date().getFullYear();
});