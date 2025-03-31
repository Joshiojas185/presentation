// const socket = io('wss://tcspoll.onrender.com/');
// const socket = io('http://192.168.29.153:5000')

const socket = io('wss://platformservers-2.onrender.com/')

const nameInput = document.getElementById('name-input');
const roomInput = document.getElementById('room-input');
const nextQuestionBtn = document.getElementById('next-btn');
const joinBtn = document.getElementById('join-btn');
const playerList = document.getElementById('player-list');
const quizFileInput = document.getElementById('quiz-file');
const timerInput = document.getElementById('timer-input');
const uploadBtn = document.getElementById('upload-btn');
const startBtn = document.getElementById('start-btn');
const waitingRoom = document.getElementById('waiting-room');
const quizRoom = document.getElementById('quiz-room');
const thankyouRoom = document.getElementById('thankyou-room');
const questionDisplay = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const timerDisplay = document.getElementById('timer-display');
const ctx = document.getElementById('voteChart').getContext('2d');
const emojiButtons = document.querySelectorAll('.emoji-btn');
const customEmojiButton = document.getElementById('custom-emoji-btn');
const mainContainer = document.getElementById('main-container'); // Reference to the main container
const thankyouMessage = document.getElementById('thankyou-message');

let isHost = false;
let voteChart;
let voted = false;
let isQuizLocked = false;

// Add this in the thank you room section
// const playAgainBtn = document.createElement('button');
// playAgainBtn.innerText = 'Play Again';
// playAgainBtn.onclick = () => {
//     socket.emit('playAgain', roomInput.value.trim());
// };
// thankyouRoom.appendChild(playAgainBtn);

// Listen for the resetQuiz event
// socket.on('resetQuiz', () => {
//     waitingRoom.style.display = 'block'; // Show the waiting room again
//     thankyouRoom.style.display = 'none'; // Hide the thank you room
//     playerList.innerHTML = ''; // Clear the player list
//     // Reset any other necessary UI elements
// });


