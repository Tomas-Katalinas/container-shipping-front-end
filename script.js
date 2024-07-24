function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

async function findContainer() {
    const id = document.getElementById('find-id').value;
    const resultDiv = document.getElementById('find-result');

    try {
        const response = await fetch(`http://localhost:8080/api/containers/${id}`);
        if (response.status === 404) {
            resultDiv.innerHTML = 'Container not found';
        } else {
            const container = await response.json();
            resultDiv.innerHTML = `
                <p>Contains: <input type="text" id="update-contains" value="${container.contains}"></p>
                <p>Weight: <input type="number" id="update-weight" value="${container.weight}"></p>
                <p>Hazard Type: <select id="update-hazardType">
                    <option value="1" ${container.hazardType && container.hazardType.id === 1 ? 'selected' : ''}>Explosives</option>
                    <option value="2" ${container.hazardType && container.hazardType.id === 2 ? 'selected' : ''}>Gasses</option>
                    <option value="3" ${container.hazardType && container.hazardType.id === 3 ? 'selected' : ''}>Flammable liquids</option>
                    <option value="4" ${container.hazardType && container.hazardType.id === 4 ? 'selected' : ''}>Flammable solids</option>
                    <option value="5" ${container.hazardType && container.hazardType.id === 5 ? 'selected' : ''}>Oxidizing substances</option>
                    <option value="7" ${container.hazardType && container.hazardType.id === 7 ? 'selected' : ''}>Toxic and infectious substances</option>
                    <option value="8" ${container.hazardType && container.hazardType.id === 8 ? 'selected' : ''}>Radioactive material</option>
                    <option value="9" ${container.hazardType && container.hazardType.id === 9 ? 'selected' : ''}>Corrosives</option>
                    <option value="10" ${container.hazardType && container.hazardType.id === 10 ? 'selected' : ''}>Miscellaneous goods</option>
                </select></p>
                <button onclick="updateContainer(${id})">Update</button>
            `;
        }
    } catch (error) {
        console.error('Error fetching container:', error);
    }
}

async function updateContainer(id) {
    const contains = document.getElementById('update-contains').value;
    const weight = document.getElementById('update-weight').value;
    const hazardTypeId = document.getElementById('update-hazardType').value;

    try {
        const response = await fetch(`http://localhost:8080/api/containers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contains: contains,
                weight: weight,
                hazardType: { id: hazardTypeId }
            })
        });
        if (response.status === 200) {
            alert('Container updated successfully');
        } else {
            alert('Failed to update container');
        }
    } catch (error) {
        console.error('Error updating container:', error);
    }
}

async function registerContainer() {
    const contains = document.getElementById('contains').value;
    const weight = document.getElementById('weight').value;
    const hazardTypeId = document.getElementById('hazardType').value;

    try {
        const response = await fetch('http://localhost:8080/api/containers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contains: contains,
                weight: weight,
                hazardType: { id: hazardTypeId }
            })
        });
        if (response.status === 201) {
            alert('Container registered successfully');
        } else {
            alert('Failed to register container');
        }
    } catch (error) {
        console.error('Error registering container:', error);
    }
}

async function deleteContainer() {
    const id = document.getElementById('delete-id').value;
    const resultDiv = document.getElementById('delete-result');

    try {
        const response = await fetch(`http://localhost:8080/api/containers/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            resultDiv.innerHTML = 'Container deleted successfully';
        } else {
            resultDiv.innerHTML = 'Failed to delete container';
        }
    } catch (error) {
        console.error('Error deleting container:', error);
    }
}
