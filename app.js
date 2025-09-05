// Disease data from the provided JSON
const diseaseData = {
  fungal: [
    {
      name: "Early Blight",
      pathogen: "Alternaria solani",
      symptoms: "Small brown spots with concentric rings on lower leaves, yellowing and death of leaves",
      texture: "Target-like lesions with dry, papery texture",
      color: "Brown spots with yellow halos, progressing to dark brown",
      causes: "High humidity, warm temperatures (24-29°C), leaf wetness",
      crops: ["Tomato", "Potato", "Eggplant"]
    },
    {
      name: "Late Blight",
      pathogen: "Phytophthora infestans",
      symptoms: "Water-soaked lesions, white fuzzy growth on leaf undersides",
      texture: "Soft, water-soaked areas with fuzzy white growth",
      color: "Dark green to brown lesions with white sporulation",
      causes: "Cool, wet conditions, high humidity, poor air circulation",
      crops: ["Potato", "Tomato"]
    },
    {
      name: "Powdery Mildew",
      pathogen: "Various fungi",
      symptoms: "White powdery coating on leaves, stunted growth",
      texture: "Fine white powdery surface coating",
      color: "White to grayish powdery patches",
      causes: "High humidity, moderate temperatures, poor air circulation",
      crops: ["Cucumber", "Squash", "Grapes", "Roses"]
    },
    {
      name: "Leaf Rust",
      pathogen: "Puccinia species",
      symptoms: "Red-orange pustules on leaves, yellowing",
      texture: "Raised, rusty pustules that rupture",
      color: "Red-orange to brown pustules",
      causes: "Moderate temperatures, high humidity, wind dispersal",
      crops: ["Wheat", "Corn", "Beans"]
    },
    {
      name: "Anthracnose",
      pathogen: "Colletotrichum species",
      symptoms: "Dark sunken lesions on leaves, stems, and fruits",
      texture: "Sunken, circular lesions with raised borders",
      color: "Dark brown to black lesions",
      causes: "Warm, humid conditions, overhead watering",
      crops: ["Tomato", "Pepper", "Cucumber"]
    }
  ],
  bacterial: [
    {
      name: "Bacterial Blight",
      pathogen: "Xanthomonas campestris",
      symptoms: "Water-soaked lesions with yellow halos, wilting",
      texture: "Water-soaked, greasy appearance",
      color: "Brown lesions with bright yellow halos",
      causes: "Warm, humid conditions, wounds, splashing water",
      crops: ["Bean", "Cotton", "Rice"]
    },
    {
      name: "Fire Blight",
      pathogen: "Erwinia amylovora",
      symptoms: "Rapid wilting and blackening of shoots",
      texture: "Blackened, scorched appearance",
      color: "Black to dark brown discoloration",
      causes: "Warm, humid spring weather, insect vectors",
      crops: ["Apple", "Pear", "Rose family"]
    },
    {
      name: "Bacterial Wilt",
      pathogen: "Ralstonia solanacearum",
      symptoms: "Sudden wilting despite adequate moisture",
      texture: "Wilted, collapsed leaves",
      color: "Yellowing followed by browning",
      causes: "High soil temperature, high moisture, wounds",
      crops: ["Tomato", "Potato", "Tobacco"]
    }
  ],
  viral: [
    {
      name: "Mosaic Virus",
      pathogen: "Various viruses",
      symptoms: "Mottled light and dark green patterns, stunted growth",
      texture: "Irregular leaf surface, puckering",
      color: "Light and dark green mosaic patterns",
      causes: "Insect vectors (aphids, thrips), contaminated tools",
      crops: ["Tobacco", "Cucumber", "Tomato"]
    },
    {
      name: "Leaf Curl Virus",
      pathogen: "Begomovirus",
      symptoms: "Upward curling of leaves, stunted growth",
      texture: "Thickened, leathery leaves",
      color: "Yellowing between veins",
      causes: "Whitefly vectors, warm temperatures",
      crops: ["Tomato", "Cotton", "Okra"]
    }
  ]
};

