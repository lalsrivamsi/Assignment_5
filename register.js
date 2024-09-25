document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.querySelector('#registration-form');
  
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const username = document.querySelector('#reg-username').value;
      const password = document.querySelector('#reg-password').value;
      const accountType = document.querySelector('#reg-type').value;
  
      // Simple validation
      if (username === '' || password === '') {
        alert('All fields are required!');
        return;
      }
  
      // Store the registration data in localStorage or handle it as needed
      const user = { username, password, accountType }; 
      localStorage.setItem('user', JSON.stringify(user));
  
      alert('Registration successful! Redirecting to the login page.');
      window.location.href = 'index.html'; // Redirect to the index page after registration
    });
  });
  