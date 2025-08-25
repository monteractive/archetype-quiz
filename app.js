// Global variables for questionnaire state
let currentStep = 0;
let userAnswers = {};
let archetypeRawScores = {};
let archetypePercentageScores = {};
let bestMatchedArchetype = null;
let radarChartInstance = null; // To store the Chart.js instance

// Archetype definitions with their descriptions, monikers, and links
const archetypes = {
    'Visual Specialist': {
        moniker: 'The Artisan',
        description: 'The Visual Specialist is detail-obsessed and focused on polished, pixel-perfect, and consistent designs. They are experts in visual design and elevate the quality of any product they touch.',
        keywords: ['Visual Preferences and Detail Orientation'],
        image: './images/visual%20specialist.png', // Updated image URL
        link: 'https://roblox.atlassian.net/wiki/x/9wPI2'
    },
    'Strategist': {
        moniker: 'The Pioneer',
        description: 'Fueled by imagination and creativity, the Strategist excels at long term thinking, concept design, strategy and innovation. They have a deep understanding of the industry and use effective techniques to sell ideas.',
        keywords: ['Innovation and Strategic Thinking'],
        image: './images/strategist.png', // Updated image URL
        link: 'https://roblox.atlassian.net/wiki/x/WgPG2'
    },
    'Interaction Expert': {
        moniker: 'The Conductor',
        description: 'An interaction expert creates intuitive user journeys with carefully designed happy paths, guiding users with thoughtful hierarchy, micro-interactions, transitions, and animations. They possess deep knowledge of platform-specific interaction patterns and accessibility guidelines.',
        keywords: ['User Journeys and Interaction Design'],
        image: './images/interaction%20expert.png', // Updated image URL
        link: 'https://roblox.atlassian.net/wiki/spaces/DESIGN/pages/3621159050/Design+Creative+Archetypes#Interaction-Expert.1'
    },
    'Prototyper': {
        moniker: 'The Gadgeteer',
        description: 'Prototyping experts excel at rapid iteration. Typically proficient with multiple prototyping tools and skillfully select the appropriate fidelity level for different stages of the design process. They use prototypes to communicate vision and collect early feedback that drives design decisions.',
        keywords: ['Technical Inclinations and Prototyping'],
        image: './images/prototyper.png', // Updated image URL
        link: 'https://roblox.atlassian.net/wiki/x/koPG2'
    },
    'Systems Expert': {
        moniker: 'The Architect',
        description: 'System experts simplify the most complex systems and connect the dots across teams. They are experts at zooming in and out, always considering the larger context.',
        keywords: ['Systems Thinking and Collaboration'],
        image: './images/systems%20expert.png', // Updated image URL
        link: 'https://roblox.atlassian.net/wiki/spaces/DESIGN/pages/3636986897'
    },
    'Communication Expert': {
        moniker: 'The Nexus',
        description: 'The Communication Expert is a master storyteller. They know how to frame even the toughest topics persuasively, presenting complex or challenging ideas in a compelling and accessible way that helps teams arrive at a unified solution.',
        keywords: ['Communication and Stakeholder Management'],
        image: './images/communication%20expert.png', // Placeholder image (no specific image provided for this one)
        link: 'https://roblox.atlassian.net/wiki/x/8ofI2'
    },
    'Insights Analyst': {
        moniker: 'The Scholar',
        description: 'The Insights Expert excels at interrogating data and revealing new insights that power innovation. They have a deep well of knowledge and are continuously sharing it to elevate work around them.',
        keywords: ['Research and Knowledge Building'],
        image: './images/insights%20analyst.png', // Placeholder image (no specific image provided for this one)
        link: 'https://roblox.atlassian.net/wiki/x/qAS-2'
    },
    'Voice Expert': {
        moniker: 'The Trendsetter',
        description: 'A Voice Expert is a master of identity and strategy. They ensure consistent and compelling communications across all channels. They understand market trends and customer needs, translating them into a unique and resonant voice.',
        keywords: ['Content and Brand Voice'],
        image: './images/voice%20expert.png', // Updated image URL
        link: 'https://roblox.atlassian.net/wiki/spaces/DESIGN/pages/3637085048'
    },
};

// Maximum possible scores for each archetype category based on the questionnaire structure
// This is calculated by summing the max points each category can get from all questions.
// Checkbox options contribute +1, Radio options contribute +2.
const maxPossibleScores = {
    'Visual Specialist': 17,
    'Strategist': 17,
    'Interaction Expert': 17,
    'Prototyper': 17,
    'Systems Expert': 17,
    'Communication Expert': 17,
    'Insights Analyst': 17,
    'Voice Expert': 17,
};

