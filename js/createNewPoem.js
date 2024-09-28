// JS code to handle the creation of a new poem and save them to the db
// Can probably import code from searchPoem.js like the handleSavePoem fx and displaySavedPoems

document.addEventListener('DOMContentLoaded', function () {

    // Function to create a small poem card
    const createSmallPoemCard = (poem) => {
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
        return cardSmall;
    };

    // Function to create a large poem card
    const createLargePoemCard = (poem) => {
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
        return cardLarge;
    };

    // Function to delete a poem
    const deletePoem = async (event) => {
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
    };

    // Add event listener to handle delete functionality
    document.addEventListener('click', deletePoem);


    // Event listener to handle form submission
    const handleAddPoem = async (event) => {
        event.preventDefault(); // Prevent the default form submission



        const title = document.getElementById('newTitle').value;
        const author = document.getElementById('newAuthor').value;
        const lines = document.getElementById('newLines').value.split('\n');
        const linecount = lines.length;

        const newPoem = {
            title,
            author,
            lines,
            linecount
        };

        // Save the new poem to the local database
        try {
            const response = await fetch('http://localhost:3000/savedPoems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPoem)
            });

            if (!response.ok) {
                throw new Error('Failed to save the new poem to the database');
            }

            const savedPoem = await response.json();
            console.log('New poem saved:', savedPoem);

            // Display the new poem on the page
            const savedPoemsContainerSmall = document.getElementById('poemCardsContainer');
            const savedPoemsContainerLarge = document.getElementById('poemCardsContainerLarge');

            const cardSmall = createSmallPoemCard(savedPoem);
            savedPoemsContainerSmall.appendChild(cardSmall);

            const cardLarge = createLargePoemCard(savedPoem);
            savedPoemsContainerLarge.appendChild(cardLarge);

        } catch (error) {
            console.error('Error saving the new poem:', error);
        }
    };
    // Add event listener to handle form submission
    document.getElementById('addPoemForm').addEventListener('submit', handleAddPoem);

});


// remember this cmd line to run the server: json-server --watch db/db.json



// below is probably unnecessary code to render the saved poems. This is already done in searchPoem.js

// Function to display saved poems
// const displayUserMadePoems = async () => {
//     try {
//         const response = await fetch('http://localhost:3000/savedPoems');
//         const poems = await response.json();
//         console.log('Fetched saved poems:', poems); // Debugging log

//         const savedPoemsContainerSmall = document.getElementById('poemCardsContainer');
//         const savedPoemsContainerLarge = document.getElementById('poemCardsContainerLarge');
//         savedPoemsContainerSmall.innerHTML = ''; // Clear previous saved poems
//         savedPoemsContainerLarge.innerHTML = ''; // Clear previous saved poems

//         poems.forEach(poem => {
//             console.log('Rendering poem with ID:', poem.id); // Debugging log

//             const cardSmall = createSmallPoemCard(poem);
//             savedPoemsContainerSmall.appendChild(cardSmall);

//             const cardLarge = createLargePoemCard(poem);
//             savedPoemsContainerLarge.appendChild(cardLarge);
//         });
//     } catch (error) {
//         console.error('Error fetching saved poems:', error);
//     }
// };

//TODO - look into debugging when all poems are deleted from the db.