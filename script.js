// Show the specified section by toggling the 'active' class
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

//Refresh home page to have updates done
function homePageRefresh(){
    window.location.reload();
}

// Fetch container details and display them for updating
async function findContainer() {
    const id = document.getElementById('find-id').value;
    const resultDiv = document.getElementById('find-result');

    if (!id || isNaN(id) || id <= 0) {
        resultDiv.innerHTML = 'Invalid Container ID';
        return;
    }

    try {
        document.getElementById('find-id').value = '';
        const response = await fetch(`http://localhost:8000/api/containers/${id}`);
        if (response.status === 404) {
            resultDiv.innerHTML = 'Container not found';
        } else if (!response.ok) {
            resultDiv.innerHTML = `Error fetching container: ${response.statusText}`;
        } else {
            const container = await response.json();
            resultDiv.innerHTML = `
                <p>Contains: <input type="text" id="update-contains" value="${container.contains}"></p>
                <p>Weight: <input type="number" id="update-weight" value="${container.weight}"></p>
                <p>Hazard Type: <select id="update-hazardType">
                    ${generateHazardOptions(container.hazardType ? container.hazardType.id : null)}
                </select></p>
                <button onclick="updateContainer(${id})">Update</button>
            `;
        }
    } catch (error) {
        console.error('Error fetching container:', error);
        resultDiv.innerHTML = 'Error fetching container';
    }
}

// Generate options for the hazard type dropdown
function generateHazardOptions(selectedId) {
    const hazardTypes = [
        { id: 1, name: 'Explosives' },
        { id: 2, name: 'Gasses' },
        { id: 3, name: 'Flammable liquids' },
        { id: 4, name: 'Flammable solids' },
        { id: 5, name: 'Oxidizing substances' },
        { id: 7, name: 'Toxic and infectious substances' },
        { id: 8, name: 'Radioactive material' },
        { id: 9, name: 'Corrosives' },
        { id: 10, name: 'Miscellaneous goods' }
    ];
    
    return hazardTypes.map(type => 
        `<option value="${type.id}" ${selectedId === type.id ? 'selected' : ''}>${type.name}</option>`
    ).join('');
}

// Update a container's details
async function updateContainer(id) {
    const contains = document.getElementById('update-contains').value;
    const weight = document.getElementById('update-weight').value;
    const hazardTypeId = document.getElementById('update-hazardType').value;
    const updateResultDiv = document.getElementById('update-result');

    if (!id || isNaN(id) || id <= 0) {
        updateResultDiv.innerHTML = 'Invalid Container ID';
        return;
    }
    if (!validateNonNegative(weight)) {
        updateResultDiv.innerHTML = 'Weight must be a non-negative number';
        return;
    }

    const data = {
        contains: contains,
        weight: weight,
        hazardType: { id: hazardTypeId }
    };

    try {
        const response = await fetch(`http://localhost:8000/api/containers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.status === 200) {
            updateResultDiv.innerHTML = 'Container updated successfully';
            updateResultDiv.style.color = 'green';
            // Clear input fields
            document.getElementById('update-contains').value = ''; 
            document.getElementById('update-weight').value = ''; 
            document.getElementById('update-hazardType').value = ''; 

        } else {
            updateResultDiv.innerHTML = `Failed to update container: ${result.message || 'Unknown error'}`;
            updateResultDiv.style.color = 'black';
        }
    } catch (error) {
        console.error('Error updating container:', error);
        updateResultDiv.innerHTML = 'Error updating container';
        updateResultDiv.style.color = 'black';
    }
}


// Register a new container
async function registerContainer() {
    const contains = document.getElementById('contains').value;
    const weight = document.getElementById('weight').value;
    const hazardTypeId = document.getElementById('hazardType').value;
    const registerResultDiv = document.getElementById('register-result');

    if (!validateNonNegative(weight)) {
        registerResultDiv.innerHTML = 'Weight must be a non-negative number';
        return;
    }

    const data = {
        contains: contains,
        weight: weight,
        hazardType: { id: hazardTypeId }
    };

    try {
        const response = await fetch('http://localhost:8000/api/containers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const responseData = await response.json();
        if (response.status === 201) {
            registerResultDiv.innerHTML = 'Container registered successfully';
            registerResultDiv.style.color = 'green';
            // Clear input fields
            document.getElementById('contains').value = '';
            document.getElementById('weight').value = '';
            document.getElementById('hazardType').value = '';
        } else {
            registerResultDiv.innerHTML = `Failed to register container: ${responseData.message || 'Unknown error'}`;
            registerResultDiv.style.color = 'black';
        }
    } catch (error) {
        console.error('Error registering container:', error);
        registerResultDiv.innerHTML = 'Error registering container';
        registerResultDiv.style.color = 'black';
    }
}

// Validate that a value is non-negative
function validateNonNegative(value) {
    return value >= 0;
}

// Delete a container
async function deleteContainer() {
    const id = document.getElementById('delete-id').value;
    const resultDiv = document.getElementById('delete-result');

    if (!id || isNaN(id) || id <= 0) {
        resultDiv.innerHTML = 'Invalid Container ID';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/containers/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            resultDiv.innerHTML = 'Container deleted successfully';
            resultDiv.style.color = 'green';
            // Clear input field
            document.getElementById('delete-id').value = '';
        } else {
            resultDiv.innerHTML = 'Failed to delete container';
            resultDiv.style.color = 'black';
        }
    } catch (error) {
        console.error('Error deleting container:', error);
        resultDiv.innerHTML = 'Error deleting container';
        resultDiv.style.color = 'black';
    }
}

// Load and display containers on the home section
async function loadHomeData() {
    const containerTableDiv = document.getElementById('container-table');
    try {
        const response = await fetch('http://localhost:8000/api/containers');
        if (response.ok) {
            const containers = await response.json();
            if (containers.length > 0) {
                let tableHTML = `
                    <table class="container-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Contains</th>
                                <th>Weight</th>
                                <th>Hazard Type</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                containers.forEach(container => {
                    console.log(container); // Log the container object to inspect its structure

                    // Map hazardType.id to hazardType name
                    const hazardTypeName = container.hazardType && container.hazardType.id 
                        ? hazardTypeMapping[container.hazardType.id] 
                        : 'None';

                    tableHTML += `
                        <tr>
                            <td>${container.id}</td>
                            <td>${container.contains}</td>
                            <td>${container.weight}</td>
                            <td>${hazardTypeName}</td>  <!-- Display the hazard type name -->
                        </tr>
                    `;
                });
                tableHTML += `
                        </tbody>
                    </table>
                `;
                containerTableDiv.innerHTML = tableHTML;
            } else {
                containerTableDiv.innerHTML = '<p>No containers found.</p>';
            }
        } else {
            containerTableDiv.innerHTML = 'Error loading containers';
        }
    } catch (error) {
        console.error('Error loading containers:', error);
        containerTableDiv.innerHTML = 'Error loading containers';
    }
}

// Ensure that the home data is loaded when the page is first loaded
document.addEventListener('DOMContentLoaded', loadHomeData);

// Hazard type mappings for displaying in the table
const hazardTypeMapping = {
    1: 'Explosives',
    2: 'Gasses',
    3: 'Flammable liquids',
    4: 'Flammable solids',
    5: 'Oxidizing substances',
    7: 'Toxic and infectious substances',
    8: 'Radioactive material',
    9: 'Corrosives',
    10: 'Miscellaneous goods'
};