// Define the questionnaire structure
const questionnaire = [
    {
        id: 'q1',
        question: 'Of the following options, what do you consider MOST important when it comes to Design? (Please choose all that apply.)',
        type: 'checkbox',
        options: [
            { text: 'Analyzing complex systems and identifying connections between different systems, projects, or products.', category: 'Systems Thinking and Collaboration' },
            { text: 'Thinking about the long-term implications of design decisions and navigating ambiguity.', category: 'Innovation and Strategic Thinking' },
            { text: 'Creating intuitive user journeys with thoughtful hierarchy, micro-interactions, and animations.', category: 'User Journeys and Interaction Design' },
            { text: 'The technical aspects of design implementation and creating interactive prototypes to test and refine designs.', category: 'Technical Inclinations and Prototyping' },
            { text: 'The visual details of a design, ensuring consistency in design elements, and creating beautiful, polished interfaces.', category: 'Visual Preferences and Detail Orientation' },
            { text: 'Facilitating discussions, resolving conflicting viewpoints, and creating a collaborative environment.', category: 'Communication and Stakeholder Management' },
            { text: 'Engaging with research and gathering information to inform designs, and interrogating data to reveal insights.', category: 'Research and Knowledge Building' },
            { text: 'Crafting compelling and consistent communication across different channels and translating market trends into a unified voice.', category: 'Content and Brand Voice' },
        ],
    },
    {
        id: 'q2',
        question: 'Of the following options, what do you consider the MOST important when it comes to Design? (Please choose only one.)',
        type: 'radio',
        options: [], // Piped in from Q1
    },
    {
        id: 'q3',
        question: 'Of the following options, what do you MOST ENJOY doing? (Please choose all that apply.)',
        type: 'checkbox',
        options: [
            { text: 'Analyzing complex systems and identifying connections between different systems, projects, or products.', category: 'Systems Thinking and Collaboration' },
            { text: 'Thinking about the long-term implications of design decisions and exploring new ideas.', category: 'Innovation and Strategic Thinking' },
            { text: 'Creating intuitive user journeys and improving user flows and information architecture.', category: 'User Journeys and Interaction Design' },
            { text: 'The technical aspects of design implementation and creating interactive prototypes to test and refine designs.', category: 'Technical Inclinations and Prototyping' },
            { text: 'Paying close attention to typography, color, and layout, and creating beautiful and polished interfaces.', category: 'Visual Preferences and Detail Orientation' },
            { text: 'Facilitating discussions, resolving conflicting viewpoints, and creating a collaborative environment.', category: 'Communication and Stakeholder Management' },
            { text: 'Engaging with research and gathering information to inform designs, and learning new things and expanding knowledge.', category: 'Research and Knowledge Building' },
            { text: 'Developing brand identity and ensuring consistent and compelling communications across channels.', category: 'Content and Brand Voice' },
        ],
    },
    {
        id: 'q4',
        question: 'Of the following options, what do you ENJOY doing the MOST? (Please choose only one.)',
        type: 'radio',
        options: [], // Piped in from Q3
    },
    {
        id: 'q5',
        question: 'When reviewing a design, what is MOST important to you? (Please choose all that apply.)',
        type: 'checkbox', // Changed to checkbox
        hasOtherInput: true, // This question has an "Other" input
        options: [
            { text: 'The visual aesthetics and polish.', category: 'Visual Preferences and Detail Orientation' },
            { text: 'The overall strategy and vision.', category: 'Innovation and Strategic Thinking' },
            { text: 'The interactive functionality and technical feasibility.', category: 'Technical Inclinations and Prototyping' },
            { text: 'The system\'s logic and connections to other parts.', category: 'Systems Thinking and Collaboration' },
            { text: 'How well it aligns with stakeholder expectations and communicates effectively.', category: 'Communication and Stakeholder Management' },
            { text: 'The underlying data and user insights.', category: 'Research and Knowledge Building' },
            { text: 'The clarity and consistency of the messaging and tone.', category: 'Content and Brand Voice' },
            { text: 'The intuitive flow and ease of interaction.', category: 'User Journeys and Interaction Design' },
            // { text: 'Other (please specify)', category: null, value: 'other_specify' }, // Added value for "Other"
        ],
    },
    {
        id: 'q6',
        question: 'When starting a new project, what do you MOST prefer to do first? (Please choose only one.)',
        type: 'radio',
        options: [
            { text: 'Define the visual specifications and detailed UI.', category: 'Visual Preferences and Detail Orientation' },
            { text: 'Brainstorm innovative concepts and strategies.', category: 'Innovation and Strategic Thinking' },
            { text: 'Investigate the technical constraints and opportunities.', category: 'Technical Inclinations and Prototyping' },
            { text: 'Analyze how this project fits into the larger ecosystem and simplify complex systems.', category: 'Systems Thinking and Collaboration' },
            { text: 'Meet with stakeholders to gather different perspectives and build consensus.', category: 'Communication and Stakeholder Management' },
            { text: 'Research user needs and market trends, and interrogate existing data.', category: 'Research and Knowledge Building' },
            { text: 'Outline the key messages and desired tone of voice.', category: 'Content and Brand Voice' },
            { text: 'Map out user flows and define interaction patterns.', category: 'User Journeys and Interaction Design' },
        ],
    },
    {
        id: 'q7',
        question: 'What are your preferred design tools? (Please choose all that apply.)',
        type: 'checkbox',
        hasOtherInput: true, // This question has an "Other" input
        options: [
            { text: 'Primarily visual design software (e.g., Figma for mockups, Adobe Creative Suite).', category: 'Visual Preferences and Detail Orientation' },
            { text: 'Tools for strategy and presentations (e.g., Figjam, Miro, Keynote).', category: 'Innovation and Strategic Thinking' },
            { text: 'Prototyping and coding tools (e.g., Framer, Principle, code editors, Webflow).', category: 'Technical Inclinations and Prototyping' },
            { text: 'Tools for system mapping, architecture diagrams, and documentation.', category: 'Systems Thinking and Collaboration' },
            { text: 'Communication and collaboration platforms (e.g., Slack, Notion, Asana for team alignment).', category: 'Communication and Stakeholder Management' },
            { text: 'Data analysis and research tools (e.g., user testing platforms, analytics dashboards, survey tools).', category: 'Research and Knowledge Building' },
            { text: 'Tools for content creation and voice guidelines (e.g., content management systems, style guides).', category: 'Content and Brand Voice' },
            { text: 'Tools for user flow mapping and interaction design (e.g., Figma for flows, Axure).', category: 'User Journeys and Interaction Design' },
            // { text: 'Other (please specify)', category: null, value: 'other_specify' }, // Added value for "Other"
        ],
    },
    {
        id: 'q8',
        question: 'Of the below options, which do you MOST ENJOY? (Please choose only one.)',
        type: 'radio', // Changed to checkbox
        options: [
            { text: 'Designing detailed visual interfaces and ensuring pixel-perfect execution.', category: 'Visual Preferences and Detail Orientation' },
            { text: 'Developing a comprehensive design strategy and envisioning future possibilities.', category: 'Innovation and Strategic Thinking' },
            { text: 'Building a complex interactive prototype and exploring technical solutions.', category: 'Technical Inclinations and Prototyping' },
            { text: 'Optimizing a design system for efficiency and connecting the dots across teams.', category: 'Systems Thinking and Collaboration' },
            { text: 'Facilitating productive discussions and finding common solutions with stakeholders.', category: 'Communication and Stakeholder Management' },
            { text: 'Conducting deep research and analysis to generate actionable insights.', category: 'Research and Knowledge Building' },
            { text: 'Crafting clear, consistent, and impactful language and messaging.', category: 'Content and Brand Voice' },
            { text: 'Ensuring intuitive and engaging user experiences through interaction design.', category: 'User Journeys and Interaction Design' },
        ],
    },
    {
        id: 'q9',
        question: 'When faced with differing opinions on a design, what action are you MOST likely to take? (Please choose only one.)',
        type: 'radio', // Changed to checkbox
        options: [
            { text: 'Defend the visual design rationale and adherence to style guides.', category: 'Visual Preferences and Detail Orientation' },
            { text: 'Focus on the overall strategic goals and long-term vision to guide the discussion.', category: 'Innovation and Strategic Thinking' },
            { text: 'Explore the technical implications of each option and suggest prototype iterations.', category: 'Technical Inclinations and Prototyping' },
            { text: 'Analyze the impact on the larger system and highlight interdependencies.', category: 'Systems Thinking and Collaboration' },
            { text: 'Seek common ground and facilitate a compromise that works for all stakeholders.', category: 'Communication and Stakeholder Management' },
            { text: 'Present data and research to support a decision and provide evidence-based recommendations.', category: 'Research and Knowledge Building' },
            { text: 'Reframe the discussion based on user-centric messaging and brand voice.', category: 'Content and Brand Voice' },
            { text: 'Walk through user flows and interaction patterns to demonstrate the impact of different choices.', category: 'User Journeys and Interaction Design' },
        ],
    },
    {
        id: 'q10',
        question: 'Of the below options regarding design tasks, which one do you find the MOST motivating? (Please choose only one.)',
        type: 'radio', // Changed to checkbox
        options: [
            { text: 'Refining and polishing visual details to achieve a pixel-perfect outcome.', category: 'Visual Preferences and Detail Orientation' },
            { text: 'Creating innovative and future-oriented concepts that solve complex problems.', category: 'Innovation and Strategic Thinking' },
            { text: 'Solving technical challenges and building functional prototypes.', category: 'Technical Inclinations and Prototyping' },
            { text: 'Improving the efficiency and scalability of a system by finding logical connections.', category: 'Systems Thinking and Collaboration' },
            { text: 'Building consensus and fostering collaboration across diverse teams.', category: 'Communication and Stakeholder Management' },
            { text: 'Deep research and analysis to generate insights and uncover user needs.', category: 'Research and Knowledge Building' },
            { text: 'Ensuring consistent and impactful communication that resonates with the audience.', category: 'Content and Brand Voice' },
            { text: 'Designing seamless and delightful user interactions.', category: 'User Journeys and Interaction Design' },
        ],
    },
];