// Sample predictions for instant results
const samplePredictions = [
  {
    disease: "Early Blight",
    confidence: 94,
    type: "Fungal",
    recommendations: ["Apply fungicide spray", "Improve air circulation", "Remove infected leaves"]
  },
  {
    disease: "Late Blight", 
    confidence: 89,
    type: "Fungal",
    recommendations: ["Use copper-based fungicide", "Reduce humidity", "Avoid overhead watering"]
  },
  {
    disease: "Bacterial Blight",
    confidence: 87,
    type: "Bacterial", 
    recommendations: ["Apply bactericide", "Improve drainage", "Remove infected plants"]
  },
  {
    disease: "Powdery Mildew",
    confidence: 92,
    type: "Fungal",
    recommendations: ["Apply sulfur spray", "Increase air circulation", "Reduce humidity"]
  },
  {
    disease: "Healthy Leaf",
    confidence: 96,
    type: "Healthy",
    recommendations: ["Continue current care routine", "Monitor for early signs", "Maintain good practices"]
  }
];

// Global variables
let currentCategory = 'all';
let uploadedFile = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  renderDiseases('all');
  initializeImageUpload();
  initializeCategoryFilters();
  initializeMobileMenu();
  animateOnScroll();
});

// Navigation functionality
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav__link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
      updateActiveNavigation(this);
    });
  });
  
  // Handle Start Analysis button
  const startAnalysisBtn = document.querySelector('.hero .btn--primary');
  if (startAnalysisBtn) {
    startAnalysisBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToSection('upload');
    });
  }
  
  // Update navigation on scroll
  window.addEventListener('scroll', throttle(updateNavigationOnScroll, 100));
}

function scrollToSection(targetId) {
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = targetSection.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

function updateActiveNavigation(activeLink) {
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}

function updateNavigationOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 120;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      const correspondingNavLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
      if (correspondingNavLink) {
        updateActiveNavigation(correspondingNavLink);
      }
    }
  });
}

// Category filtering functionality
function initializeCategoryFilters() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active category button
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Get selected category and render diseases
      const category = this.getAttribute('data-category');
      currentCategory = category;
      renderDiseases(category);
    });
  });
}