const funnyNames = [
    'Silly Sloth', 'Wacky Walrus', 'Crazy Catfish', 'Dancing Dolphin', 'Jolly Jellyfish', 'Bouncing Bunny', 'Cheeky Chimpanzee', 'Sassy Seahorse', 'Ninja Narwhal', 'Funky Flamingo', 
    'Playful Penguin', 'Zany Zebra', 'Whimsical Wombat', 'Curious Cheetah', 'Artistic Antelope', 'Doodle Duck', 'Bubbly Bear', 'Giggly Goldfish', 'Singing Sparrow', 'Mischievous Mouse', 
    'Dapper Dingo', 'Charming Chipmunk', 'Frolicking Fox', 'Jumpy Jackrabbit', 'Silly Squirrel', 'Radiant Raccoon', 'Breezy Butterfly', 'Dizzy Dragonfly', 'Gleeful Goat', 'Hilarious Hedgehog', 
    'Jumpy Jellybean', 'Kooky Koala', 'Lively Llama', 'Nutty Newt', 'Punny Parrot', 'Quirky Quokka', 'Rambunctious Rabbit', 'Sassy Salamander', 'Ticklish Tortoise', 'Uplifted Unicorn', 
    'Vibrant Vulture', 'Witty Weasel', 'Zesty Zebra', 'Artful Alligator', 'Bouncy Bison', 'Charming Chinchilla', 'Dandy Dodo', 'Eccentric Emu', 'Funky Ferret', 'Giggling Gecko', 
    'Hopping Hedgehog', 'Incredible Iguana', 'Joyful Jaguar', 'Kooky Kangaroo', 'Lively Lemur', 'Merry Mongoose', 'Nifty Narwhal', 'Optimistic Otter', 'Peculiar Platypus', 'Quaint Quail', 
    'Radiant Rhino', 'Silly Seahorse', 'Twirling Tarantula', 'Uplifted Uakari', 'Vivid Viper', 'Wacky Wombat', 'Zany Zebu', 'Artistic Aardvark', 'Bubbly Bongo', 'Charming Corgi', 
    'Dizzy Dingo', 'Eager Eagle', 'Frolicking Ferret', 'Giggly Giraffe', 'Hilarious Hamster', 'Jolly Jaguar', 'Kooky Kiwi', 'Lively Lynx', 'Mischievous Magpie', 'Nutty Numbat', 
    'Punny Pika', 'Quirky Quoll', 'Rambunctious Raccoon', 'Sassy Squirrel', 'Ticklish Tapir', 'Uplifted Urchin', 'Vibrant Vole', 'Witty Wren', 'Zesty Zorilla', 'Artful Ant', 
    'Bouncy Beetle', 'Charming Chameleon', 'Dandy Dragon', 'Eccentric Elephant', 'Funky Fox', 'Giggling Goldfinch', 'Hopping Hummingbird', 'Incredible Impala', 'Joyful Jackal', 
    'Kooky Kookaburra', 'Lively Lark', 'Merry Moth', 'Nifty Nightingale', 'Optimistic Ocelot', 'Peculiar Pigeon', 'Quaint Quokka', 'Radiant Raptor', 'Silly Slug', 'Twirling Toad', 
    'Uplifted Ulysses', 'Vivid Vulture', 'Wacky Wren', 'Zany Zorse', 'Artistic Alpaca', 'Bubbly Binturong', 'Charming Cheetah', 'Dizzy Dodo', 'Eager Eel', 'Frolicking Fossa', 
    'Giggling Gibbon', 'Hilarious Hound', 'Jolly Jellybean', 'Kooky Kestrel', 'Lively Lark', 'Mischievous Marmoset', 'Nutty Nighthawk', 'Punny Puffin', 'Quirky Quokka', 
    'Rambunctious Raptor', 'Sassy Seahorse', 'Ticklish Tamarin', 'Uplifted Uakari', 'Vibrant Vervet', 'Witty Wombat', 'Zesty Zebu', 'Artful Aye-aye', 'Bouncy Bongo', 
    'Charming Capybara', 'Dandy Dromedary', 'Eccentric Eland', 'Funky Fennec', 'Giggling Gaur', 'Hopping Hedgehog', 'Incredible Ibis', 'Joyful Jerboa', 'Kooky Kudu', 
    'Lively Lemming', 'Merry Manta', 'Nifty Nudibranch', 'Optimistic Ocelot', 'Peculiar Pika', 'Quaint Quoll', 'Radiant Raccoon', 'Silly Sloth', 'Twirling Tortoise', 
    'Uplifted Urial', 'Vivid Viper', 'Wacky Wallaby', 'Zany Zorilla'
];

// Function to get query parameters from the URL
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

document.getElementById('lock-quiz-btn').addEventListener('click', () => {
    if (isHost) {
        socket.emit('lockQuiz', roomInput.value.trim());
    }
});



socket.on('quizLocked', (data) => {
    isQuizLocked = true;
    thankyouMessage.innerText = data.message; // Set the thank you message
    document.getElementById('lock-quiz-btn').style.display = 'none'; // Hide the button after locking

    // Clear the main container
    mainContainer.innerHTML = ''; // Clear all content in the main container
    mainContainer.appendChild(thankyouMessage); // Append the thank you message

    // Create an image element
    const thankYouImage = document.createElement('img');
    thankYouImage.src = data.image; // Set the image source
    thankYouImage.alt = "Thank You";
    thankYouImage.style.width = '300px'; // Set the desired width
    thankYouImage.style.height = 'auto'; // Maintain aspect ratio
    mainContainer.appendChild(thankYouImage); // Append the image

    const playAgainBtn = document.createElement('button');
playAgainBtn.innerText = 'Play Again';
playAgainBtn.onclick = () => {
    socket.emit('playAgain', roomInput.value.trim());
};
thankyouRoom.appendChild(playAgainBtn);

});


// Check for query parameters on page load
// window.onload = () => {
//     const params = getQueryParams();
//     if (params.room) {
//         // const playerName = params.name || funnyNames[Math.floor(Math.random() * funnyNames.length)];
//         // roomInput.value = params.room;
//         roomInput.value = 'tcs';
//         nameInput.value = localStorage.getItem('');
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