// --- DOM Elements --- (will be initialized after DOM loads)
let landingPageDiv, startQuizButton, questionContentDiv, prevButton, nextButton;
let questionnaireSection, resultsModal, bestMatchSection, archetypeListUl, restartButton, radarChartCanvas;
let chartToggle, radarView, barsView, percentageBarsDiv, currentChartView;

// --- Functions ---

// Create confetti explosion effect
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti-piece';
        
        // Random horizontal position
        confettiPiece.style.left = Math.random() * 100 + '%';
        
        // Random animation delay for staggered effect
        confettiPiece.style.animationDelay = Math.random() * 0.8 + 's';
        
        // Random horizontal drift during fall
        const drift = (Math.random() - 0.5) * 300; // -150px to +150px drift
        confettiPiece.style.setProperty('--drift', drift + 'px');
        
        // Add some random rotation speed variation
        const rotationSpeed = 360 + Math.random() * 1080; // 360-1440 degrees
        confettiPiece.style.setProperty('--rotation', rotationSpeed + 'deg');
        
        // Random fall speed variation
        const fallDuration = 2.5 + Math.random() * 2; // 2.5-4.5 seconds
        confettiPiece.style.animationDuration = fallDuration + 's';
        
        confettiContainer.appendChild(confettiPiece);
    }

    // Remove confetti container after animation completes
    setTimeout(() => {
        if (confettiContainer.parentNode) {
            confettiContainer.parentNode.removeChild(confettiContainer);
        }
    }, 5500); // Increased to account for variable fall speeds
}

