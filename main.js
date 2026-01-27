// Test log to verify script is loading
console.log('main.js loaded successfully');

// Mock users for authentication
const MOCK_USERS = {
  'rachel': 'Rachel@123',
  'jack': 'Jack@123'
};

// Mock games data
const MOCK_GAMES = [
  { id: 1, title: 'Epic Quest Adventure', description: 'Embark on an epic journey through mystical lands', image: 'asset/Epic Quest Adventure.jpeg' },
  { id: 2, title: 'Space Battle Arena', description: 'Fight for survival in the depths of space', image: 'asset/Space Battle Arena.jpeg' },
  { id: 3, title: 'Racing Champions', description: 'Speed through challenging tracks and win the championship', image: 'asset/Racing Champions.jpeg' },
  { id: 4, title: 'Puzzle Master', description: 'Solve mind-bending puzzles and unlock mysteries', image: 'asset/Puzzle Master.jpg' },
  { id: 5, title: 'Fantasy Kingdom', description: 'Build and rule your own magical kingdom', image: 'asset/Fantasy Kingdom.jpeg' },
  { id: 6, title: 'Zombie Survival', description: 'Survive the zombie apocalypse in this action-packed game', image: 'asset/Zombie Survival.jpg' },
  { id: 7, title: 'Sports Legends', description: 'Become a legend in multiple sports disciplines', image: 'asset/Sports Legends.jpeg' },
  { id: 8, title: 'Mystery Detective', description: 'Solve crimes and uncover the truth', image: 'asset/Mystery Detective.jpeg' },
  { id: 9, title: 'Dragon Warriors', description: 'Battle dragons and save the realm', image: 'asset/Dragon Warriors.jpg' },
  { id: 10, title: 'City Builder Pro', description: 'Design and manage your dream city', image: 'asset/City Builder Pro.jpeg' }
];

// Mock last played games
const MOCK_LAST_PLAYED = [
  { id: 1, title: 'Epic Quest Adventure', image: 'asset/Epic Quest Adventure.jpeg' },
  { id: 3, title: 'Racing Champions', image: 'asset/Racing Champions.jpeg' },
  { id: 5, title: 'Fantasy Kingdom', image: 'asset/Fantasy Kingdom.jpeg' },
  { id: 7, title: 'Sports Legends', image: 'asset/Sports Legends.jpeg' },
  { id: 9, title: 'Dragon Warriors', image: 'asset/Dragon Warriors.jpg' }
];

// Mock new games
const MOCK_NEW_GAMES = [
  { id: 2, title: 'Space Battle Arena', image: 'asset/Space Battle Arena.jpeg' },
  { id: 4, title: 'Puzzle Master', image: 'asset/Puzzle Master.jpg' },
  { id: 6, title: 'Zombie Survival', image: 'asset/Zombie Survival.jpg' },
  { id: 8, title: 'Mystery Detective', image: 'asset/Mystery Detective.jpeg' },
  { id: 10, title: 'City Builder Pro', image: 'asset/City Builder Pro.jpeg' }
];

