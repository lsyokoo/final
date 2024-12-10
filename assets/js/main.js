document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // Breakpoints using CSS Media Queries... This is from online resources I found
    const breakpoints = {
        xlarge: '(min-width: 1281px) and (max-width: 1680px)',
        large: '(min-width: 981px) and (max-width: 1280px)',
        medium: '(min-width: 737px) and (max-width: 980px)',
        small: '(min-width: 481px) and (max-width: 736px)',
        xsmall: '(max-width: 480px)'
    };

    // Page load animations
    window.addEventListener("load", () => {
        setTimeout(() => body.classList.remove("is-preload"), 100);
    });

    // Smooth scrolling
    const scrollLinks = document.querySelectorAll("a[href^='#']");
    scrollLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            if (e.target.tagName !== 'INPUT') {
                e.preventDefault();
                const targetId = link.getAttribute("href").substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });
    

  

    // Utility function to add or remove class based on breakpoints
    const applyResponsiveClass = () => {
        Object.entries(breakpoints).forEach(([key, query]) => {
            if (window.matchMedia(query).matches) {
                body.classList.add(`is-${key}`);
            } else {
                body.classList.remove(`is-${key}`);
            }
        });
    };

    // Apply responsive classes on load and resize
    applyResponsiveClass();
    window.addEventListener("resize", applyResponsiveClass);
});



// fake the username registration
document.addEventListener('DOMContentLoaded', () => {

    const submitButton = document.getElementById('submit-username');
    const feedback = document.getElementById('feedback');
    
    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            const username = document.getElementById('name').value.trim();

            if (!username) {
                feedback.textContent = 'Please enter a username.';
                feedback.style.color = 'red';
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/username', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username }),
                });

                const result = await response.json();

                if (response.ok) {
                    feedback.textContent = 'Username registered successfully!';
                    feedback.style.color = 'green';
                } else {
                    feedback.textContent = `Error: ${result.message}`;
                    feedback.style.color = 'red';
                }
            } catch (error) {
                feedback.textContent = 'Unable to connect to the server.';
                feedback.style.color = 'red';
            }
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-username');
    const usernameInput = document.getElementById('name');
    const feedback = document.getElementById('feedback');

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            if (!username) {
                feedback.textContent = 'Please enter a username.';
                feedback.style.color = 'red';
                return;
            }

            // store name to localstorage
            localStorage.setItem('username', username);
            feedback.textContent = 'Username saved successfully!';
            feedback.style.color = 'green';
        });
    }
});




//rsvp
document.addEventListener('DOMContentLoaded', () => {
    const rsvpButton = document.getElementById('rsvp-submit');
    const rsvpFeedback = document.getElementById('rsvp-feedback');
    const rsvpListElement = document.getElementById('rsvp-list');

    // load rsvp list
    async function loadRSVPList() {
        try {
            const response = await fetch('http://localhost:3000/api/rsvp');
            const rsvpList = await response.json();
            rsvpListElement.innerHTML = '';
            rsvpList.forEach((username) => {
                const listItem = document.createElement('li');
                listItem.textContent = username;
                rsvpListElement.appendChild(listItem);
            });
        } catch (error) {
            rsvpFeedback.textContent = 'Failed to load RSVP list.';
            rsvpFeedback.style.color = 'red';
        }
    }

    // submit RSVP
    if (rsvpButton) {
        rsvpButton.addEventListener('click', async () => {
            const username = localStorage.getItem('username');
            if (!username) {
                rsvpFeedback.textContent = 'No username found. Please set your username on the Home page.';
                rsvpFeedback.style.color = 'red';
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/rsvp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username }),
                });

                const result = await response.json();

                if (response.ok) {
                    rsvpFeedback.textContent = result.message;
                    rsvpFeedback.style.color = 'green';
                    loadRSVPList(); // renew list
                } else {
                    rsvpFeedback.textContent = result.message;
                    rsvpFeedback.style.color = 'red';
                }
            } catch (error) {
                rsvpFeedback.textContent = 'Failed to submit RSVP.';
                rsvpFeedback.style.color = 'red';
            }
        });
    }


    loadRSVPList();
});


//clickable item pics for text
document.addEventListener('DOMContentLoaded', () => {
    const imageWrappers = document.querySelectorAll('.image-wrapper');

    imageWrappers.forEach((wrapper) => {
        wrapper.addEventListener('click', () => {
            wrapper.classList.toggle('active');

            // get description text
            const description = wrapper.nextElementSibling;
            if (description) {
                description.style.display =
                    description.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
});