// Create fireworks explosion effect
function createFireworks() {
    const fireworksContainer = document.createElement('div');
    fireworksContainer.className = 'fireworks-container';
    document.body.appendChild(fireworksContainer);

    // Create multiple firework explosions
    const explosionCount = 5; // Number of firework explosions
    
    for (let explosion = 0; explosion < explosionCount; explosion++) {
        setTimeout(() => {
            // Random explosion location
            const explosionX = 20 + Math.random() * 60; // 20-80% from left
            const explosionY = 20 + Math.random() * 40; // 20-60% from top
            
            // Create particles for this explosion
            const particleCount = 25; // Particles per explosion
            
            for (let i = 0; i < particleCount; i++) {
                const firework = document.createElement('div');
                firework.className = 'firework firework-burst';
                
                // Add random variations
                if (Math.random() < 0.3) firework.classList.add('firework-large');
                if (Math.random() < 0.2) firework.classList.add('firework-trail');
                
                // Position at explosion center
                firework.style.left = explosionX + '%';
                firework.style.top = explosionY + '%';
                
                // Calculate explosion direction (360 degrees around)
                const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
                const distance = 60 + Math.random() * 120; // Random explosion radius
                
                // Calculate particle trajectory
                const trajectoryX = Math.cos(angle) * distance;
                const trajectoryY = Math.sin(angle) * distance;
                
                // Set CSS custom properties for animation
                firework.style.setProperty('--firework-x', trajectoryX + 'px');
                firework.style.setProperty('--firework-y', trajectoryY + 'px');
                
                // Random animation delay for more organic feel
                firework.style.animationDelay = (Math.random() * 0.3) + 's';
                
                // Variable animation duration
                const duration = 1.8 + Math.random() * 0.7; // 1.8-2.5 seconds
                firework.style.animationDuration = duration + 's';
                
                fireworksContainer.appendChild(firework);
            }
        }, explosion * 400); // Stagger explosions by 400ms
    }

    // Remove fireworks container after animations complete
    setTimeout(() => {
        if (fireworksContainer.parentNode) {
            fireworksContainer.parentNode.removeChild(fireworksContainer);
        }
    }, 4500);
}

// Create sparkling stars effect
function createSparklingStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);

    // Create 30 twinkling stars
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size
        const size = 4 + Math.random() * 8;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        star.style.animationDelay = Math.random() * 2 + 's';
        
        // Random color variation
        const colors = ['#fff', '#ffeb3b', '#4ecdc4', '#ff6b6b', '#ffa726'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        star.style.color = color;
        
        starsContainer.appendChild(star);
    }

    setTimeout(() => {
        if (starsContainer.parentNode) {
            starsContainer.parentNode.removeChild(starsContainer);
        }
    }, 4000);
}

// Create glitter rain effect
function createGlitterRain() {
    const glitterContainer = document.createElement('div');
    glitterContainer.className = 'glitter-container';
    document.body.appendChild(glitterContainer);

    // Create 150 glitter pieces
    for (let i = 0; i < 150; i++) {
        const glitter = document.createElement('div');
        glitter.className = 'glitter';
        
        // Random horizontal position
        glitter.style.left = Math.random() * 100 + '%';
        
        // Random animation delay
        glitter.style.animationDelay = Math.random() * 1.5 + 's';
        
        // Random drift
        const drift = (Math.random() - 0.5) * 200;
        glitter.style.setProperty('--glitter-drift', drift + 'px');
        
        // Random colors
        const colors = ['#ffd700', '#ffeb3b', '#ff6b6b', '#4ecdc4', '#ffa726', '#e91e63'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        glitter.style.background = color;
        
        glitterContainer.appendChild(glitter);
    }

    setTimeout(() => {
        if (glitterContainer.parentNode) {
            glitterContainer.parentNode.removeChild(glitterContainer);
        }
    }, 4500);
}

// Create balloon release effect
function createBalloonRelease() {
    const balloonsContainer = document.createElement('div');
    balloonsContainer.className = 'balloons-container';
    document.body.appendChild(balloonsContainer);

    // Create 15 balloons
    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Random horizontal position
        balloon.style.left = Math.random() * 90 + 5 + '%';
        
        // Random animation delay
        balloon.style.animationDelay = Math.random() * 1 + 's';
        
        // Random drift and rotation
        const drift = (Math.random() - 0.5) * 300;
        const rotation = (Math.random() - 0.5) * 30;
        balloon.style.setProperty('--balloon-drift', drift + 'px');
        balloon.style.setProperty('--balloon-rotate', rotation + 'deg');
        
        // Random balloon colors
        const colors = ['#ff6b6b', '#4ecdc4', '#ffeb3b', '#ffa726', '#e91e63', '#9c27b0'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.background = color;
        
        balloonsContainer.appendChild(balloon);
    }

    setTimeout(() => {
        if (balloonsContainer.parentNode) {
            balloonsContainer.parentNode.removeChild(balloonsContainer);
        }
    }, 5000);
}

// Create floating hearts effect
function createFloatingHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'hearts-container';
    document.body.appendChild(heartsContainer);

    // Create 20 hearts
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        
        // Random horizontal position
        heart.style.left = Math.random() * 90 + 5 + '%';
        
        // Random animation delay
        heart.style.animationDelay = Math.random() * 2 + 's';
        
        // Random drift
        const drift = (Math.random() - 0.5) * 200;
        heart.style.setProperty('--heart-drift', drift + 'px');
        
        // Random size variation
        const scale = 0.7 + Math.random() * 0.6;
        heart.style.transform = `scale(${scale})`;
        
        heartsContainer.appendChild(heart);
    }

    setTimeout(() => {
        if (heartsContainer.parentNode) {
            heartsContainer.parentNode.removeChild(heartsContainer);
        }
    }, 4000);
}

// Create bubble pop effect
function createBubblePop() {
    const bubblesContainer = document.createElement('div');
    bubblesContainer.className = 'bubbles-container';
    document.body.appendChild(bubblesContainer);

    // Create 25 bubbles
    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Random size
        const size = 20 + Math.random() * 40;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        
        // Random horizontal position
        bubble.style.left = Math.random() * 90 + 5 + '%';
        
        // Random animation delay
        bubble.style.animationDelay = Math.random() * 1.5 + 's';
        
        // Random drift
        const drift = (Math.random() - 0.5) * 150;
        bubble.style.setProperty('--bubble-drift', drift + 'px');
        
        bubblesContainer.appendChild(bubble);
    }

    setTimeout(() => {
        if (bubblesContainer.parentNode) {
            bubblesContainer.parentNode.removeChild(bubblesContainer);
        }
    }, 4000);
}

