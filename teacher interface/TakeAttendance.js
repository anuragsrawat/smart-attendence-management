  // Initialize 4x4 matrix
  const matrixContainer = document.getElementById('matrix');
  const message = document.getElementById('message');
  const startButton = document.getElementById('startButton');
  const locationButton = document.getElementById('locationButton');
  const locationInfo = document.getElementById('locationInfo');
  const winMessage = document.getElementById('winMessage');
  let timer;


  for (let i = 0; i < 16; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('id', `cell-${i}`);
      matrixContainer.appendChild(cell);
  }

  function shuffleAndDisplayMatrix() {

      const randomPositions = [];
      while (randomPositions.length < 5) {
          const randomPos = Math.floor(Math.random() * 16);
          if (!randomPositions.includes(randomPos)) {
              randomPositions.push(randomPos);
          }
      }

    
      const sequenceNumbers = [1, 2, 3, 4, 5];
      const cells = document.querySelectorAll('.cell');
      cells.forEach(cell => cell.textContent = '');

      for (let i = 0; i < sequenceNumbers.length; i++) {
          const position = randomPositions[i];
          document.getElementById(`cell-${position}`).textContent = sequenceNumbers[i];
      }
  }

  function startShuffling() {
      // Display matrix and hide start button
      matrixContainer.style.visibility = 'visible';
      startButton.style.visibility = 'hidden';

      // Wait for 3 seconds before starting the shuffle
      setTimeout(() => {
          let shuffleCount = 0;

          // Display the first shuffle immediately after 3 seconds
          shuffleAndDisplayMatrix();
          shuffleCount++;

          // Perform shuffling every 7 seconds
          timer = setInterval(() => {
              shuffleAndDisplayMatrix();
              shuffleCount++;

              if (shuffleCount === 3) {
                  clearInterval(timer);
                  setTimeout(() => {
                      // Hide matrix and show message with location button
                      matrixContainer.style.visibility = 'hidden';
                      message.style.visibility = 'visible';
                  }, 3000); // Wait for 3 seconds after the last shuffle
              }
          }, 7000); // Shuffle every 7 seconds

      }, 3000); // Wait for 3 seconds before the first shuffle
  }

  function getLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
          locationInfo.textContent = "Geolocation is not supported by this browser.";
      }
  }

  function showPosition(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      locationInfo.textContent = `Latitude: ${lat}, Longitude: ${lon}`;
      // Show the win message
      winMessage.style.visibility = 'visible';
  }

  function showError(error) {
      switch(error.code) {
          case error.PERMISSION_DENIED:
              locationInfo.textContent = "User denied the request for Geolocation.";
              break;
          case error.POSITION_UNAVAILABLE:
              locationInfo.textContent = "Location information is unavailable.";
              break;
          case error.TIMEOUT:
              locationInfo.textContent = "The request to get user location timed out.";
              break;
          case error.UNKNOWN_ERROR:
              locationInfo.textContent = "An unknown error occurred.";
              break;
      }
  }

  // Add event listener to start button
  startButton.addEventListener('click', startShuffling);

  // Add event listener to location button
  locationButton.addEventListener('click', getLocation);