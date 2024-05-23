document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;

    if (pathname.includes('movies.html')) {
        fetchMovies('movie-list');
        document.getElementById('add-movie-form').addEventListener('submit', handleAddMovie);
    } else if (pathname.includes('reviews.html')) {
        fetchReviews('review-list');
        document.getElementById('add-review-form').addEventListener('submit', handleAddReview);
    } else if (pathname.includes('users.html')) {
        fetchUsers('user-list');
    } else if (pathname.includes('index.html') || pathname === '/') {
        fetchMovies('home-movie-list');
        fetchReviews('home-review-list');
    }
});

function fetchMovies(elementId) {
    fetch('http://localhost:4000/movies')
        .then(response => response.json())
        .then(data => {
            const movieList = document.getElementById(elementId);
            movieList.innerHTML = ''; // Clear the list before adding new elements
            data.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';
                movieCard.innerHTML = `
                    <img src="${movie.imageUrl}" alt="${movie.title}" class="movie-cover">
                    <h3>${movie.title}</h3>
                    <p><strong>Director:</strong> ${movie.director}</p>
                    <p><strong>Release Year:</strong> ${movie.releaseYear}</p>
                    <p><strong>Genre:</strong> ${movie.genre}</p>
                `;
                movieList.appendChild(movieCard);
            });
        })
        .catch(error => console.error('Error fetching movies:', error));
}

function fetchReviews(elementId) {
    fetch('http://localhost:4000/reviews')
        .then(response => response.json())
        .then(data => {
            const reviewList = document.getElementById(elementId);
            reviewList.innerHTML = ''; // Clear the list before adding new elements
            data.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                reviewCard.innerHTML = `
                    <h3>Author: ${review.author}</h3>
                    <p><strong>Rating:</strong> ${review.rating}</p>
                    <p>${review.comment}</p>
                `;
                reviewList.appendChild(reviewCard);
            });
        })
        .catch(error => console.error('Error fetching reviews:', error));
}

function fetchUsers(elementId) {
    fetch('http://localhost:4000/users')
        .then(response => response.json())
        .then(data => {
            const userList = document.getElementById(elementId);
            userList.innerHTML = ''; // Clear the list before adding new elements
            data.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'user-card';
                userCard.innerHTML = `
                    <h3>${user.username}</h3>
                    <p>Email: ${user.email}</p>
                `;
                userList.appendChild(userCard);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

function handleAddMovie(event) {
    event.preventDefault();
    
    const movie = {
        title: document.getElementById('title').value,
        director: document.getElementById('director').value,
        releaseYear: parseInt(document.getElementById('releaseYear').value, 10),
        genre: document.getElementById('genre').value,
        imageUrl: document.getElementById('imageUrl').value // Ensure imageUrl field is included
    };

    fetch('http://localhost:4000/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Movie added:', data);
        fetchMovies('movie-list'); // Refresh the movie list
    })
    .catch(error => console.error('Error adding movie:', error));
}

function handleAddReview(event) {
    event.preventDefault();
    
    const review = {
        author: document.getElementById('author').value,
        rating: parseInt(document.getElementById('rating').value, 10),
        comment: document.getElementById('comment').value
    };

    fetch('http://localhost:4000/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Review added:', data);
        fetchReviews('review-list'); // Refresh the review list
    })
    .catch(error => console.error('Error adding review:', error));
}