// Authentication functions
function login(username, password) {
  const storedPassword = MOCK_USERS[username.toLowerCase()];
  if (storedPassword && storedPassword === password) {
    localStorage.setItem('loggedInUser', username);
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('dashboardNotifications'); // Clear all notifications on logout
  window.location.href = 'index.html';
}

function isLoggedIn() {
  return localStorage.getItem('loggedInUser') !== null;
}

function getLoggedInUser() {
  return localStorage.getItem('loggedInUser');
}

// Check authentication on protected pages
function checkAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// Track game play state
let gamePlayStartTime = null;
let networkCheckTimeout = null;
let currentPlayingGameId = null;

// Start playing a game - make it globally accessible
window.startGame = function(gameId, gameTitle) {
  console.log('startGame called with:', gameId, gameTitle);
  
  const video = document.getElementById('dashboard-video');
  const overlay = document.getElementById('network-overlay');
  const gameTitleDiv = document.getElementById('game-title');
  const gameTitleText = gameTitleDiv ? gameTitleDiv.querySelector('h2') : null;
  const playGameMessage = document.getElementById('play-game-message');
  
  console.log('Elements found:', {
    video: !!video,
    playGameMessage: !!playGameMessage,
    gameTitleDiv: !!gameTitleDiv
  });
  
  if (!video) {
    console.log('Video not found, returning');
    return;
  }
  
  // Set current playing game
  currentPlayingGameId = gameId;
  
  // Hide "Play Game" message when game starts
  if (playGameMessage) {
    console.log('Play game message found, removing it');
    playGameMessage.remove();
  } else {
    console.log('Play game message NOT found!');
  }
  
  // Show and set game title
  if (gameTitleDiv && gameTitleText) {
    gameTitleText.textContent = gameTitle;
    gameTitleDiv.classList.remove('hidden');
  }
  
  // Hide overlay if visible
  if (overlay) {
    overlay.classList.add('hidden');
  }
  
  // Reset and start video
  video.currentTime = 0;
  video.play().catch(err => {
    console.log('Autoplay prevented:', err);
  });
  
  // Record game start time
  gamePlayStartTime = Date.now();
  
  // Clear any existing timeout
  if (networkCheckTimeout) {
    clearTimeout(networkCheckTimeout);
  }
  
  // After 30 seconds of play, check connectivity
  networkCheckTimeout = setTimeout(() => {
    checkNetworkConnectivity();
  }, 5000);
  
  // Re-render game lists to update highlighting and button states
  if (typeof window.renderLastPlayed === 'function') {
    window.renderLastPlayed();
  }
  if (typeof window.renderNewGames === 'function') {
    window.renderNewGames();
  }
}

// Check network connectivity after 30 seconds
function checkNetworkConnectivity() {
  const video = document.getElementById('dashboard-video');
  const overlay = document.getElementById('network-overlay');
  const modal = document.getElementById('apology-modal');
  const notificationPanel = document.getElementById('notification-panel');
  
  // After 30 seconds of play, router goes down and game stalls
  // Simulating router going down - always trigger after 30 seconds
  
  // Commented out: Dynamic internet offline detection
  // Check internet connectivity using navigator.onLine
  // const isOffline = !navigator.onLine;
  // Only trigger if actually offline
  // if (isOffline) {
  
  // Pause video (router goes down, game stalls)
  if (video) {
    video.pause();
  }
  
  // Show overlay with warning message
  if (overlay) {
    overlay.classList.remove('hidden');
  }
  
  // After 2 seconds, show modal
  setTimeout(() => {
    if (modal) {
      modal.classList.remove('hidden');
    }
    
    // Add notification to panel
    if (notificationPanel) {
      const notificationHTML = `
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm text-yellow-700">
                <strong>Issue localized:</strong> ISP bandwidth issue
              </p>
              <p class="mt-2 text-sm text-yellow-700">
                <a href="incident.html" class="font-medium underline text-yellow-800 hover:text-yellow-900">View incident details</a>
              </p>
            </div>
          </div>
        </div>
      `;
      notificationPanel.innerHTML = notificationHTML + notificationPanel.innerHTML;
      
      // Save all notifications to localStorage array so they persist when navigating back
      let notifications = JSON.parse(localStorage.getItem('dashboardNotifications') || '[]');
      notifications.push(notificationHTML);
      localStorage.setItem('dashboardNotifications', JSON.stringify(notifications));
    }
  }, 2000);
  // } // End of commented out dynamic detection
}

// Dashboard video and network simulation
function initDashboard() {
  const video = document.getElementById('dashboard-video');
  const notificationPanel = document.getElementById('notification-panel');
  
  if (!video) return;
  
  // Video should be stopped by default - do not autoplay
  video.pause();
  video.currentTime = 0;
  
  // Reset game play state
  gamePlayStartTime = null;
  networkCheckTimeout = null;
  
  // Restore all notifications from localStorage if they exist
  if (notificationPanel) {
    const savedNotifications = JSON.parse(localStorage.getItem('dashboardNotifications') || '[]');
    if (savedNotifications.length > 0) {
      // Reverse array so latest notifications appear on top
      const reversedNotifications = savedNotifications.slice().reverse();
      const allNotificationsHTML = reversedNotifications.join('');
      notificationPanel.innerHTML = allNotificationsHTML;
    }
  }
}

// Close modal function
function closeModal() {
  const modal = document.getElementById('apology-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Add notification to panel and localStorage
window.addNotification = function(message) {
  const notificationPanel = document.getElementById('notification-panel');
  if (!notificationPanel) return;
  
  const notificationHTML = `
    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm text-blue-700">${message}</p>
        </div>
      </div>
    </div>
  `;
  
  notificationPanel.innerHTML = notificationHTML + notificationPanel.innerHTML;
  
  // Save to localStorage
  let notifications = JSON.parse(localStorage.getItem('dashboardNotifications') || '[]');
  notifications.push(notificationHTML);
  localStorage.setItem('dashboardNotifications', JSON.stringify(notifications));
}

// Handle compensation form submission
window.handleCompensationSubmit = function(event) {
  event.preventDefault();
  const form = event.target;
  const selectedCompensation = form.querySelector('input[name="compensation"]:checked');
  
  if (selectedCompensation) {
    const compensationType = selectedCompensation.value;
    const compensationText = compensationType === 'bonus' ? '$10 Bonus' : '15 Min Free Pass';
    
    // Add notification for compensation submission
    addNotification('Compensation submitted: ' + compensationText);
    
    // Close the compensation modal
    closeModal();
    
    // After 2 seconds, show feedback modal
    setTimeout(() => {
      const feedbackModal = document.getElementById('feedback-modal');
      if (feedbackModal) {
        feedbackModal.classList.remove('hidden');
      }
    }, 2000);
  }
}

// Handle feedback form submission
window.handleFeedbackSubmit = function(event) {
  event.preventDefault();
  const form = event.target;
  const selectedFeedback = form.querySelector('input[name="feedback"]:checked');
  
  if (selectedFeedback) {
    const feedbackType = selectedFeedback.value;
    const feedbackText = feedbackType === 'smile' ? '😊 Smile' : '😢 Sad';
    
    // Add notification for feedback submission
    addNotification('Feedback submitted: ' + feedbackText);
    
    // Close the feedback modal
    const feedbackModal = document.getElementById('feedback-modal');
    if (feedbackModal) {
      feedbackModal.classList.add('hidden');
    }
    
    // Resume the game
    const video = document.getElementById('dashboard-video');
    const overlay = document.getElementById('network-overlay');
    
    if (video) {
      video.play().catch(err => {
        console.log('Video play error:', err);
      });
      
      // Hide overlay
      if (overlay) {
        overlay.classList.add('hidden');
      }
      
      // Add notification for game resume
      addNotification('Game resumed');
    }
  }
}

// Update visual feedback when emoji is selected
window.updateFeedbackSelection = function() {
  const smileRadio = document.querySelector('input[name="feedback"][value="smile"]');
  const sadRadio = document.querySelector('input[name="feedback"][value="sad"]');
  const smileEmoji = document.getElementById('emoji-smile');
  const sadEmoji = document.getElementById('emoji-sad');
  const smileLabel = document.getElementById('label-smile');
  const sadLabel = document.getElementById('label-sad');
  
  // Reset both emojis
  if (smileEmoji) {
    smileEmoji.classList.remove('feedback-selected');
    smileEmoji.style.filter = 'grayscale(100%)';
    smileEmoji.style.opacity = '0.5';
  }
  if (sadEmoji) {
    sadEmoji.classList.remove('feedback-selected');
    sadEmoji.style.filter = 'grayscale(100%)';
    sadEmoji.style.opacity = '0.5';
  }
  if (smileLabel) {
    smileLabel.classList.remove('label-selected');
    smileLabel.style.color = '';
    smileLabel.style.fontWeight = '';
  }
  if (sadLabel) {
    sadLabel.classList.remove('label-selected');
    sadLabel.style.color = '';
    sadLabel.style.fontWeight = '';
  }
  
  // Apply selected style to checked option
  if (smileRadio && smileRadio.checked && smileEmoji) {
    smileEmoji.classList.add('feedback-selected');
    if (smileLabel) {
      smileLabel.classList.add('label-selected');
    }
  }
  if (sadRadio && sadRadio.checked && sadEmoji) {
    sadEmoji.classList.add('feedback-selected');
    if (sadLabel) {
      sadLabel.classList.add('label-selected');
    }
  }
}