// Create spiral galaxy effect
function createSpiralGalaxy() {
    const galaxyContainer = document.createElement('div');
    galaxyContainer.className = 'galaxy-container';
    document.body.appendChild(galaxyContainer);

    // Create 60 galaxy particles
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'galaxy-particle';
        
        // Calculate spiral arm position
        const armIndex = i % 3; // 3 spiral arms
        const armRotation = (armIndex * 120) + (i / 3) * 15;
        const spiralRadius = 50 + (i / 60) * 250;
        
        particle.style.setProperty('--spiral-rotation', armRotation + 'deg');
        particle.style.setProperty('--spiral-radius', spiralRadius + 'px');
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 0.8 + 's';
        
        // Random colors
        const colors = ['#fff', '#4ecdc4', '#ff6b6b', '#ffeb3b', '#ffa726'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = `radial-gradient(circle, ${color}, transparent)`;
        particle.style.color = color;
        
        galaxyContainer.appendChild(particle);
    }

    setTimeout(() => {
        if (galaxyContainer.parentNode) {
            galaxyContainer.parentNode.removeChild(galaxyContainer);
        }
    }, 3500);
}

// Create rainbow wave effect
function createRainbowWave() {
    const rainbowContainer = document.createElement('div');
    rainbowContainer.className = 'rainbow-container';
    document.body.appendChild(rainbowContainer);

    // Create multiple wave particles
    const colors = ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080'];
    
    for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        particle.className = 'rainbow-particle';
        
        // Wave pattern
        const waveOffset = Math.sin((i / 80) * Math.PI * 4) * 100;
        const verticalPos = 50 + waveOffset;
        
        particle.style.top = verticalPos + '%';
        particle.style.setProperty('--wave-offset', (waveOffset * 0.5) + 'px');
        
        // Rainbow colors
        const color = colors[i % colors.length];
        particle.style.background = color;
        particle.style.color = color;
        
        // Staggered animation
        particle.style.animationDelay = (i * 0.02) + 's';
        
        rainbowContainer.appendChild(particle);
    }

    setTimeout(() => {
        if (rainbowContainer.parentNode) {
            rainbowContainer.parentNode.removeChild(rainbowContainer);
        }
    }, 3000);
}

// Create meteor shower effect
function createMeteorShower() {
    const meteorsContainer = document.createElement('div');
    meteorsContainer.className = 'meteors-container';
    document.body.appendChild(meteorsContainer);

    // Create 20 meteors
    for (let i = 0; i < 20; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // Random starting position (top and sides)
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * 200;
        
        meteor.style.left = startX + 'px';
        meteor.style.top = startY + 'px';
        
        // Random trajectory
        const endX = startX + (200 + Math.random() * 400);
        const endY = startY + (200 + Math.random() * 400);
        
        meteor.style.setProperty('--meteor-x', (endX - startX) + 'px');
        meteor.style.setProperty('--meteor-y', (endY - startY) + 'px');
        
        // Random animation delay
        meteor.style.animationDelay = Math.random() * 2 + 's';
        
        meteorsContainer.appendChild(meteor);
    }

    setTimeout(() => {
        if (meteorsContainer.parentNode) {
            meteorsContainer.parentNode.removeChild(meteorsContainer);
        }
    }, 4000);
}

// Randomly choose celebration effect from ALL available effects!
function createCelebration() {
    const effects = [
        { name: 'Confetti', emoji: '🎉', func: createConfetti },
        { name: 'Fireworks', emoji: '🎆', func: createFireworks },
        { name: 'Sparkling Stars', emoji: '⭐', func: createSparklingStars },
        { name: 'Glitter Rain', emoji: '✨', func: createGlitterRain },
        { name: 'Balloon Release', emoji: '🎈', func: createBalloonRelease },
        { name: 'Floating Hearts', emoji: '💝', func: createFloatingHearts },
        { name: 'Bubble Pop', emoji: '🫧', func: createBubblePop },
        { name: 'Spiral Galaxy', emoji: '🌀', func: createSpiralGalaxy },
        { name: 'Rainbow Wave', emoji: '🌈', func: createRainbowWave },
        { name: 'Meteor Shower', emoji: '☄️', func: createMeteorShower }
    ];
    
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    console.log(`${randomEffect.emoji} ${randomEffect.name} celebration!`);
    
    randomEffect.func();
}

// Toggle between radar chart and percentage bars
function toggleChartView() {
    const isChecked = chartToggle.checked;
    
    if (isChecked) {
        // Switch to radar view (when toggle is ON)
        currentChartView = 'radar';
        radarView.classList.remove('hidden');
        barsView.classList.add('hidden');
        // Re-create radar chart with animation when switching to this view
        createRadarChart();
    } else {
        // Switch to bars view (when toggle is OFF)
        currentChartView = 'bars';
        barsView.classList.remove('hidden');
        radarView.classList.add('hidden');
        // Re-render bars with animation when switching to this view
        renderPercentageBars();
    }
}

