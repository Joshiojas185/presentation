
// const socket = io('wss://platformservers-1.onrender.com/');

const socket = io('https://presentationbackend.onrender.com/');


// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const nameInput = document.getElementById('name-input');
const roomInput = document.getElementById('room-input');
const joinBtn = document.getElementById('join-btn');
const playerList = document.getElementById('player-list');
const pdfRoom = document.getElementById('pdf-room');
const pdfCanvas = document.getElementById('pdfCanvas');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const thumbnailList = document.getElementById('thumbnail-list');

const liveBtn = document.getElementById('join-btn');


let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let myName = '';
let myRoom = '';
let isHost = true;

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

liveBtn.addEventListener('click', () => {
    const name = localStorage.getItem('userName') || 'guest';
    const roomName = 'tcs'; 
    if (name && roomName) {
        myName = name;
        myRoom = roomName;
        socket.emit('joinRoom', roomName, name);
        nameInput.style.display = 'none';
        roomInput.style.display = 'none';
        joinBtn.style.display = 'none';
    }
});

joinBtn.addEventListener('click', () => {
    const room = 'tcs';
    const roomName = room;
    const name = localStorage.getItem('userName'); // Use the name from local storage
    if (name && roomName) {
        myName = name;
        myRoom = roomName;
        socket.emit('joinRoom', roomName, name);
        nameInput.style.display = 'none';
        roomInput.style.display = 'none';
        joinBtn.style.display = 'none';
    }
});

window.onload = () =>{
    roomInput.value = 'tcs';
    nameInput.value = localStorage.getItem('userName');

    setTimeout(() => {
        joinBtn.click();
    }, 2000);

}

// window.onload = () => {
//     roomInput.value = 'tcs';
//     nameInput.value = localStorage.getItem('username');
//     setTimeout(() => {
//         joinBtn.click(); // Simulate click to join the room
//     }, 100);

//     const xyz = localStorage.getItem('username');
//     console.log(xyz);

//     const params = getQueryParams();
//     if (params.room) {
//         const playerName = params.name;
//         roomInput.value = params.room;
//         nameInput.value = playerName;

//         // Delay the join event to ensure the socket connection is established
//         setTimeout(() => {
//             joinBtn.click(); // Simulate click to join the room
//         }, 100); // Adjust the delay as needed (100ms is a good starting point)
//     }   
// };

// window.onload = () => {
//     // const playerName = localStorage.getItem('userName'); // Retrieve the user's name from local storage
//     // const room = "tcs"; // Fixed room name
//     // roomInput.value = room; // Set the room input value

//     // if (playerName) {
//     //     setTimeout(() => {
//     //         joinBtn.click();
//     //     }, 100);
//     //     // joinBtn.click(); // Automatically join the room
//     // }

//     setTimeout(() => {
//         liveBtn.click();
//     }, 200);
// };



const xyz = localStorage.getItem('userName');

function joinLive(roomName, playerName) {
    // Set the room and player name in the input fields
    document.getElementById('room-input').value = roomName;
    document.getElementById('name-input').value = playerName;

    // Simulate a click on the join button
    setTimeout(() => {
        joinBtn.click(); // Simulate click to join the room
    }, 100); 
    // document.getElementById('join-btn').click();
}


// Function to toggle full screen
function toggleFullScreen() {
    const canvas = pdfCanvas;
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Add event listener to the PDF canvas
pdfCanvas.addEventListener('click', toggleFullScreen);

// joinBtn.addEventListener('click', () => {
//     const room = 'tcs';
//     const roomName = room;
//     const name = localStorage.getItem('userName'); // Use the name from local storage
//     if (name && roomName) {
//         myName = name;
//         myRoom = roomName;
//         socket.emit('joinRoom', roomName, name);
//         nameInput.style.display = 'none';
//         roomInput.style.display = 'none';
//         joinBtn.style.display = 'none';
//     }
// });

// document.getElementById('joinButton').addEventListener('click', () => {
//     const name = localStorage.getItem('userName'); // Use the name from local storage
//     const room = document.getElementById('roomInput').value.trim();
    
//     if (name && room) {
//         socket.emit('joinRoom', room, name);
//         document.getElementById('roomInput').style.display = 'none';
//         document.getElementById('joinButton').style.display = 'none';
//         document.getElementById('raiseButton').style.display = 'inline';
//         document.getElementById('lowerButton').style.display = 'inline';
//     }
// });


socket.on('updatePlayers', (players) => {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.innerText = player.name;
        playerList.appendChild(li);
    });
});

// socket.on('hostAssigned', () => {
    isHost = true; // Set the host flag
    document.getElementById('thumbnail-container').style.display = 'flex'; 
// });

nextBtn.addEventListener('click', () => { // emit next btn event 
    socket.emit('nextPage', myRoom);
});

prevBtn.addEventListener('click', () => { // emit prev btn event
    socket.emit('prevPage', myRoom);
});

socket.on('pdfUploaded', (pdfPath) => {
    document.getElementById('waiting-room').style.display = 'none';
    pdfRoom.style.display = 'block'; // Show the PDF room
    loadPDF(pdfPath);
});

