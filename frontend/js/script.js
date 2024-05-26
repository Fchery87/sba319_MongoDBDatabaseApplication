document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;

    if (pathname.includes('movies.html')) {
        fetchMovies('movie-list');
        const addMovieForm = document.getElementById('add-movie-form');
        if (addMovieForm) {
            addMovieForm.addEventListener('submit', handleAddMovie);
        }
    } else if (pathname.includes('reviews.html')) {
        fetchMoviesForDropdown('movie-dropdown');
        fetchReviews('review-list');
        const addReviewForm = document.getElementById('add-review-form');
        if (addReviewForm) {
            addReviewForm.addEventListener('submit', handleAddReview);
        }
    } else if (pathname.includes('users.html')) {
        fetchUsers('user-list');
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignUp);
        }
    } else if (pathname.includes('index.html') || pathname === '/') {
        fetchMovies('home-movie-list');
        const homeReviewList = document.getElementById('home-review-list');
        if (homeReviewList) {
            fetchReviews('home-review-list');
        }
    }

    const writeReviewForm = document.getElementById('write-review-form');
    if (writeReviewForm) {
        writeReviewForm.addEventListener('submit', handleAddReviewModal);
    }
});

async function fetchMovies(elementId) {
    try {
        const response = await fetch('http://localhost:4000/movies');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const movies = await response.json();
        console.log('Fetched movies:', movies); // Log the fetched movies

        const movieList = document.getElementById(elementId);
        if (!movieList) {
            console.error('Element with id ' + elementId + ' not found.');
            return;
        }
        movieList.innerHTML = ''; // Clear the list before adding new elements
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.imageUrl}" alt="${movie.title}" class="movie-cover">
                <h3>${movie.title}</h3>
                <p><strong>Director:</strong> ${movie.director}</p>
                <p><strong>Writers:</strong> ${movie.writers.join(', ')}</p>
                <p><strong>Stars:</strong> ${movie.stars.join(', ')}</p>
                <p><strong>Release Year:</strong> ${movie.releaseYear}</p>
                <p><strong>Genre:</strong> ${movie.genre}</p>
                <p>${movie.description}</p>
                <div class="buttons">
                    <button onclick="toggleReviews('${movie._id}')">View Reviews</button>
                    <button onclick="toggleWriteReviewForm('${movie._id}')">Write Review</button>
                </div>
                <div class="reviews" id="reviews-${movie._id}" style="display: none;">
                    <h3>Reviews</h3>
                </div>
                <div class="write-review" id="write-review-${movie._id}" style="display: none;">
                    <form class="review-form" id="review-form-${movie._id}" onsubmit="handleAddReview(event, '${movie._id}')">
                        <input type="text" id="author-${movie._id}" placeholder="Author" required />
                        <input type="number" id="rating-${movie._id}" placeholder="Rating" required min="1" max="5" />
                        <textarea id="comment-${movie._id}" placeholder="Comment" required></textarea>
                        <button type="submit">Add Review</button>
                    </form>
                </div>
            `;
            movieList.appendChild(movieCard);
            loadReviews(movie._id); // Load reviews for the movie
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

async function fetchMoviesForDropdown(elementId) {
    try {
        const response = await fetch('http://localhost:4000/movies');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const movies = await response.json();
        console.log('Fetched movies:', movies); // Log fetched data
        const movieDropdown = document.getElementById(elementId);
        if (!movieDropdown) {
            console.error('Element with id ' + elementId + ' not found.');
            return;
        }
        movieDropdown.innerHTML = ''; // Clear the dropdown before adding new options
        movies.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie._id; // Use movie ID as value
            option.text = movie.title;
            movieDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

async function fetchReviews(elementId) {
    try {
        const response = await fetch('http://localhost:4000/reviews');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const reviews = await response.json();
        const reviewList = document.getElementById(elementId);
        if (!reviewList) {
            console.error('Element with id ' + elementId + ' not found.');
            return;
        }
        reviewList.innerHTML = ''; // Clear the list before adding new elements
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <h3><strong>Author:</strong> ${review.author}</h3>
                <p><strong>Rating:</strong> ${review.rating}</p>
                <p>${review.comment}</p>
                <p><strong>Movie:</strong> ${review.movieId.title || 'Title not available'}</p>
            `;
            reviewList.appendChild(reviewCard);
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

async function loadReviews(movieId) {
    try {
        console.log('Fetching reviews for movieId:', movieId); // Log movieId
        const response = await fetch(`http://localhost:4000/reviews/movie/${movieId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const reviews = await response.json();
        console.log('Fetched reviews for movie:', movieId, reviews); // Log the fetched reviews

        const reviewsElement = document.getElementById(`reviews-${movieId}`);
        if (!reviewsElement) {
            console.error('Element with id reviews-' + movieId + ' not found.');
            return;
        }
        reviewsElement.innerHTML = ''; // Clear previous reviews
        if (reviews.length === 0) {
            reviewsElement.innerHTML += '<p>No reviews available</p>';
        } else {
            reviews.forEach((review, index) => {
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('review');
                reviewElement.innerHTML = `
                    <p><strong>Author:</strong> ${review.author}</p>
                    <p><strong>Rating:</strong> ${review.rating}</p>
                    <p>${review.comment}</p>
                `;
                reviewsElement.appendChild(reviewElement);

                // Add a styled divider between reviews
                if (index < reviews.length - 1) {
                    const divider = document.createElement('hr');
                    divider.classList.add('custom-divider');
                    reviewsElement.appendChild(divider);
                }
            });
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}



function toggleReviews(movieId) {
    const reviewsElement = document.getElementById(`reviews-${movieId}`);
    if (reviewsElement) {
        if (reviewsElement.style.display === 'none') {
            reviewsElement.style.display = 'block';
        } else {
            reviewsElement.style.display = 'none';
        }
    } else {
        console.error('Element with id reviews-' + movieId + ' not found.');
    }
}

function toggleWriteReviewForm(movieId) {
    const writeReviewElement = document.getElementById(`write-review-${movieId}`);
    if (writeReviewElement) {
        if (writeReviewElement.style.display === 'none') {
            writeReviewElement.style.display = 'block';
        } else {
            writeReviewElement.style.display = 'none';
        }
    } else {
        console.error('Element with id write-review-' + movieId + ' not found.');
    }
}

async function handleAddReview(event, movieId) {
    event.preventDefault();

    const review = {
        movieId: movieId,
        author: document.getElementById(`author-${movieId}`).value,
        rating: parseInt(document.getElementById(`rating-${movieId}`).value, 10),
        comment: document.getElementById(`comment-${movieId}`).value
    };

    try {
        const response = await fetch('http://localhost:4000/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Review added:', data);
        toggleWriteReviewForm(movieId); // Hide the form after adding the review
        loadReviews(movieId); // Refresh the reviews for the movie
    } catch (error) {
        console.error('Error adding review:', error);
    }
}

async function handleAddMovie(event) {
    event.preventDefault();

    const movie = {
        title: document.getElementById('title').value,
        director: document.getElementById('director').value,
        writers: document.getElementById('writers').value.split(',').map(writer => writer.trim()),
        stars: document.getElementById('stars').value.split(',').map(star => star.trim()),
        releaseYear: parseInt(document.getElementById('releaseYear').value, 10),
        genre: document.getElementById('genre').value,
        description: document.getElementById('description').value,
        imageUrl: document.getElementById('imageUrl').value // Ensure imageUrl field is included
    };

    try {
        const response = await fetch('http://localhost:4000/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Movie added:', data);
        fetchMovies('movie-list'); // Refresh the movie list
    } catch (error) {
        console.error('Error adding movie:', error);
    }
}

async function fetchUsers(elementId) {
    try {
        const response = await fetch('http://localhost:4000/users');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const users = await response.json();
        const userList = document.getElementById(elementId);
        if (!userList) {
            console.error('Element with id ' + elementId + ' not found.');
            return;
        }
        userList.innerHTML = ''; // Clear the list before adding new elements
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <h3>${user.username}</h3>
                <p>Email: ${user.email}</p>
            `;
            userList.appendChild(userCard);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function handleSignUp(event) {
    event.preventDefault();

    const user = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('http://localhost:4000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('User added:', data);
        fetchUsers('user-list'); // Refresh the user list
        document.getElementById('signup-form').reset(); // Clear the form
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

async function handleAddReviewModal(event) {
    event.preventDefault();

    const review = {
        movieId: document.getElementById('movie-id').value,
        author: document.getElementById('author-modal').value,
        rating: parseInt(document.getElementById('rating-modal').value, 10),
        comment: document.getElementById('comment-modal').value
    };

    try {
        const response = await fetch('http://localhost:4000/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Review added:', data);
        hideWriteReviewModal(); // Hide the modal after adding the review
        loadReviews(review.movieId); // Refresh the reviews for the movie
    } catch (error) {
        console.error('Error adding review:', error);
    }
}

function hideWriteReviewModal() {
    const modal = document.getElementById('write-review-modal');
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('review-modal');
    const writeReviewModal = document.getElementById('write-review-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    } else if (event.target === writeReviewModal) {
        writeReviewModal.style.display = 'none';
    }
}
