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
    // const addPoemForm = document.getElementById('addPoemForm');
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
        resultsDiv.innerHTML = ''; // TODO: not best practice. Look into better ways to clear elements as this can cause memory leaks
        searchForm.reset();
    });

    // Function to handle saving a poem
    async function handleSavePoem(event) {
        // event.preventDefault();
        console.log('Save button clicked'); // Debugging log

        if (event.target.classList.contains('save-poem')) {
            const index = event.target.getAttribute('data-poem-index');
            console.log('Poem index:', index); // Debugging log

            const poem = searchResults[index]; // Access the corresponding poem from global searchResults array
            console.log('Poem to save:', poem); // Debugging log

            try {
                // Fetch existing poems to determine the next ID
                const response = await fetch('http://localhost:3000/savedPoems');
                if (!response.ok) {
                    throw new Error('Error fetching existing poems');
                }
                const existingPoems = await response.json();

                // Determine the highest ID among existing poems
                const highestId = existingPoems.reduce((maxId, poem) => Math.max(maxId, poem.id || 0), 0);
                // Assign the new poem an ID that is one greater than the highest existing ID
                poem.id = highestId + 1;

                // Save the new poem to the database
                const saveResponse = await fetch('http://localhost:3000/savedPoems', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(poem)
                });
                if (!saveResponse.ok) {
                    throw new Error('Error saving poem');
                }
                const data = await saveResponse.json();
                console.log('Poem saved:', data); // Debugging log
                displaySavedPoems(); // Call the function to display the saved poems
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
        // Function to display saved poems
        const displaySavedPoems = async () => {
            try {
                const response = await fetch('http://localhost:3000/savedPoems');
                const poems = await response.json();
                console.log('Fetched saved poems:', poems); // Debugging log
        
                const savedPoemsContainerSmall = document.getElementById('poemCardsContainer');
                const savedPoemsContainerLarge = document.getElementById('poemCardsContainerLarge');
                // savedPoemsContainerSmall.innerHTML = ''; // Clear previous saved poems
                // savedPoemsContainerLarge.innerHTML = ''; // Clear previous saved poems
        
                poems.forEach(poem => {
                    console.log('Rendering poem with ID:', poem.id); // Debugging log
        
                    const cardSmall = document.createElement('div');
                    cardSmall.className = 'col-md-6 col-lg-4 mb-4';
                    cardSmall.innerHTML = `
                        <div class="card">
                            <div class="card-body p-2">
                                <h5 class="card-title">${poem.title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${poem.author}</h6>
                                <p class="card-text">Line Count: ${poem.linecount}</p>
                                <p class="card-text">${poem.lines.join('<br>')}</p>
                                <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 delete-poem" data-id="${poem.id}">
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
                                <button class="btn btn-danger btn-lg-1 position-absolute top-0 end-0 m-2 delete-poem" data-id="${poem.id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    savedPoemsContainerLarge.appendChild(cardLarge);
                });
            } catch (error) {
                console.error('Error fetching saved poems:', error);
            }
        };
        
        // Add event listener to the save buttons
        document.addEventListener('click', event => {
            if (event.target.classList.contains('save-poem') || event.target.closest('.save-poem')) {
                handleSavePoem(event);
            }
        });
        
        // event listener for delete buttons
        document.addEventListener('click', async event => {
            if (event.target.classList.contains('delete-poem') || event.target.closest('.delete-poem')) {
                const button = event.target.closest('.delete-poem');
                const poemId = button.getAttribute('data-id');
                const card = button.closest('.card');
        
                console.log('Delete button clicked for poem with ID:', poemId); // Debugging log
        
                // Remove the poem from the DOM
                card.remove();
        
                // Send DELETE request to json-server
                try {
                    const response = await fetch(`http://localhost:3000/savedPoems/${poemId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete poem from the database');
                    }
                    console.log(`Poem with id ${poemId} deleted successfully`);
                } catch (error) {
                    console.error('Error deleting poem:', error);
                }
            }
        });

    // Initial call to display saved poems on page load
    displaySavedPoems();
});