function loadPDF(pdfPath) {
    
    const fullPath = `https://presentationbackend.onrender.com${pdfPath}`;
   
    
    pdfjsLib.getDocument(fullPath).promise.then(pdf => {
        pdfDoc = pdf;
        totalPages = pdf.numPages;
        renderPage(currentPage);
        generateThumbnails();
    }).catch(error => {
        console.error("Error loading PDF:", error);
        alert("Failed to load PDF. Please check the console for more details.");
    });
}

function renderPage(num) {
    pdfDoc.getPage(num).then(page => {
        const canvas = pdfCanvas;
        const context = canvas.getContext("2d");
        const scale = 2.0; // Adjust scale as needed
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = { canvasContext: context, viewport: viewport };
        page.render(renderContext).promise.then(() => {
            console.log(`Rendered page ${num} for ${xyz}` );
        }).catch(error => {
            console.error("Error rendering page:", error);
        });
    }).catch(error => {
        console.error("Error getting page:", error);
    });
}

function generateThumbnails() {
    thumbnailList.innerHTML = ''; // Clear existing thumbnails
    let clickLock = false; // Lock to prevent multiple clicks

    for (let i = 1; i <= totalPages; i++) {
        pdfDoc.getPage(i).then(page => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext("2d");
            const scale = 0.3; // Thumbnail scale
            const viewport = page.getViewport({ scale });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.classList.add('thumbnail');

            // Render the page to the thumbnail canvas
            page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                // Set up the click event for the thumbnail with a lock
                canvas.addEventListener('click', () => {
                    if (clickLock) return; // Ignore clicks if lock is active
                    clickLock = true; // Lock further clicks
                    const selectedPage = i; // Page numbers start from 1
                    socket.emit('goToPage', myRoom, selectedPage); // Emit the page change event

                    setTimeout(() => {
                        clickLock = false; // Unlock clicks after 500ms
                    }, 500);
                });

                thumbnailList.appendChild(canvas); // Append the thumbnail to the list
            });
        });
    }
}



socket.on('pageChanged', (pageNumber) => {
    currentPage = pageNumber;
    renderPage(pageNumber); // This should update the PDF view to the selected page
});

function redirectToUpload() {
    window.location.href = "upload.html";
}


function toggleMenu() {
    let sidebar = document.getElementById("sidebar");
    let overlay = document.getElementById("overlay");
    
    if (sidebar.style.left === "-220px") {
        sidebar.style.left = "0";
        overlay.style.display = "block";
    } else {
        closeMenu();
    }
}

function closeMenu() {
    document.getElementById("sidebar").style.left = "-220px";
    document.getElementById("overlay").style.display = "none";
}

function redirectToPoll(){
    window.location.href = "../poll/index.html";
}

function redirectToQuery(){
    window.location.href = "../queries/index.html"
}



// const socket = io('http://10.33.0.21:5000'); // Update this to your server address

// const roomInput = document.getElementById('room-input');
// const nameInput = document.getElementById('name-input');
// const joinRoomBtn = document.getElementById('join-room-btn');
// const controlButtons = document.getElementById('control-buttons');

// joinRoomBtn.addEventListener('click', () => {
//     const roomName = roomInput.value.trim();
//     const playerName = nameInput.value.trim();
//     if (roomName && playerName) {
//         socket.emit('joinRoom', roomName, playerName);
//     } else {
//         alert("Please enter a room name and your name.");
//     }
// });

// socket.on('roomJoined', () => {
//     controlButtons.style.display = 'block'; // Show control buttons for the host
//     setupHostControls();
// });

// socket.on('hostAssigned', () => {
//     alert("You are now the host of the room!");
//     controlButtons.style.display = 'block'; // Show control buttons for the host
//     setupHostControls();
// });

// socket.on('roomNotAvailable', (data) => {
//     alert(data.message);
// });

// // Setup host controls
// function setupHostControls() {
//     document.getElementById('go-to-poll').addEventListener('click', () => {
//         const roomName = roomInput.value.trim();
//         socket.emit('redirect', { room: roomName, destination: 'poll/index.html' });
//     });

//     document.getElementById('go-to-pdf').addEventListener('click', () => {
//         // Prompt for PDF upload
//         const pdfInput = document.createElement('input');
//         pdfInput.type = 'file';
//         pdfInput.accept = 'application/pdf';
//         pdfInput.onchange = (event) => {
//             const file = event.target.files[0];
//             if (file) {
//                 const formData = new FormData();
//                 formData.append("pdf", file);

//                 // Upload the PDF
//                 fetch("http://10.33.0.21:5000/upload", { // Replace with your backend IP
//                     method: "POST",
//                     body: formData
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     alert(data.message);
//                     if (data.message.includes("successfully")) {
//                         // Emit event to notify that the host has uploaded a PDF
//                         const roomName = roomInput.value.trim();
//                         socket.emit('pdfUploaded', '/uploads/slides.pdf'); // Adjust path if necessary
//                     }
//                 })
//                 .catch(error => console.error("Error:", error));
//             }
//         };
//         pdfInput.click(); // Trigger the file input dialog
//     });

//     document.getElementById('go-to-query').addEventListener('click', () => {
//         const roomName = roomInput.value.trim();
//         socket.emit('redirect', { room: roomName, destination: 'query/index.html' });
//     });
// }

// // Listen for redirect events
// socket.on('redirectTo', (destination) => {
//     const roomName = roomInput.value.trim();
//     window.location.href = destination + '?room=' + roomName; // Redirect with room name
// });