// Create radar chart with animation
function createRadarChart() {
    if (radarChartInstance) {
        radarChartInstance.destroy(); // Destroy previous instance if exists
    }
    const radarCtx = radarChartCanvas.getContext('2d');
    radarChartInstance = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: Object.keys(archetypePercentageScores),
            datasets: [
                {
                    label: 'Your Archetype Scores',
                    data: Object.values(archetypePercentageScores),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1, // Smooth line curves
                    fill: true // Fill the area under the line
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500, // Animation duration in milliseconds
                easing: 'easeOutQuart', // Smooth easing function
            },
            datasets: {
                line: {
                    tension: 0.1 // Slightly curved lines for smoother appearance
                }
            },
            elements: {
                point: {
                    radius: 3, // Smaller visible dot size
                    hitRadius: 15, // Increased hit radius for larger hover area
                    hoverRadius: 8 // Increased hover radius for visual feedback
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    grid: {
                        color: 'rgba(208, 217, 251, 0.16)', // #D0D9FB at 16% opacity
                        lineWidth: 1
                    },
                    pointLabels: {
                        font: {
                            family: 'BuilderSans',
                            size: 8
                        },
                        color: '#BCBEC8'
                    },
                    suggestedMin: 0,
                    suggestedMax: 100, // Max for percentage
                    ticks: {
                        display: false, // Do not display ticks on the axis
                        beginAtZero: true,
                        callback: function(value) {
                            return value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false, // Removed legend display
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            // Display Archetype Name as title
                            return context[0].label;
                        },
                        label: function(context) {
                            // Display percentage as content
                            return context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render percentage bars with animation
function renderPercentageBars() {
    const sortedArchetypes = Object.entries(archetypePercentageScores)
        .filter(([, score]) => score > 0) // Only show scores above 0%
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
    
    // Initially render bars with 0% width for animation
    percentageBarsDiv.innerHTML = sortedArchetypes.map(([archetype, score]) => `
        <div class="percentage-bar-container py-2">
            <span class="archetype-label">${archetype}</span>
            <div class="percentage-bar">
                <div class="percentage-bar-fill" data-width="${score}" style="width: 0%"></div>
            </div>
            <span class="percentage-value">${score}%</span>
        </div>
    `).join('');
    
    // Animate bars to their final values with staggered timing
    setTimeout(() => {
        const fills = percentageBarsDiv.querySelectorAll('.percentage-bar-fill');
        fills.forEach((fill, index) => {
            setTimeout(() => {
                const finalWidth = fill.getAttribute('data-width');
                fill.style.width = `${finalWidth}%`;
            }, index * 100); // Stagger animation by 100ms per bar
        });
    }, 50); // Small delay to ensure DOM is ready
}

// Renders the current question based on currentStep
function renderQuestion() {
    const currentQ = questionnaire[currentStep];
    let optionsHtml = '';
    let errorMessage = '';

    // Dynamically populate options for Q2 and Q4
    if (currentQ.id === 'q2') {
        const selectedQ1Options = userAnswers['q1'] || [];
        currentQ.options = questionnaire[0].options.filter(opt => selectedQ1Options.includes(opt.text));
        if (currentQ.options.length === 0) {
            errorMessage = '<p class="text-red-500 text-sm mt-2">Please go back and select options in the first multi-choice question to see options here.</p>';
        }
    } else if (currentQ.id === 'q4') {
        const selectedQ3Options = userAnswers['q3'] || [];
        currentQ.options = questionnaire[2].options.filter(opt => selectedQ3Options.includes(opt.text));
        if (currentQ.options.length === 0) {
            errorMessage = '<p class="text-red-500 text-sm mt-2">Please go back and select options in the previous multi-choice question to see options here.</p>';
        }
    }

    if (currentQ.type === 'checkbox') {
        optionsHtml = currentQ.options.map((option, index) => {
            const isOther = option.value === 'other_specify';
            const isChecked = (userAnswers[currentQ.id] && userAnswers[currentQ.id].includes(option.text));
            const otherInputId = `other-input-${currentQ.id}`;
            const otherTextInputValue = userAnswers[`${currentQ.id}_other_text`] || '';

            return `
                <label class="flex items-center p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors duration-200">
                    <input
                        type="checkbox"
                        name="${currentQ.id}"
                        value="${option.text}"
                        class="custom-checkbox mr-3"
                        ${isChecked ? 'checked' : ''}
                    />
                    <span class="questionnaire-text">${option.text}</span>
                </label>
                ${isOther ? `
                    <div id="${otherInputId}" class="ml-8 mt-2 ${isChecked ? '' : 'hidden'}">
                        <input
                            type="text"
                            placeholder="Please specify"
                            class="w-full p-2 bg-white/10 border border-white/20 rounded-md focus:ring-blue-500 focus:border-blue-500 questionnaire-text"
                            value="${otherTextInputValue}"
                            oninput="handleOtherTextInput('${currentQ.id}', this.value)"
                        />
                    </div>
                ` : ''}
            `;
        }).join('');
    } else if (currentQ.type === 'radio') {
        optionsHtml = currentQ.options.map((option, index) => {
            const isOther = option.value === 'other_specify';
            const isSelected = userAnswers[currentQ.id] === option.text;
            const otherInputId = `other-input-${currentQ.id}`;
            const otherTextInputValue = userAnswers[`${currentQ.id}_other_text`] || '';

            return `
                <label class="flex items-center p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors duration-200">
                    <input
                        type="radio"
                        name="${currentQ.id}"
                        value="${option.text}"
                        class="custom-radio mr-3"
                        ${isSelected ? 'checked' : ''}
                    />
                    <span class="questionnaire-text">${option.text}</span>
                </label>
                ${isOther ? `
                    <div id="${otherInputId}" class="ml-8 mt-2 ${isSelected ? '' : 'hidden'}">
                        <input
                            type="text"
                            placeholder="Please specify"
                            class="w-full p-2 bg-white/10 border border-white/20 rounded-md focus:ring-blue-500 focus:border-blue-500 questionnaire-text"
                            value="${otherTextInputValue}"
                            oninput="handleOtherTextInput('${currentQ.id}', this.value)"
                        />
                    </div>
                ` : ''}
            `;
        }).join('');
    }

    questionContentDiv.innerHTML = `
        <p class="questionnaire-text question-text mb-4">${currentQ.question}</p>
        <div class="space-y-3">
            ${optionsHtml}
        </div>
        ${errorMessage}
    `;

    // Update button states
    if (currentStep === 0) {
        prevButton.style.display = 'none'; // Hide previous button on first question
    } else {
        prevButton.style.display = 'inline-block'; // Show previous button on other questions
        prevButton.disabled = false;
    }
    
    nextButton.textContent = currentStep === questionnaire.length - 1 ? 'Submit' : 'Next';
    updateNextButtonState(); // Set initial Next button state
    // Button styling is now handled by CSS classes

    // Add event listeners for the newly rendered inputs
    const inputs = questionContentDiv.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', (event) => {
            handleAnswerChange(currentQ.id, event.target.value, currentQ.type);
            // Toggle visibility of other input field if applicable
            if (currentQ.hasOtherInput) {
                const otherInputDiv = document.getElementById(`other-input-${currentQ.id}`);
                if (otherInputDiv) {
                    const isOtherSelected = (currentQ.type === 'checkbox' && event.target.checked && event.target.value === 'Other (please specify)') ||
                                            (currentQ.type === 'radio' && event.target.value === 'Other (please specify)');
                    otherInputDiv.classList.toggle('hidden', !isOtherSelected);
                    if (!isOtherSelected) {
                        // Clear the text input if "Other" is deselected
                        userAnswers[`${currentQ.id}_other_text`] = '';
                        const otherTextInput = otherInputDiv.querySelector('input[type="text"]');
                        if (otherTextInput) otherTextInput.value = '';
                    }
                }
            }
        });
    });

    // Auto-select if there's only one option
    if (currentQ.options.length === 1) {
        const singleOption = currentQ.options[0];
        const optionText = singleOption.text;
        
        // Automatically select the single option
        handleAnswerChange(currentQ.id, optionText, currentQ.type);
        
        // Find and check the corresponding input element
        const inputElement = questionContentDiv.querySelector(`input[value="${optionText}"]`);
        if (inputElement) {
            inputElement.checked = true;
        }
        
        // Note: User still needs to click "Next" to proceed
    }
}

// Handles changes to answers and updates userAnswers object
function handleAnswerChange(questionId, value, type) {
    if (type === 'checkbox') {
        if (!userAnswers[questionId]) {
            userAnswers[questionId] = [];
        }
        if (userAnswers[questionId].includes(value)) {
            userAnswers[questionId] = userAnswers[questionId].filter(item => item !== value);
        } else {
            userAnswers[questionId].push(value);
        }
    } else { // radio
        userAnswers[questionId] = value;
    }
    // Update button state after answer change
    updateNextButtonState();
}

// Check if current question has valid answers
function isCurrentQuestionValid() {
    const currentQ = questionnaire[currentStep];
    
    if (currentQ.type === 'radio') {
        if (!userAnswers[currentQ.id]) {
            return false;
        }
        // Check if "Other" option is selected and needs text input
        if (currentQ.hasOtherInput && userAnswers[currentQ.id] === 'Other (please specify)') {
            return userAnswers[`${currentQ.id}_other_text`] && userAnswers[`${currentQ.id}_other_text`].trim() !== '';
        }
        return true;
    } else if (currentQ.type === 'checkbox') {
        if (!userAnswers[currentQ.id] || userAnswers[currentQ.id].length === 0) {
            return false;
        }
        // Check if "Other" option is selected and needs text input
        if (currentQ.hasOtherInput && userAnswers[currentQ.id].includes('Other (please specify)')) {
            return userAnswers[`${currentQ.id}_other_text`] && userAnswers[`${currentQ.id}_other_text`].trim() !== '';
        }
        return true;
    }
    return false;
}

// Update Next button disabled state
function updateNextButtonState() {
    const isValid = isCurrentQuestionValid();
    nextButton.disabled = !isValid;
}

// Handles input from the "Other (please specify)" text field
function handleOtherTextInput(questionId, text) {
    userAnswers[`${questionId}_other_text`] = text;
    // Update button state when other text changes
    updateNextButtonState();
}

// Navigates to the next question or submits the questionnaire
function nextStep() {
    // Button is only enabled when validation passes, so we can proceed directly
    if (currentStep < questionnaire.length - 1) {
        currentStep++;
        renderQuestion();
    } else {
        calculateScores();
        showResults();
    }
}

// Navigates to the previous question
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        renderQuestion();
    }
}