socket.on('roomNotAvailable', (data) => {
    waitingRoom.style.display = 'none';
    quizRoom.style.display = 'none';
    thankyouRoom.style.display = 'block'; // Show the thank you room
    thankyouMessage.innerText = data.message; // Set the thank you message

    // Create an image element
    const thankYouImage = document.createElement('img');
    thankYouImage.src = data.image; // Set the image source
    thankYouImage.alt = "Thank You";
    thankYouImage.style.width = '300px'; // Set the desired width
    thankYouImage.style.height = 'auto'; // Maintain aspect ratio
    mainContainer.appendChild(thankYouImage); // Append the image
});



emojiButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const emoji = event.target.dataset.emoji;
        const x = event.clientX;
        const y = event.clientY;

        socket.emit('sendEmoji', roomInput.value.trim(), emoji, { x, y });
        displayFloatingEmoji(emoji, { x, y });
    });
});

customEmojiButton.addEventListener('click', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    const customEmojiPath = 'codeup.png';
    socket.emit('sendEmoji', roomInput.value.trim(), customEmojiPath, { x, y });
    displayFloatingEmoji(customEmojiPath, { x, y });
});

socket.on('receiveEmoji', (emoji, position) => {
    displayFloatingEmoji(emoji, position);
});


function displayFloatingEmoji(emoji, position) {
    const emojiElement = document.createElement('div');

    if (emoji.endsWith('.png')) {
        const img = document.createElement('img');
        img.src = emoji;
        img.style.width = '32px';
        img.style.height = '32px';
        emojiElement.appendChild(img);
    } else {
        emojiElement.innerText = emoji;
    }

    emojiElement.classList.add('floating-emoji');

    // Calculate the position for the emoji
    const headerHeight = document.getElementById('header').offsetHeight;
    const emojiContainer = document.getElementById('emoji-container');
    const emojiContainerRect = emojiContainer.getBoundingClientRect();

    // Randomly choose a vertical position between the bottom of the header and the top of the emoji container
    const minY = headerHeight + 20; // 20px below the header
    const maxY = emojiContainerRect.top - 100; // 20px above the emoji container
    const randomY = Math.random() * (maxY - minY) + minY; // Random Y position within the range

    const x = position.x; // Use the x position from the click

    emojiElement.style.left = `${x}px`;
    emojiElement.style.top = `${randomY}px`; // Set the random Y position

    document.body.appendChild(emojiElement);

    // Remove the emoji after 3-4 seconds
    setTimeout(() => {
        emojiElement.remove();
    }, 3000); 
}



socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('timerEnded', () => {
    timerDisplay.innerText = '';
    timerDisplay.style.display = 'none';
    socket.emit('updateVotes', roomInput.value.trim()); // Emit to show the vote results
});


socket.on('updateVotes', (voteData) => {
    if (voteChart) {
        voteChart.data.datasets[0].data = voteData; // Update the chart data with the current vote counts
        voteChart.update();
    }
});


let myName = ''; // Variable to store the user's name

joinBtn.addEventListener('click', () => {
    // const name = nameInput.value.trim();
    const name = localStorage.getItem('userName');
    const roomName = roomInput.value.trim();
    if (name && roomName) {
        myName = name; // Store the user's name
        socket.emit('joinRoom', roomName, name);
        nameInput.style.display = 'none';
        roomInput.style.display = 'none';
        joinBtn.style.display = 'none';
    }
});


socket.on('updatePlayers', (players) => {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        // Check if the player is the current user
        if (player.name === myName) {
            const youSpan = document.createElement('span');
            youSpan.innerText = ' (You)';
            youSpan.style.opacity = '0.5'; // Set the opacity directly
            youSpan.style.fontWeight = 'normal'; // Optional: make it less bold
            li.innerText = player.name; // Set the player's name
            li.appendChild(youSpan); // Append the "You" span to the list item
        } else {
            li.innerText = player.name; // Just show the name for others
        }
        playerList.appendChild(li);
    });
});



