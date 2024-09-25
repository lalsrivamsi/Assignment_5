class Main {
    static displayEntries() {
        const entries = Store.getEntries();
        entries.forEach((entry, index) => Main.addEntryToTable(entry, index));
    }

    static addEntryToTable(entry, index) {
        const tableBody = document.querySelector('#datagohere');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${entry.photo}" alt="User Photo" /></td>
            <td>${entry.name}</td>
            <td>${entry.mobile}</td>
            <td>${entry.car}</td>
            <td>${entry.color}</td>
            <td>${entry.licensePlate}</td>
            <td>${entry.parkingSlot}</td>
            <td>${entry.parkingFloor}</td>
            <td>${entry.entryDate}</td>
            <td>${entry.entryTime}</td>
            <td>${entry.exitDate}</td>
            <td>${entry.duration} hours</td>
            <td>${entry.vehicleType}</td>
            <td>${entry.type}</td>
            <td><button class="delete-btn" onclick="Main.deleteEntry(${index}, '${entry.mobile}')">Delete</button></td>
        `;
        tableBody.appendChild(row);
    }

    // The new searchTable function to filter rows based on search input
    static searchTable() {
        const searchValue = document.querySelector('#searchInput').value.toLowerCase();
        const tableRows = document.querySelectorAll('#datagohere tr');
        let isMatchFound = false;

        tableRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(searchValue)) {
                row.style.display = ''; // Show row if it matches the search
                isMatchFound = true;
            } else {
                row.style.display = 'none'; // Hide row if it doesn't match
            }
        });

        // Display message if no match is found
        const noMatchMessage = document.querySelector('#noMatchMessage');
        if (!isMatchFound) {
            noMatchMessage.style.display = 'block'; // Show "Please enter valid details" message
        } else {
            noMatchMessage.style.display = 'none'; // Hide the message if a match is found
        }
    }

    static deleteEntry(index, mobile) {
        const password = prompt("Enter password to delete this entry:");
        const correctPassword = "admin123";
        if (password === correctPassword) {
            Main.removeEntry(index);
        } else {
            const otp = Main.generateOTP();
            alert(`Incorrect password. An OTP has been sent to the mobile number: ${mobile}. OTP: ${otp}`);
            const enteredOTP = prompt("Enter the OTP sent to your mobile:");
            if (enteredOTP == otp) {
                Main.removeEntry(index);
            } else {
                Main.showAlert('Incorrect OTP. Entry not deleted.');
            }
        }
    }

    static removeEntry(index) {
        const entries = Store.getEntries();
        entries.splice(index, 1); 
        Store.updateEntries(entries);
        document.querySelector('#datagohere').innerHTML = ''; 
        Main.displayEntries();
        Main.showAlert('Entry successfully deleted.');
    }

    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    static showAlert(message) {
        alert(message);
    }

    static validateInputs() {
        const name = document.querySelector('#input-name').value;
        const mobile = document.querySelector('#input-mobile').value;
        const car = document.querySelector('#input-vname').value;
        const color = document.querySelector('#input-vcolor').value;
        const licensePlate = document.querySelector('#input-vnumber').value;
        const parkingSlot = document.querySelector('#input-pslot').value;
        const parkingFloor = document.querySelector('#input-floor').value;
        const entryDate = document.querySelector('#input-entry').value;
        const entryTime = document.querySelector('#input-entry-time').value;
        const exitDate = document.querySelector('#input-exit').value;
        const vehicleType = document.querySelector('#input-vehicletype').value;
        const type = document.querySelector('#input-type').value;
        const photo = document.querySelector('#input-photo').files[0];

        const licensePlateRegex = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;

        if (!name || !mobile || !car || !color || !licensePlate || !parkingSlot || !parkingFloor || !entryDate || !entryTime || !exitDate || !vehicleType || !type || !photo) {
            Main.showAlert('All fields must be filled, including a photo!');
            return false;
        }
        if (exitDate < entryDate) {
            Main.showAlert('Exit Date cannot be earlier than Entry Date');
            return false;
        }
        if (!licensePlateRegex.test(licensePlate)) {
            Main.showAlert('License Plate format is incorrect.');
            return false;
        }
        if (!/^\d{10}$/.test(mobile)) {
            Main.showAlert('Mobile number must be 10 digits.');
            return false;
        }
        return true;
    }

    static calculateDuration(entryDate, entryTime, exitDate) {
        const entryDateTime = new Date(`${entryDate}T${entryTime}`);
        const exitDateTime = new Date(`${exitDate}T23:59`);
        const diffMs = exitDateTime - entryDateTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        return diffHours;
    }

    static getBase64(file, callback) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => callback(reader.result);
        reader.onerror = (error) => console.log('Error: ', error);
    }
}

class Store {
    static getEntries() {
        let entries;
        if (localStorage.getItem('entries') === null) {
            entries = [];
        } else {
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }

    static addEntries(entry) {
        const entries = Store.getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    static updateEntries(entries) {
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}

document.addEventListener('DOMContentLoaded', Main.displayEntries);

document.querySelector('#cf').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!Main.validateInputs()) {
        return;
    }

    const name = document.querySelector('#input-name').value;
    const mobile = document.querySelector('#input-mobile').value;
    const car = document.querySelector('#input-vname').value;
    const color = document.querySelector('#input-vcolor').value;
    const licensePlate = document.querySelector('#input-vnumber').value;
    const parkingSlot = document.querySelector('#input-pslot').value;
    const parkingFloor = document.querySelector('#input-floor').value;
    const entryDate = document.querySelector('#input-entry').value;
    const entryTime = document.querySelector('#input-entry-time').value;
    const exitDate = document.querySelector('#input-exit').value;
    const vehicleType = document.querySelector('#input-vehicletype').value;
    const type = document.querySelector('#input-type').value;
    const photoFile = document.querySelector('#input-photo').files[0];

    const duration = Main.calculateDuration(entryDate, entryTime, exitDate);

    Main.getBase64(photoFile, (photoBase64) => {
        const entry = new Entry(name, mobile, car, color, licensePlate, parkingSlot, parkingFloor, entryDate, entryTime, exitDate, duration, vehicleType, type, photoBase64);

        Main.addEntryToTable(entry);
        Store.addEntries(entry);
        Main.showAlert('Entry successfully added with photo!');
    });
});

// Add the event listener for search input
document.querySelector('#searchInput').addEventListener('input', Main.searchTable);