// Calculates archetype scores (raw and percentage)
function calculateScores() {
    // Initialize all archetype raw scores to 0
    Object.keys(archetypes).forEach(archetype => {
        archetypeRawScores[archetype] = 0;
    });

    // Iterate through answers and update raw scores
    Object.entries(userAnswers).forEach(([questionId, answerValue]) => {
        // Skip 'other_text' entries directly
        if (questionId.endsWith('_other_text')) return;

        const questionDef = questionnaire.find(q => q.id === questionId);
        if (!questionDef) return;

        if (Array.isArray(answerValue)) { // Checkbox answers
            answerValue.forEach(selectedText => {
                const option = questionDef.options.find(opt => opt.text === selectedText);
                if (option && option.category) {
                    Object.entries(archetypes).forEach(([archetype, data]) => {
                        if (data.keywords.includes(option.category)) {
                            archetypeRawScores[archetype] = (archetypeRawScores[archetype] || 0) + 1;
                        }
                    });
                }
            });
        } else { // Radio answers
            let originalOption = null;
            if (questionId === 'q2' && userAnswers['q1']) {
                originalOption = questionnaire[0].options.find(opt => opt.text === answerValue);
            } else if (questionId === 'q4' && userAnswers['q3']) {
                originalOption = questionnaire[2].options.find(opt => opt.text === answerValue);
            } else {
                originalOption = questionDef.options.find(opt => opt.text === answerValue);
            }

            if (originalOption && originalOption.category) {
                Object.entries(archetypes).forEach(([archetype, data]) => {
                    if (data.keywords.includes(originalOption.category)) {
                        archetypeRawScores[archetype] = (archetypeRawScores[archetype] || 0) + 2; // Give more weight to single choice answers
                    }
                });
            }
        }
    });

    // Calculate percentage scores
    Object.entries(archetypeRawScores).forEach(([archetype, rawScore]) => {
        const maxScore = maxPossibleScores[archetype];
        if (maxScore > 0) {
            archetypePercentageScores[archetype] = parseFloat(((rawScore / maxScore) * 100).toFixed(1));
        } else {
            archetypePercentageScores[archetype] = 0;
        }
    });

    // Determine the best match based on percentage scores
    let maxPercentage = -1;
    let bestArchetype = null;
    Object.entries(archetypePercentageScores).forEach(([archetype, percentage]) => {
        if (percentage > maxPercentage) {
            maxPercentage = percentage;
            bestArchetype = archetype;
        }
    });
    bestMatchedArchetype = bestArchetype;
}

