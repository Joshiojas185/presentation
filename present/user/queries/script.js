const socket = io('wss://platformservers.onrender.com/'); // Update this to your server address

const joinBtn = document.getElementById("joinButton");
const nameInput = document.getElementById('nameInput');
const roomInput = document.getElementById('roomInput');


function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let m;

    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
}

// window.onload = () => {
//     const params = getQueryParams();
//     if (params.room) {
//         const playerName = params.name 
//         roomInput.value = params.room;
//         nameInput.value = playerName;
//         joinBtn.click();
//     }   
// };

window.onload = () => {
    const playerName = localStorage.getItem('userName'); // Retrieve the user's name from local storage
    const room = "tcs"; // Fixed room name
    roomInput.value = room; // Set the room input value

    if (playerName) {
        joinBtn.click(); // Automatically join the room
    }
};



// document.getElementById('joinButton').addEventListener('click', () => {
//     const name = document.getElementById('nameInput').value.trim();
//     const room = document.getElementById('roomInput').value.trim();
    
//     if (name && room) {
//         socket.emit('joinRoom', room, name);
//         document.getElementById('nameInput').style.display = 'none';
//         document.getElementById('roomInput').style.display = 'none';
//         document.getElementById('joinButton').style.display = 'none';
//         document.getElementById('raiseButton').style.display = 'inline';
//         document.getElementById('lowerButton').style.display = 'inline';
//     }
// });


document.getElementById('joinButton').addEventListener('click', () => {
    const name = localStorage.getItem('userName'); // Use the name from local storage
    const room = document.getElementById('roomInput').value.trim();
    
    if (name && room) {
        socket.emit('joinRoom', room, name);
        document.getElementById('roomInput').style.display = 'none';
        document.getElementById('joinButton').style.display = 'none';
        document.getElementById('raiseButton').style.display = 'inline';
        document.getElementById('lowerButton').style.display = 'inline';
    }
});

// Listen for the 'updateHands' event from the server
socket.on('updateHands', (raisedHands) => {
    const handsList = document.getElementById('hands');
    handsList.innerHTML = ''; // Clear the current list
    raisedHands.forEach((name) => {
        const listItem = document.createElement('li');
        listItem.textContent = name; // Add the player's name to the list
        handsList.appendChild(listItem);
    });
});

// Emit the 'raiseHand' event when the raise button is clicked
document.getElementById('raiseButton').addEventListener('click', () => {
    socket.emit('raiseHand'); // Emit the event to the server
});

// Emit the 'lowerHand' event when the lower button is clicked
document.getElementById('lowerButton').addEventListener('click', () => {
    socket.emit('lowerHand'); // Emit the event to the server
});