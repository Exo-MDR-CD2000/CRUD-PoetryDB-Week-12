// Function to initialize the random poem generator
function initializeRandomPoemGenerator() {
    // Wait for the DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Global variables
        const randomPoemButton = document.querySelector('#get-random-poem');
        const poemContainer = document.querySelector('#random-poem-results'); // Define the poem container

        // API URL for random poem
        const randomPoemApiUrl = 'https://poetrydb.org/random/1';

        // Fetch random poem
        const fetchRandomPoem = async () => {
            try {
                const response = await fetch(`${randomPoemApiUrl}`);

                if (!response.ok) {
                    throw new Error('Poem not found');
                }

                const data = await response.json();
                const poem = data[0]; // the array of zero index is the poem object

                // Call the function to generate and insert HTML
                generatePoemHTML(poem);

            } catch (error) {
                console.error('Error fetching random poem:', error);
            }
        };

        // Generate and insert HTML for the poem
        const generatePoemHTML = (poem) => {
            // Add HTML to the page
            const poemCardRandomHTML = `
                <div class="row justify-content-center">
                    <div class="col-md-8 mb-4">
                        <div class="card">
                            <div class="card-body p-4">
                                <h5 class="card-title">${poem.title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${poem.author}</h6>
                                <p class="card-text">Line Count: ${poem.linecount}</p>
                                <p class="card-text">
                                    ${poem.lines.join('<br>')}
                                </p>
                                <button id="random-btn-clear" class="btn btn-danger btn-lg-1 position-absolute top-0 end-0 m-2 delete-poem">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Insert the poem card into the container
            poemContainer.innerHTML = poemCardRandomHTML;

            // Add event listener to the trash button
            const trashButton = document.querySelector('#random-btn-clear');
            trashButton.addEventListener('click', () => {
                poemContainer.innerHTML = '';
            });
        };

        // Add event listener to the button
        randomPoemButton.addEventListener('click', () => {
            fetchRandomPoem();
        });
    });
}

// Initialize the random poem generator
initializeRandomPoemGenerator();



/**
 * The above function combines several functions to fetch a random poem from the PoetryDB API and display it on the page.
 * The overall fx is labeled initializeRandomPoemGenerator and is called at the end of the file.
 * There is one larger fx inside which is an event listener for the domcontentloaded event (makes sure the page is fully loaded).
 * The fetchRandomPoem fx is an async function that fetches a random poem from the PoetryDB API.
 * Then the generatePoemHTML fx is called with the poem object as an argument.
 * The generatePoemHTML fx creates an HTML string with the poem data and inserts it into the page.
 * Then there are two event listeners: one for the randomPoemButton click event and one for the trashButton click event.
 */