// Disease rendering and filtering
function renderDiseases(category) {
  const diseasesGrid = document.getElementById('diseases-grid');
  if (!diseasesGrid) return;
  
  diseasesGrid.innerHTML = '';
  
  let diseasesToShow = [];
  
  if (category === 'all') {
    diseasesToShow = [
      ...diseaseData.fungal.map(d => ({...d, category: 'fungal'})),
      ...diseaseData.bacterial.map(d => ({...d, category: 'bacterial'})),
      ...diseaseData.viral.map(d => ({...d, category: 'viral'}))
    ];
  } else {
    diseasesToShow = diseaseData[category] ? diseaseData[category].map(d => ({...d, category})) : [];
  }
  
  diseasesToShow.forEach((disease, index) => {
    const diseaseCard = createDiseaseCard(disease);
    diseasesGrid.appendChild(diseaseCard);
    
    // Add staggered animation
    setTimeout(() => {
      diseaseCard.style.opacity = '1';
      diseaseCard.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

function createDiseaseCard(disease) {
  const card = document.createElement('div');
  card.className = 'disease-card';
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.3s ease';
  
  const categoryLabel = disease.category.charAt(0).toUpperCase() + disease.category.slice(1);
  
  card.innerHTML = `
    <div class="disease-card__header">
      <h3 class="disease-card__title">${disease.name}</h3>
      <p class="disease-card__pathogen">${disease.pathogen} (${categoryLabel})</p>
    </div>
    <div class="disease-card__body">
      <div class="disease-card__section">
        <h4 class="disease-card__section-title">Symptoms</h4>
        <p class="disease-card__content">${disease.symptoms}</p>
      </div>
      <div class="disease-card__section">
        <h4 class="disease-card__section-title">Leaf Texture</h4>
        <p class="disease-card__content">${disease.texture}</p>
      </div>
      <div class="disease-card__section">
        <h4 class="disease-card__section-title">Color Changes</h4>
        <p class="disease-card__content">${disease.color}</p>
      </div>
      <div class="disease-card__section">
        <h4 class="disease-card__section-title">Causes</h4>
        <p class="disease-card__content">${disease.causes}</p>
      </div>
      <div class="disease-card__section">
        <h4 class="disease-card__section-title">Affected Crops</h4>
        <div class="crops-list">
          ${disease.crops.map(crop => `<span class="crop-tag">${crop}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
  
  return card;
}

// Image upload functionality with instant analysis
function initializeImageUpload() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const uploadPreview = document.getElementById('upload-preview');
  const previewImage = document.getElementById('preview-image');
  const analyzeBtn = document.getElementById('analyze-btn');
  const removeBtn = document.getElementById('remove-btn');
  const analysisResults = document.getElementById('analysis-results');
  
  if (!uploadArea || !fileInput) return;
  
  // File input change event
  fileInput.addEventListener('change', handleFileSelect);
  
  // Drag and drop events
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('dragleave', handleDragLeave);
  uploadArea.addEventListener('drop', handleFileDrop);
  
  // Click to upload
  uploadArea.addEventListener('click', function(e) {
    if (e.target === uploadArea || e.target.closest('.upload-content')) {
      fileInput.click();
    }
  });
  
  // Analyze button - INSTANT ANALYSIS (no delays)
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', performInstantAnalysis);
  }
  
  // Remove button
  if (removeBtn) {
    removeBtn.addEventListener('click', removeImage);
  }
}

function handleDragOver(e) {
  e.preventDefault();
  const uploadArea = document.getElementById('upload-area');
  uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  const uploadArea = document.getElementById('upload-area');
  uploadArea.classList.remove('drag-over');
}

function handleFileDrop(e) {
  e.preventDefault();
  const uploadArea = document.getElementById('upload-area');
  uploadArea.classList.remove('drag-over');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileSelect({ target: { files } });
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    uploadedFile = file;
    displayImagePreview(file);
  }
}

function displayImagePreview(file) {
  const reader = new FileReader();
  const uploadContent = document.querySelector('.upload-content');
  const uploadPreview = document.getElementById('upload-preview');
  const previewImage = document.getElementById('preview-image');
  const analysisResults = document.getElementById('analysis-results');
  
  reader.onload = function(e) {
    previewImage.src = e.target.result;
    uploadContent.classList.add('hidden');
    uploadPreview.classList.remove('hidden');
    analysisResults.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  const fileInput = document.getElementById('file-input');
  const previewImage = document.getElementById('preview-image');
  const uploadContent = document.querySelector('.upload-content');
  const uploadPreview = document.getElementById('upload-preview');
  const analysisResults = document.getElementById('analysis-results');
  
  previewImage.src = '';
  fileInput.value = '';
  uploadedFile = null;
  uploadPreview.classList.add('hidden');
  uploadContent.classList.remove('hidden');
  analysisResults.classList.add('hidden');
}

// INSTANT ANALYSIS - No loading delays or buffers
function performInstantAnalysis() {
  if (!uploadedFile) return;
  
  // Get random prediction from sample data for instant results
  const randomPrediction = samplePredictions[Math.floor(Math.random() * samplePredictions.length)];
  
  // Find disease details from our database
  let diseaseDetails = null;
  const allDiseases = [
    ...diseaseData.fungal.map(d => ({...d, category: 'fungal'})),
    ...diseaseData.bacterial.map(d => ({...d, category: 'bacterial'})),
    ...diseaseData.viral.map(d => ({...d, category: 'viral'}))
  ];
  
  diseaseDetails = allDiseases.find(d => d.name === randomPrediction.disease);
  
  // If no exact match found, use a random disease from database
  if (!diseaseDetails) {
    diseaseDetails = allDiseases[Math.floor(Math.random() * allDiseases.length)];
  }
  
  // Display results immediately
  displayAnalysisResults(diseaseDetails, randomPrediction);
}

function displayAnalysisResults(disease, prediction) {
  const analysisResults = document.getElementById('analysis-results');
  const diseaseNameEl = document.getElementById('disease-name');
  const confidenceEl = document.getElementById('confidence');
  const pathogenEl = document.getElementById('pathogen');
  const symptomsEl = document.getElementById('symptoms');
  const actionEl = document.getElementById('action');
  
  if (diseaseNameEl) diseaseNameEl.textContent = disease.name;
  if (confidenceEl) confidenceEl.textContent = `Confidence: ${prediction.confidence}%`;
  if (pathogenEl) pathogenEl.textContent = disease.pathogen;
  if (symptomsEl) symptomsEl.textContent = disease.symptoms;
  if (actionEl) actionEl.textContent = getRecommendedAction(disease.name, prediction.recommendations);
  
  analysisResults.classList.remove('hidden');
  
  // Smooth scroll to results
  setTimeout(() => {
    analysisResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function getRecommendedAction(diseaseName, recommendations) {
  // Use recommendations from prediction if available
  if (recommendations && recommendations.length > 0) {
    return recommendations.join(', ');
  }
  
  // Fallback to predefined actions
  const actions = {
    'Early Blight': 'Apply copper-based fungicide and improve air circulation. Remove affected leaves immediately.',
    'Late Blight': 'Remove affected plants immediately and apply systemic fungicide. Ensure good drainage.',
    'Powdery Mildew': 'Increase air circulation and apply sulfur-based fungicide. Avoid overhead watering.',
    'Leaf Rust': 'Apply rust-specific fungicide and practice crop rotation. Remove infected debris.',
    'Anthracnose': 'Remove infected debris and apply preventive fungicide. Improve plant spacing.',
    'Bacterial Blight': 'Remove infected plants and apply copper bactericide. Disinfect tools between plants.',
    'Fire Blight': 'Prune infected branches 12 inches below symptoms and apply streptomycin during bloom.',
    'Bacterial Wilt': 'Remove affected plants and improve soil drainage. Practice crop rotation.',
    'Mosaic Virus': 'Remove infected plants immediately and control insect vectors. Disinfect tools.',
    'Leaf Curl Virus': 'Control whitefly vectors using yellow sticky traps and remove infected plants.',
    'Healthy Leaf': 'Continue current care routine and monitor for early signs of disease.'
  };
  
  return actions[diseaseName] || 'Consult with agricultural extension services for specific treatment recommendations.';
}

// Mobile menu functionality
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');
  
  if (!mobileMenuBtn || !navMenu) return;
  
  mobileMenuBtn.addEventListener('click', function() {
    navMenu.classList.toggle('mobile-active');
    this.textContent = navMenu.classList.contains('mobile-active') ? '✕' : '☰';
  });
  
  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('mobile-active');
      mobileMenuBtn.textContent = '☰';
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navMenu.classList.remove('mobile-active');
      mobileMenuBtn.textContent = '☰';
    }
  });
}

// Animation on scroll
function animateOnScroll() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animateElements = document.querySelectorAll('.feature-card, .analysis-card, .management-card');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
}

// Counter animation for statistics
function animateCounters() {
  const counters = document.querySelectorAll('.stat-item__number');
  
  counters.forEach(counter => {
    const target = counter.textContent;
    
    if (target.includes('95-99%')) {
      animatePercentageCounter(counter, 95, 99);
    } else if (target.includes('50+')) {
      animateNumberCounter(counter, 50, '+');
    } else if (target.includes('20+')) {
      animateNumberCounter(counter, 20, '+');
    } else if (target.includes('24/7')) {
      counter.textContent = '24/7';
    }
  });
}

function animatePercentageCounter(element, start, end) {
  let current = start;
  const timer = setInterval(() => {
    if (current >= end) {
      element.textContent = `${start}-${end}%`;
      clearInterval(timer);
    } else {
      element.textContent = `${current}-${current + 4}%`;
      current++;
    }
  }, 50);
}

function animateNumberCounter(element, target, suffix) {
  let current = 0;
  const increment = target / 30;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 50);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Utility function for throttling
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Smooth reveal animation for page load
window.addEventListener('load', function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Additional utility functions for enhanced user experience
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: var(--color-${type === 'success' ? 'success' : 'error'});
    color: var(--color-btn-primary-text);
    border-radius: var(--radius-base);
    z-index: 2000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Enhanced file validation
function validateImageFile(file) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    showNotification('Please upload a valid image file (JPEG, PNG, WebP)', 'error');
    return false;
  }
  
  if (file.size > maxSize) {
    showNotification('Image size should be less than 10MB', 'error');
    return false;
  }
  
  return true;
}

// Update file selection to include validation
const originalHandleFileSelect = handleFileSelect;
handleFileSelect = function(e) {
  const file = e.target.files[0];
  if (file && validateImageFile(file)) {
    uploadedFile = file;
    displayImagePreview(file);
    showNotification('Image uploaded successfully!', 'success');
  }
};