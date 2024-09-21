// Create logic to scroll back to top of page

document.addEventListener('DOMContentLoaded', () => {
    let scrollBack = document.querySelector('#scrollToTopBtn');

    scrollBack.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBack.classList.add('show'); // Add 'show' class when scrolling down
        } else {
            scrollBack.classList.remove('show'); // Remove 'show' class when scrolling up
        }
    });
});