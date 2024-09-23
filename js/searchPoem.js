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

async function fetchPoems() {
    try {
        const response = await fetch('https://poetrydb.org/random/1');
        const rawJson = await response.text(); // Get the raw JSON as a string
        // console.log('Raw JSON:', rawJson);

        const poems = JSON.parse(rawJson); // Parse the raw JSON string into an object
        // console.log('Parsed JSON:', poems);

        // Display the poems (assuming you have a function for rendering them)
        // displayPoems(poems);
    } catch (error) {
        console.error('Error fetching poems:', error);
    }
}

fetchPoems();


    // const searchForm = document.getElementById('poemSearchForm');
    // const addPoemForm = document.getElementById('addPoemForm');
    // const resultsDiv = document.getElementById('results');
    // const titleSelect = document.getElementById('title');
    // const authorSelect = document.getElementById('author');
    // const clearResultsButton = document.getElementById('clearResults');

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
        // titleSelect.innerHTML = '<option value="">Select a poem title</option>';
        // titleSelect.disabled = false;
    });
});