socket.on('hostAssigned', () => {
    isHost = false;
    quizFileInput.style.display = 'block';
    timerInput.style.display = 'block';
    uploadBtn.style.display = 'block';
    document.getElementById('lock-quiz-btn').style.display = 'block';
});

uploadBtn.addEventListener('click', () => {
    const file = quizFileInput.files[0];
    const timer = timerInput.value.trim();
    if (file && timer) {
        const reader = new FileReader();
        reader.onload = (e) => {
            socket.emit('uploadQuiz', roomInput.value.trim(), e.target.result, timer);
        };
        reader.readAsText(file);
    }
});

socket.on('quizUploaded', (count) => {
    if (isHost) startBtn.style.display = 'block';
});

startBtn.addEventListener('click', () => {
    socket.emit('startQuiz', roomInput.value.trim());
});

socket.on('quizStarted', (question) => {
    localStorage.removeItem('quizLocked');

    waitingRoom.style.display = 'none';
    quizRoom.style.display = 'block';
    displayQuestion(question);
    timerDisplay.style.display = 'block';
});


function displayQuestion(question) {
    questionDisplay.innerText = question.text;
    optionsContainer.innerHTML = '';
    
    // Create buttons for each option
    question.options.forEach((option, index) => {
        const btn = document.createElement('div');
        btn.innerText = option;
        btn.classList.add('option-button');
        btn.onclick = () => {
            if (!voted) {
                socket.emit('vote', roomInput.value.trim(), String.fromCharCode(65 + index)); // Send the vote
                voted = true;
                btn.classList.add('voted');
                btn.style.backgroundColor = 'rgba(17, 0, 128, 0.32)';
            }
        };
        optionsContainer.appendChild(btn);
    });

    // Update the chart with the current question's options
    updateVoteChart(question.options);

    if (isHost) nextQuestionBtn.style.display = 'block';
}


