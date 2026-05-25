// Initialize Mermaid
mermaid.initialize({ 
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
        primaryColor: '#2563eb',
        primaryTextColor: '#1e293b',
        primaryBorderColor: '#3b82f6',
        lineColor: '#64748b',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#f8fafc'
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Job Criteria Chart
const criteriaCtx = document.getElementById('criteriaChart');
if (criteriaCtx) {
    new Chart(criteriaCtx, {
        type: 'doughnut',
        data: {
            labels: [
                'Target Role & Level',
                'Compensation',
                'Industry & Sector',
                'Company Stage',
                'Work Style',
                'Culture Fit',
                'Growth Goals',
                'Technical Interests'
            ],
            datasets: [{
                data: [15, 20, 12, 10, 15, 12, 8, 8],
                backgroundColor: [
                    '#2563eb',
                    '#3b82f6',
                    '#60a5fa',
                    '#93c5fd',
                    '#7c3aed',
                    '#a855f7',
                    '#c084fc',
                    '#d8b4fe'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Job Criteria Components',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                }
            }
        }
    });
}

// Time Savings Chart
const timeSavingsCtx = document.getElementById('timeSavingsChart');
if (timeSavingsCtx) {
    new Chart(timeSavingsCtx, {
        type: 'bar',
        data: {
            labels: ['Job Board Browsing', 'Filtering & Research', 'Application Prep', 'Follow-up Tracking'],
            datasets: [
                {
                    label: 'Before (hours/week)',
                    data: [8, 6, 4, 2],
                    backgroundColor: '#ef4444',
                    borderRadius: 8
                },
                {
                    label: 'With Claude (hours/week)',
                    data: [0.5, 0.5, 2, 1],
                    backgroundColor: '#10b981',
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Weekly Time Investment Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours per Week'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Activity'
                    }
                }
            }
        }
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe timeline steps and cards
document.querySelectorAll('.timeline-step, .benefit, .requirement, .limitation').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Add CSS for active nav links
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: #2563eb !important;
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Interactive step progress
let currentStep = 0;
const totalSteps = document.querySelectorAll('.timeline-step').length;

function updateStepProgress() {
    document.querySelectorAll('.step-number').forEach((step, index) => {
        if (index <= currentStep) {
            step.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else {
            step.style.background = 'linear-gradient(135deg, #94a3b8, #64748b)';
        }
    });
}

// Initialize step progress on scroll
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stepIndex = Array.from(document.querySelectorAll('.timeline-step')).indexOf(entry.target);
            if (stepIndex >= 0) {
                currentStep = stepIndex;
                updateStepProgress();
            }
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.timeline-step').forEach(step => {
    stepObserver.observe(step);
});

// Copy code functionality for prompts (if added later)
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('code, .prompt-text');
    codeBlocks.forEach(block => {
        if (block.textContent.length > 50) { // Only add copy button for longer text
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(block.textContent);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy', 2000);
            };
            
            const container = document.createElement('div');
            container.className = 'code-container';
            block.parentNode.insertBefore(container, block);
            container.appendChild(block);
            container.appendChild(copyBtn);
        }
    });
}

// Add copy button styles
const copyStyles = document.createElement('style');
copyStyles.textContent = `
    .code-container {
        position: relative;
        display: inline-block;
        width: 100%;
    }
    
    .copy-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #64748b;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .copy-btn:hover {
        opacity: 1;
        background: #475569;
    }
`;
document.head.appendChild(copyStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addCopyButtons();
    updateStepProgress();
});

// Add floating progress indicator
function createProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <div class="progress-steps">
            ${Array.from({length: totalSteps}, (_, i) => 
                `<div class="progress-dot" data-step="${i}"></div>`
            ).join('')}
        </div>
    `;
    
    document.body.appendChild(progressContainer);
}

// Progress indicator styles
const progressStyles = document.createElement('style');
progressStyles.textContent = `
    .progress-container {
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        padding: 15px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 50;
        opacity: 0.9;
    }
    
    .progress-bar {
        width: 4px;
        height: 200px;
        background: #e2e8f0;
        border-radius: 2px;
        margin: 0 auto 10px;
        overflow: hidden;
    }
    
    .progress-fill {
        width: 100%;
        height: 0%;
        background: linear-gradient(to bottom, #2563eb, #7c3aed);
        transition: height 0.3s ease;
    }
    
    .progress-steps {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: center;
    }
    
    .progress-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #cbd5e1;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .progress-dot.active {
        background: #2563eb;
        transform: scale(1.2);
    }
    
    @media (max-width: 768px) {
        .progress-container {
            display: none;
        }
    }
`;
document.head.appendChild(progressStyles);

// Initialize progress indicator
document.addEventListener('DOMContentLoaded', () => {
    createProgressIndicator();
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.height = `${Math.min(scrollPercent, 100)}%`;
        }
        
        // Update step dots
        document.querySelectorAll('.progress-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index <= currentStep);
        });
    });
});