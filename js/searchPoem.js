// Coding Instrcutions:

/**    
     * Create a CRD application (CRUD without update) using json-server or another API
     * Use fetch and async/await to interact with the API
     * Use a form to create/post new entities
     * Build a way for users to delete entities
     * Include a way to get entities from the API and display them
     * You do NOT need update, but you can add it if you'd like
     * Use Bootstrap and/or CSS to style your project
*/

// async function fetchPoems() {
//     try {
//         const response = await fetch('https://poetrydb.org/random/1');
//         const rawJson = await response.text(); // Get the raw JSON as a string
//         // console.log('Raw JSON:', rawJson);

//         const poems = JSON.parse(rawJson); // Parse the raw JSON string into an object
//         // console.log('Parsed JSON:', poems);

//         // Display the poems (assuming you have a function for rendering them)
//         // displayPoems(poems);
//     } catch (error) {
//         console.error('Error fetching poems:', error);
//     }
// }

// fetchPoems();


/** 
 * Based on the PoetryDB Raw JSON, several poems are returned in an array.
 * Title, Author, Lines, and Linecount are the properties of each poem.
 * There is also extra information for poems longer than 100 lines i think.
*/

document.addEventListener('DOMContentLoaded', async function() {

    const searchForm = document.getElementById('poemSearchForm');
    const addPoemForm = document.getElementById('addPoemForm');
    const resultsDiv = document.getElementById('results');
    const titleSelect = document.getElementById('title');
    const authorSelect = document.getElementById('author');
    const clearResultsButton = document.getElementById('clearResults');
    
    // Global variable to store search results
    let searchResults = [];

    // Fetch and populate dropdown options
    async function populateDropdowns() {
        try {
            const [titlesResponse, authorsResponse] = await Promise.all([
                fetch('https://poetrydb.org/title'),
                fetch('https://poetrydb.org/author')
            ]);

            const titlesData = await titlesResponse.json();
            const authorsData = await authorsResponse.json();

            // Populate titles dropdown
            titlesData.titles.forEach(title => {
                const option = document.createElement('option');
                option.value = title;
                option.textContent = title;
                titleSelect.appendChild(option);
            });

            // Populate authors dropdown
            authorsData.authors.forEach(author => {
                const option = document.createElement('option');
                option.value = author;
                option.textContent = author;
                authorSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching dropdown options:', error);
        }
    }

    // Call the function to populate dropdowns
    populateDropdowns();

    // Function to handle search form submission
    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const title = titleSelect.value;
        const author = authorSelect.value;

        try {
            let url = 'https://poetrydb.org/';
            if (title && author) {
                url += `author,title/${author};${title}`;
            } else if (title) {
                url += `title/${title}`;
            } else if (author) {
                url += `author/${author}`;
            } else {
                resultsDiv.innerHTML = '<p>Please select a title or author to search.</p>';
                return;
            }

            console.log('Fetching URL:', url); // Debugging log
            const response = await fetch(url);
            const data = await response.json();
            console.log('Fetched Data:', data); // Debugging log

            // Update the global searchResults variable
            searchResults = data;

            displayResults(data);
        } catch (error) {
            console.error('Error fetching poem:', error);
        }
    });

    function displayResults(data) {
        resultsDiv.innerHTML = '';
        if (data.length === 0) {
            resultsDiv.innerHTML = '<p>No poems found.</p>';
            return;
        }
    
        // Create the table structure
        const table = document.createElement('table');
        table.className = 'table table-bordered table-striped table-hover table-sm';
        table.innerHTML = `
            <thead>
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Author</th>
                    <th scope="col">Line Count</th>
                    <th scope="col">Poem</th>
                    <th scope="col">Save</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
    
        const tbody = table.querySelector('tbody');
    
        // Populate the table with poem data
        data.forEach((poem, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${poem.title}</td>
                <td>${poem.author}</td>
                <td>${poem.linecount}</td>
                <td class="poem-column">
                    ${poem.lines.length > 6 ? `
                        <a class="btn btn-link" data-bs-toggle="collapse" href="#collapsePoem${index}" role="button" aria-expanded="false" aria-controls="collapsePoem${index}">
                            Show Poem
                        </a>
                        <div class="collapse" id="collapsePoem${index}">
                            ${poem.lines.join('<br>')}
                        </div>
                    ` : poem.lines.join('<br>')}
                </td>
                <td>
                    <button class="btn btn-success save-poem" data-poem-index="${index}">
                        <i class="bi bi-plus-lg"></i>
                    </button>
                 </td>
            `;
            tbody.appendChild(row);
        });
    
        // Wrap the table in a responsive div
        const responsiveDiv = document.createElement('div');
        responsiveDiv.className = 'table-responsive';
        responsiveDiv.appendChild(table);

        resultsDiv.appendChild(responsiveDiv);
    }

    // Function to clear results and reset the form
    clearResultsButton.addEventListener('click', function() {
        resultsDiv.innerHTML = '';
        searchForm.reset();
    });

    // Function to handle saving a poem
    function handleSavePoem(event) {
        event.preventDefault();
        console.log('Save button clicked'); // Debugging log

        if (event.target.classList.contains('save-poem')) {
            const index = event.target.getAttribute('data-poem-index');
            console.log('Poem index:', index); // Debugging log

            const poem = searchResults[index]; // Access the corresponding poem from global searchResults array
            console.log('Poem to save:', poem); // Debugging log

            // Add an ID to the poem if it doesn't already have one
            poem.id = poem.id || Date.now(); // Generate a unique ID using current timestamp
            event.preventDefault();

            fetch('http://localhost:3000/savedPoems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(poem)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error saving poem');
                }
                return response.json();
            })
            .then(data => {
                console.log('Poem saved:', data); // Debugging log
                displaySavedPoems(); // Call the function to display the saved poems
            })
            .catch(error => console.error('Error saving poem:', error));
        }
    }

    // Function to display saved poems
    function displaySavedPoems() {
        fetch('http://localhost:3000/savedPoems')
            .then(response => response.json())
            .then(poems => {
                console.log('Fetched saved poems:', poems); // Debugging log
                const savedPoemsContainerSmall = document.getElementById('poemCardsContainer');
                const savedPoemsContainerLarge = document.getElementById('poemCardsContainerLarge');
                savedPoemsContainerSmall.innerHTML = ''; // Clear previous saved poems
                savedPoemsContainerLarge.innerHTML = ''; // Clear previous saved poems

                poems.forEach(poem => {
                    const cardSmall = document.createElement('div');
                    cardSmall.className = 'col-md-6 col-lg-4 mb-4';
                    cardSmall.innerHTML = `
                        <div class="card">
                            <div class="card-body p-2">
                                <h5 class="card-title">${poem.title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${poem.author}</h6>
                                <p class="card-text">Line Count: ${poem.linecount}</p>
                                <p class="card-text">${poem.lines.join('<br>')}</p>
                                <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 delete-poem">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    savedPoemsContainerSmall.appendChild(cardSmall);

                    const cardLarge = document.createElement('div');
                    cardLarge.className = 'col-md-8 mb-4';
                    cardLarge.innerHTML = `
                        <div class="card">
                            <div class="card-body p-4">
                                <h5 class="card-title">${poem.title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${poem.author}</h6>
                                <p class="card-text">Line Count: ${poem.linecount}</p>
                                <p class="card-text">${poem.lines.join('<br>')}</p>
                                <button class="btn btn-danger btn-lg-1 position-absolute top-0 end-0 m-2 delete-poem">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    savedPoemsContainerLarge.appendChild(cardLarge);
                });
            })
            .catch(error => console.error('Error fetching saved poems:', error));
    }

    // Add event listener to the save buttons
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('save-poem') || event.target.closest('.save-poem')) {
            handleSavePoem(event);
        }
    });

    // Initial call to display saved poems on page load
    displaySavedPoems();
});