// Displays the results modal
function showResults() {
    questionnaireSection.classList.add('hidden');
    resultsModal.classList.remove('hidden');

    // Trigger random celebration effect! 🎉🎆
    setTimeout(() => {
        createCelebration(); // Randomly chooses between confetti or fireworks!
    }, 300); // Small delay to let modal fade in first

    // Display best match
    if (bestMatchedArchetype) {
        const bestArchetypeData = archetypes[bestMatchedArchetype];
        bestMatchSection.innerHTML = `
            <div class="flex items-start justify-between mb-6">
                <img
                    src="${bestArchetypeData.image}"
                    alt="${bestMatchedArchetype}"
                    class="archetype-image archetype-link object-cover rounded-full mr-6 flex-shrink-0"
                    onerror="this.onerror=null;this.src='https://placehold.co/120x120/CCCCCC/000000?text=${bestMatchedArchetype.replace(/\s/g, '+')}';"
                    onclick="window.open('${bestArchetypeData.link}', '_blank')"
                    title="Click to learn more about ${bestMatchedArchetype}"
                />
                <div class="flex-grow">
                    <p class="text text-gray-300 mb-2">Your best match</p>
                    <h3 class="archetype-name leading-tight mb-2 archetype-link" 
                        onclick="window.open('${bestArchetypeData.link}', '_blank')"
                        title="Click to learn more about ${bestMatchedArchetype}"
                    >${bestMatchedArchetype}</h3>
                    <p class="archetype-moniker">${bestArchetypeData.moniker}</p>
                </div>
                <div class="percentage-circle">
                    <span class="percentage-text">${archetypePercentageScores[bestMatchedArchetype]}%</span>
                </div>
            </div>
            <p class="text-lg text-gray-200 mb-8">${bestArchetypeData.description}</p>
        `;
    }

    // Create Radar Chart
    createRadarChart();

    // Render Percentage Bars
    renderPercentageBars();

    // Set default view to bars (toggle OFF)
    currentChartView = 'bars';
    chartToggle.checked = false;
    barsView.classList.remove('hidden');
    radarView.classList.add('hidden');

    // Removed Display sorted list of archetypes and scores
    // const sortedArchetypes = Object.entries(archetypePercentageScores).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
    // archetypeListUl.innerHTML = sortedArchetypes.map(([archetype, score]) => `
    //     <li class="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
    //         <span class="text-lg font-medium text-gray-700">${archetype} (${archetypes[archetype]?.moniker})</span>
    //         <span class="text-xl font-bold text-blue-600">${score}%</span>
    //     </li>
    // `).join('');
}

// Resets the questionnaire and hides results modal
function restartQuestionnaire() {
    currentStep = 0;
    userAnswers = {};
    archetypeRawScores = {};
    archetypePercentageScores = {};
    bestMatchedArchetype = null;
    if (radarChartInstance) {
        radarChartInstance.destroy();
        radarChartInstance = null;
    }
    resultsModal.classList.add('hidden');
    landingPageDiv.classList.remove('hidden'); // Go back to landing page
    questionnaireSection.classList.add('hidden'); // Ensure questionnaire is hidden
    // No need to call renderQuestion here, as the landing page is shown
}

// Initialize DOM elements and set up event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM element references
    landingPageDiv = document.getElementById('landing-page');
    startQuizButton = document.getElementById('start-quiz-button');
    questionContentDiv = document.getElementById('question-content');
    prevButton = document.getElementById('prev-button');
    nextButton = document.getElementById('next-button');
    questionnaireSection = document.getElementById('questionnaire-section');
    resultsModal = document.getElementById('results-modal');
    bestMatchSection = document.getElementById('best-match-section');
    archetypeListUl = document.getElementById('archetype-list'); // This element is now unused but kept for consistency
    restartButton = document.getElementById('restart-button');
    radarChartCanvas = document.getElementById('radarChart');
    chartToggle = document.getElementById('chart-toggle');
    radarView = document.getElementById('radar-view');
    barsView = document.getElementById('bars-view');
    percentageBarsDiv = document.getElementById('percentage-bars');

    // Set up event listeners
    startQuizButton.addEventListener('click', () => {
        landingPageDiv.classList.add('hidden');
        questionnaireSection.classList.remove('hidden');
        renderQuestion(); // Start the quiz
    });
    nextButton.addEventListener('click', nextStep);
    prevButton.addEventListener('click', prevStep);
    restartButton.addEventListener('click', restartQuestionnaire);
    
    // Chart toggle switching
    chartToggle.addEventListener('change', toggleChartView);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        // Only handle Enter key when questionnaire is visible and next button is enabled
        if (event.key === 'Enter' && 
            !questionnaireSection.classList.contains('hidden') && 
            !nextButton.disabled) {
            event.preventDefault();
            nextStep();
        }
    });

    // Initial state: show landing page, hide questionnaire and results
    landingPageDiv.classList.remove('hidden');
    questionnaireSection.classList.add('hidden');
    resultsModal.classList.add('hidden');
    
    // Initialize chart toggle to default state (OFF = bars view)
    if (chartToggle) {
        chartToggle.checked = false;
    }
});

// Expose handleOtherTextInput to global scope for inline oninput
window.handleOtherTextInput = handleOtherTextInput;
