// Sample job data (in a real application, this would come from a backend API)
const jobs = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'Remote',
        category: 'technology',
        salary: '$120k - $150k',
        description: 'We are looking for an experienced Frontend Developer to join our team...',
        posted: '2024-03-15'
    },
    {
        id: 2,
        title: 'Marketing Manager',
        company: 'GrowthLabs',
        location: 'New York',
        category: 'marketing',
        salary: '$90k - $110k',
        description: 'Join our marketing team to drive growth and brand awareness...',
        posted: '2024-03-14'
    },
    {
        id: 3,
        title: 'UI/UX Designer',
        company: 'DesignHub',
        location: 'London',
        category: 'design',
        salary: '$80k - $100k',
        description: 'Create beautiful and intuitive user interfaces...',
        posted: '2024-03-13'
    },
    {
        id: 4,
        title: 'Sales Representative',
        company: 'SalesForce',
        location: 'Tokyo',
        category: 'sales',
        salary: '$70k - $90k',
        description: 'Drive sales and build relationships with clients...',
        posted: '2024-03-12'
    }
];

// DOM Elements
const jobsContainer = document.getElementById('jobs-container');
const bookmarksContainer = document.getElementById('bookmarks-container');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const locationFilter = document.getElementById('location-filter');
const applicationModal = document.getElementById('application-modal');
const applicationForm = document.getElementById('application-form');
const closeModal = document.querySelector('.close-modal');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

// Initialize bookmarks from localStorage
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Create Job Card
function createJobCard(job) {
    const isBookmarked = bookmarks.includes(job.id);
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <h3>${job.title}</h3>
        <p class="company">${job.company}</p>
        <div class="details">
            <span>${job.location}</span>
            <span>${job.salary}</span>
        </div>
        <p>${job.description}</p>
        <div class="actions">
            <button class="apply-btn" data-job-id="${job.id}">Apply Now</button>
            <button class="bookmark-btn" data-job-id="${job.id}">
                <i class="fas fa-bookmark ${isBookmarked ? 'active' : ''}"></i>
            </button>
        </div>
    `;
    return card;
}

// Render Jobs
function renderJobs(jobsToRender) {
    jobsContainer.innerHTML = '';
    jobsToRender.forEach(job => {
        jobsContainer.appendChild(createJobCard(job));
    });
}

// Render Bookmarks
function renderBookmarks() {
    bookmarksContainer.innerHTML = '';
    const bookmarkedJobs = jobs.filter(job => bookmarks.includes(job.id));
    bookmarkedJobs.forEach(job => {
        bookmarksContainer.appendChild(createJobCard(job));
    });
}

// Filter Jobs
function filterJobs() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const location = locationFilter.value;

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
                            job.company.toLowerCase().includes(searchTerm) ||
                            job.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || job.category === category;
        const matchesLocation = !location || job.location.toLowerCase() === location.toLowerCase();

        return matchesSearch && matchesCategory && matchesLocation;
    });

    renderJobs(filteredJobs);
}

// Toggle Bookmark
function toggleBookmark(jobId) {
    const index = bookmarks.indexOf(jobId);
    if (index === -1) {
        bookmarks.push(jobId);
    } else {
        bookmarks.splice(index, 1);
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    renderJobs(jobs);
    renderBookmarks();
}

// Show Application Modal
function showApplicationModal(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        document.getElementById('job-title').textContent = job.title;
        applicationModal.style.display = 'block';
    }
}

// Close Application Modal
function closeApplicationModal() {
    applicationModal.style.display = 'none';
    applicationForm.reset();
}

// Event Listeners
searchInput.addEventListener('input', filterJobs);
categoryFilter.addEventListener('change', filterJobs);
locationFilter.addEventListener('change', filterJobs);
closeModal.addEventListener('click', closeApplicationModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === applicationModal) {
        closeApplicationModal();
    }
});

// Handle job card actions
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('apply-btn')) {
        const jobId = parseInt(e.target.dataset.jobId);
        showApplicationModal(jobId);
    } else if (e.target.classList.contains('bookmark-btn') || e.target.closest('.bookmark-btn')) {
        const jobId = parseInt(e.target.dataset.jobId || e.target.closest('.bookmark-btn').dataset.jobId);
        toggleBookmark(jobId);
    }
});

// Handle form submission
applicationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(applicationForm);
    const application = {
        name: formData.get('name'),
        email: formData.get('email'),
        resume: formData.get('resume'),
        message: formData.get('message'),
        jobTitle: document.getElementById('job-title').textContent,
        timestamp: new Date().toISOString()
    };
    
    // In a real application, you would send this data to a server
    console.log('Application submitted:', application);
    alert('Application submitted successfully!');
    closeApplicationModal();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Initial render
renderJobs(jobs);
renderBookmarks(); 