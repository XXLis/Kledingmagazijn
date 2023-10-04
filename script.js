// Functie om gegevens op te halen uit localStorage
function getDataFromLocalStorage() {
    const data = localStorage.getItem('clothingData');
    return data ? JSON.parse(data) : [];
}



// Functie om de JSON-data op te slaan in localStorage
function saveDataToLocalStorage(data) {
    localStorage.setItem('clothingData', JSON.stringify(data));
}

// Functie om de kledingitems op de pagina weer te geven
function displayClothingItems(items) {
    const clothingContainer = document.getElementById('clothing-container');
    clothingContainer.innerHTML = '';

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');

        const namePara = document.createElement('p');
        namePara.textContent = item.name;

        const sizePara = document.createElement('p');
        sizePara.textContent = `Size: ${item.size}`;

        const amountPara = document.createElement('p');
        amountPara.textContent = `Amount: ${item.amount}`;

        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.addEventListener('click', () => {
            item.amount++;
            amountPara.textContent = `Amount: ${item.amount}`;
            saveDataToLocalStorage(items);
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = '-';
        removeButton.addEventListener('click', () => {
            item.amount--;
            if (item.amount === 0) {
                const index = items.indexOf(item);
                items.splice(index, 1);
                itemDiv.remove();
            } else {
                amountPara.textContent = `Amount: ${item.amount}`;
            }
            saveDataToLocalStorage(items);
        });

        itemDiv.appendChild(namePara);
        itemDiv.appendChild(sizePara);
        itemDiv.appendChild(amountPara);
        itemDiv.appendChild(addButton);
        itemDiv.appendChild(removeButton);

        clothingContainer.appendChild(itemDiv);
    });
}




// Functie om de JSON-data op te halen uit een extern bestand
function getDataFromJSON(callback) {
    fetch('clothing.json')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error fetching JSON:', error));
}

// Functie om de kledingitems te updaten in het JSON-bestand
function updateDataInJSON(data) {
    saveDataToLocalStorage(data);
    fetch('clothing.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (response.ok) {
                console.log('Data updated in JSON file');
            } else {
                console.error('Failed to update data in JSON file');
            }
        })
        .catch(error => console.error('Error updating data in JSON file:', error));
}

// Hoofdlogica
document.addEventListener('DOMContentLoaded', () => {
    let items = getDataFromLocalStorage();

    getDataFromJSON(data => {
        if (items.length === 0) {
            items = data;
        } else {
            items = data.map(item => {
                const matchingItem = items.find(i => i.name === item.name && i.size === item.size);
                if (matchingItem) {
                    item.amount = matchingItem.amount;
                }
                return item;
            });
        }
        saveDataToLocalStorage(items);
        displayClothingItems(items);
    });

    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const size = button.getAttribute('data-size');
            filterBySize(size);
        });
    });

    const resetButton = document.querySelector('.filter-button[data-size=""]');
    resetButton.addEventListener('click', resetFilter);

    function filterBySize(size) {
        const filteredItems = size ? items.filter(item => item.size === size) : items;
        displayClothingItems(filteredItems);
    }

    function resetFilter() {
        displayClothingItems(items);
    }
});
