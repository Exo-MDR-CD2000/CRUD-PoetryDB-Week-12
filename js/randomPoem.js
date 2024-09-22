// Function to initialize the random poem generator
function initializeRandomPoemGenerator() {
    // Wait for the DOM to be fully loaded. Also fixes the issue of the script being loaded before the HTML
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

                // Add HTML to the page
                const poemCardRandomHTML = `
                    <div class="row justify-content-center">
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card">
                                <div class="card-body p-2">
                                    <h5 class="card-title">${poem.title}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">${poem.author}</h6>
                                    <p class="card-text">Line Count: ${poem.linecount}</p>
                                    <p class="card-text">
                                        ${poem.lines.join('<br>')}
                                    </p>
                                    <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 delete-poem">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Insert the poem card into the container
                poemContainer.innerHTML = poemCardRandomHTML;

                // console.log('Fetched Random Poem Data:', data); // Debugging log
            } catch (error) {
                console.error('Error fetching random poem:', error);
            }
        };

        // Add event listener to the button
        randomPoemButton.addEventListener('click', () => {
            fetchRandomPoem();
        });
    });
}

// Initialize the random poem generator
initializeRandomPoemGenerator();