function updateVoteChart(options) {
    const labels = options; // Use the actual options as labels
    const optionCount = options.length; // Get the number of options

    // Define your color array
    const colors = ['#B3A7FF',  '#FF538D','#3D83FF', '#FFE87A'];

    if (!voteChart) {
        voteChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels, // Set the labels to the actual options
                datasets: [{
                    label: 'Votes',
                    backgroundColor: colors.slice(0, optionCount), // Limit colors to the number of options
                    data: Array(optionCount).fill(0) // Initialize votes to 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1.5,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        voteChart.data.labels = labels; // Update the labels to the actual options
        voteChart.data.datasets[0].data = Array(optionCount).fill(0); // Reset votes to 0
        voteChart.data.datasets[0].backgroundColor = colors.slice(0, optionCount); // Update colors based on the number of options
        voteChart.update();
    }
}



nextQuestionBtn.addEventListener('click', () => {
    socket.emit('nextQuestion', roomInput.value.trim());
    timerDisplay.style.display = 'block';
});

socket.on('nextQuestion', (question) => {
    displayQuestion(question);
    voted = false;
    timerDisplay.style.display = 'block';
});

socket.on('updateTimer', (timeLeft) => {
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
        timerDisplay.innerText = '';
    }
});

// socket.on('quizEnded', () => {
//     waitingRoom.style.display = 'none';
//     quizRoom.style.display = 'none';
//     thankyouRoom.style.display = 'block';
//     if (isQuizLocked) {
//         thankyouMessage.innerText = "Thank you for joining the quiz!";
//         document.getElementById('lock-quiz-btn').style.display = 'none'; // Hide the button if locked
//     }

// });

socket.on('quizEnded', () => {
    waitingRoom.style.display = 'none';
    quizRoom.style.display = 'none';
    thankyouRoom.style.display = 'block';

    if (isQuizLocked) {
        thankyouMessage.innerText = "Thank you for joining the quiz!";
        document.getElementById('lock-quiz-btn').style.display = 'none'; // Hide the button if locked
    }

    // Show the Play Again button
    document.getElementById('play-again-btn').style.display = 'none'; // Show the Play Again button
});

// Add event listener for the Play Again button
document.getElementById('play-again-btn').addEventListener('click', () => {
    socket.emit('playAgain', roomInput.value.trim());
});

// Reset the UI when the quiz is reset
// socket.on('resetQuiz', () => {
//     waitingRoom.style.display = 'block'; // Show the waiting room again
//     thankyouRoom.style.display = 'none'; // Hide the thank you room
//     playerList.innerHTML = ''; // Clear the player list
//     // Reset any other necessary UI elements
// });

// socket.on('resetQuiz', () => {
//     waitingRoom.style.display = 'block'; // Show the waiting room again
//     thankyouRoom.style.display = 'none'; // Hide the thank you room

//     // Clear the player list
//     playerList.innerHTML = ''; // Clear the player list

//     // Show the input fields and join button again
//     nameInput.style.display = 'block';
//     roomInput.style.display = 'block';
//     joinBtn.style.display = 'block';

//     // If the user is the host, show the upload options
//     if (isHost) {
//         quizFileInput.style.display = 'block';
//         timerInput.style.display = 'block';
//         uploadBtn.style.display = 'block';
//         document.getElementById('lock-quiz-btn').style.display = 'block'; // Show the lock quiz button
//     } else {
//         // Hide upload options for non-hosts
//         quizFileInput.style.display = 'none';
//         timerInput.style.display = 'none';
//         uploadBtn.style.display = 'none';
//         document.getElementById('lock-quiz-btn').style.display = 'none'; // Hide the lock quiz button
//     }

//     // Emit an event to get the current players in the room
//     socket.emit('getCurrentPlayers', roomInput.value.trim());
// });

socket.on('resetQuiz', () => {
    waitingRoom.style.display = 'block'; // Show the waiting room again
    thankyouRoom.style.display = 'none'; // Hide the thank you room

    // Clear the player list
    playerList.innerHTML = ''; // Clear the player list

    // Hide the input fields
    nameInput.style.display = 'none'; // Hide the name input
    roomInput.style.display = 'none'; // Hide the room input
    joinBtn.style.display = 'none'; // Hide the Join button

    // If the user is the host, show the upload options
    if (isHost) {
        quizFileInput.style.display = 'block';
        timerInput.style.display = 'block';
        uploadBtn.style.display = 'block';
        document.getElementById('lock-quiz-btn').style.display = 'block'; // Show the lock quiz button
    } else {
        // Hide upload options for non-hosts
        quizFileInput.style.display = 'none';
        timerInput.style.display = 'none';
        uploadBtn.style.display = 'none';
        document.getElementById('lock-quiz-btn').style.display = 'none'; // Hide the lock quiz button
    }

    // Emit an event to get the current players in the room
    socket.emit('getCurrentPlayers', roomInput.value.trim());
});

socket.on('currentPlayers', (players) => {
    playerList.innerHTML = ''; // Clear the player list
    players.forEach(player => {
        const li = document.createElement('li');
        // Check if the player is the current user
        if (player.name === myName) {
            const youSpan = document.createElement('span');
            youSpan.innerText = ' (You)';
            youSpan.classList.add('you-label'); // Add a class for styling
            li.innerText = player.name; // Set the player's name
            li.appendChild(youSpan); // Append the "You" span to the list item
        } else {
            li.innerText = player.name; // Just show the name for others
        }
        playerList.appendChild(li);
    });
});

// // Listen for the current players update
// socket.on('currentPlayers', (players) => {
//     playerList.innerHTML = ''; // Clear the player list
//     players.forEach(player => {
//         const li = document.createElement('li');
//         li.innerText = player.name; // Add player name to the list
//         playerList.appendChild(li);
//     });
// });

// Listen for the current players update
// socket.on('currentPlayers', (players) => {
//     playerList.innerHTML = ''; // Clear the player list
//     players.forEach(player => {
//         const li = document.createElement('li');
//         li.innerText = player.name; // Add player name to the list
//         playerList.appendChild(li);
//     });
// });



document.getElementById('end-poll-btn').addEventListener('click', () => {
    socket.emit('endPoll', roomInput.value.trim());
});

socket.on('redirect', (data) => {
    window.location.href = data.url; // Redirect to the specified URL
});