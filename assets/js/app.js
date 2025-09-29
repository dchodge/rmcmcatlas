// MCMC Atlas Application
class MCMCAtlas {
    constructor() {
        this.algorithms = [];
        this.packages = [];
        this.filteredAlgorithms = [];
        this.currentSection = 'overview';
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateStats();
        this.renderAlgorithms();
        this.renderPackages();
        this.populateFilters();
    }

    async loadData() {
        try {
            const [algorithmsResponse, packagesResponse] = await Promise.all([
                fetch('data/algorithms.json'),
                fetch('data/packages.json')
            ]);
            
            this.algorithms = await algorithmsResponse.json();
            this.packages = await packagesResponse.json();
            this.filteredAlgorithms = [...this.algorithms];
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load data. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filters
        const categoryFilter = document.getElementById('category-filter');
        const packageFilter = document.getElementById('package-filter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        if (packageFilter) {
            packageFilter.addEventListener('change', () => this.applyFilters());
        }

        // Contribution form
        const contributionForm = document.getElementById('contribution-form');
        if (contributionForm) {
            contributionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContribution(e);
            });
        }
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionName}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;
    }

    updateStats() {
        const totalAlgorithms = this.algorithms.length;
        const totalPackages = this.packages.length;
        const totalCategories = new Set(this.algorithms.map(a => a.category)).size;
        const totalContributors = new Set([
            ...this.algorithms.map(a => a.contributor),
            ...this.packages.map(p => p.contributor)
        ]).size;

        // Update overview stats
        document.getElementById('total-algorithms').textContent = totalAlgorithms;
        document.getElementById('total-packages').textContent = totalPackages;
        document.getElementById('total-categories').textContent = totalCategories;
        document.getElementById('total-contributors').textContent = totalContributors;

        // Update about stats
        document.getElementById('about-total-algorithms').textContent = totalAlgorithms;
        document.getElementById('about-total-packages').textContent = totalPackages;
        document.getElementById('about-contributors').textContent = totalContributors;
        document.getElementById('last-updated').textContent = new Date().toLocaleDateString();
    }

    populateFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const packageFilter = document.getElementById('package-filter');

        if (categoryFilter) {
            const categories = [...new Set(this.algorithms.map(a => a.category))].sort();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = this.formatCategoryTitle(category);
                categoryFilter.appendChild(option);
            });
        }

        if (packageFilter) {
            // Get all unique package names from the packages arrays
            const allPackages = new Set();
            this.algorithms.forEach(algorithm => {
                if (algorithm.packages) {
                    algorithm.packages.forEach(pkg => {
                        allPackages.add(pkg.name);
                    });
                }
            });
            
            const packages = [...allPackages].sort();
            packages.forEach(pkg => {
                const option = document.createElement('option');
                option.value = pkg;
                option.textContent = pkg;
                packageFilter.appendChild(option);
            });
        }
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.filteredAlgorithms = [...this.algorithms];
        } else {
            this.filteredAlgorithms = this.algorithms.filter(algorithm => {
                return algorithm.name.toLowerCase().includes(searchTerm) ||
                       algorithm.description.toLowerCase().includes(searchTerm) ||
                       algorithm.packages.some(pkg => pkg.name.toLowerCase().includes(searchTerm)) ||
                       algorithm.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            });
        }
        
        this.applyFilters();
    }

    applyFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const packageFilter = document.getElementById('package-filter');

        let filtered = [...this.filteredAlgorithms];

        if (categoryFilter && categoryFilter.value) {
            filtered = filtered.filter(a => a.category === categoryFilter.value);
        }

        if (packageFilter && packageFilter.value) {
            filtered = filtered.filter(a => 
                a.packages.some(pkg => pkg.name === packageFilter.value)
            );
        }

        this.renderAlgorithms(filtered);
    }

    renderAlgorithms(algorithms = this.filteredAlgorithms) {
        const grid = document.getElementById('algorithms-grid');
        if (!grid) return;

        if (algorithms.length === 0) {
            grid.innerHTML = '<div class="no-results">No algorithms found matching your criteria.</div>';
            return;
        }

        // Group algorithms by category
        const groupedAlgorithms = this.groupAlgorithmsByCategory(algorithms);
        
        // Render each category with its algorithms
        grid.innerHTML = Object.entries(groupedAlgorithms).map(([category, categoryAlgorithms]) => {
            return this.createCategorySection(category, categoryAlgorithms);
        }).join('');
    }

    groupAlgorithmsByCategory(algorithms) {
        return algorithms.reduce((groups, algorithm) => {
            const category = algorithm.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(algorithm);
            return groups;
        }, {});
    }

    createCategorySection(category, algorithms) {
        const categoryTitle = this.formatCategoryTitle(category);
        const algorithmsHtml = algorithms.map(algorithm => this.createAlgorithmCard(algorithm)).join('');
        const explanation = this.getMCMCExplanation(category);
        const process = this.getMCMCProcess(category);
        const logo = this.getMCMCLogo(category);
        
        return `
            <div class="algorithm-row">
                <div class="row-header">
                    <div class="row-title-section">
                        <div class="mcmc-logo">${logo}</div>
                        <h3 class="row-title">${categoryTitle}</h3>
                    </div>
                    <div class="row-info-dropdown">
                        <button class="dropdown-toggle" onclick="atlas.toggleDropdown('${category}-info')">
                            <i class="fas fa-info-circle"></i> About ${categoryTitle}
                            <i class="fas fa-chevron-down dropdown-arrow"></i>
                        </button>
                        <div class="dropdown-content" id="${category}-info">
                            <div class="dropdown-body">
                                ${explanation}
                                ${process}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row-algorithms">
                    ${algorithmsHtml}
                </div>
            </div>
        `;
    }

    formatCategoryTitle(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    createMCMCDiagram(category) {
        const diagrams = {
            'non-adaptive-metropolis-hastings': `
                <div class="mcmc-diagram">
                    <div class="diagram-title">Metropolis-Hastings Process</div>
                    <div class="diagram-flow">
                        <div class="diagram-step">1. Start at θ₀</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">2. Propose θ* ~ q(·|θₜ)</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">3. Calculate α = min(1, π(θ*)/π(θₜ))</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">4. Accept with prob α</div>
                    </div>
                </div>
            `,
            'adaptive-metropolis-hastings': `
                <div class="mcmc-diagram">
                    <div class="diagram-title">Adaptive Metropolis Process</div>
                    <div class="diagram-flow">
                        <div class="diagram-step">1. Start with fixed proposal</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">2. Update proposal covariance</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">3. Adapt to target geometry</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">4. Maintain ergodicity</div>
                    </div>
                </div>
            `,
            'population-based-algorithms': `
                <div class="mcmc-diagram">
                    <div class="diagram-title">Population-based Sampling</div>
                    <div class="diagram-flow">
                        <div class="diagram-step">1. Multiple chains</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">2. Temperature ladder</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">3. Swap proposals</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">4. Enhanced mixing</div>
                    </div>
                </div>
            `,
            'sequential-algorithms': `
                <div class="mcmc-diagram">
                    <div class="diagram-title">Sequential Monte Carlo</div>
                    <div class="diagram-flow">
                        <div class="diagram-step">1. Sample particles</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">2. Weight by likelihood</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">3. Resample if needed</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">4. Propagate forward</div>
                    </div>
                </div>
            `,
            'hamiltonian-monte-carlo': `
                <div class="mcmc-diagram">
                    <div class="diagram-title">Hamiltonian Monte Carlo</div>
                    <div class="diagram-flow">
                        <div class="diagram-step">1. Add momentum p</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">2. Simulate dynamics</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">3. Accept/reject</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">4. Discard momentum</div>
                    </div>
                </div>
            `,
            'gibbs-sampler': `
                <div class="mcmc-diagram">
                    <div class="diagram-title">Gibbs Sampling</div>
                    <div class="diagram-flow">
                        <div class="diagram-step">1. Partition parameters</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">2. Sample from conditionals</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">3. Update each block</div>
                        <div class="diagram-arrow">→</div>
                        <div class="diagram-step">4. Repeat cycle</div>
                    </div>
                </div>
            `
        };
        return diagrams[category] || '<div class="mcmc-diagram">Diagram not available</div>';
    }

    getMCMCExplanation(category) {
        const explanations = {
            'non-adaptive-metropolis-hastings': `
                <p><strong>Non-adaptive Metropolis-Hastings</strong> is the foundational MCMC algorithm that uses a fixed proposal distribution to explore the target distribution.</p>
                <p><strong>Key features:</strong></p>
                <ul>
                    <li>Uses a fixed proposal distribution q(θ*|θₜ)</li>
                    <li>Acceptance probability based on likelihood ratio</li>
                    <li>Simple to implement but may be slow to converge</li>
                    <li>Requires careful tuning of proposal variance</li>
                </ul>
                <p><strong>Best for:</strong> Simple posterior distributions, when you have good intuition about the target shape.</p>
            `,
            'adaptive-metropolis-hastings': `
                <p><strong>Adaptive Metropolis-Hastings</strong> automatically adjusts the proposal distribution based on the history of the chain to improve mixing.</p>
                <p><strong>Key features:</strong></p>
                <ul>
                    <li>Proposal covariance adapts during sampling</li>
                    <li>Targets optimal acceptance rate (~0.44 for Gaussian targets)</li>
                    <li>Better exploration of complex posterior shapes</li>
                    <li>Maintains theoretical guarantees under conditions</li>
                </ul>
                <p><strong>Best for:</strong> Complex posterior distributions where fixed proposals are inefficient.</p>
            `,
            'population-based-algorithms': `
                <p><strong>Population-based algorithms</strong> run multiple chains simultaneously, often at different temperatures, to improve mixing and escape local modes.</p>
                <p><strong>Key features:</strong></p>
                <ul>
                    <li>Multiple chains explore different regions</li>
                    <li>Temperature ladder flattens the target distribution</li>
                    <li>Chain swapping improves mixing</li>
                    <li>Better at handling multimodal distributions</li>
                </ul>
                <p><strong>Best for:</strong> Multimodal distributions, complex landscapes with many local modes.</p>
            `,
            'sequential-algorithms': `
                <p><strong>Sequential algorithms</strong> (Particle Filters) are designed for dynamic systems where the target distribution evolves over time.</p>
                <p><strong>Key features:</strong></p>
                <ul>
                    <li>Particles represent samples from the posterior</li>
                    <li>Weights updated based on new observations</li>
                    <li>Resampling prevents weight collapse</li>
                    <li>Natural for time series and state space models</li>
                </ul>
                <p><strong>Best for:</strong> Time series analysis, state space models, online inference.</p>
            `,
            'hamiltonian-monte-carlo': `
                <p><strong>Hamiltonian Monte Carlo (HMC)</strong> uses Hamiltonian dynamics to propose moves that follow the gradient of the target distribution.</p>
                <p><strong>Key features:</strong></p>
                <ul>
                    <li>Uses gradient information for efficient proposals</li>
                    <li>Momentum variables enable long jumps</li>
                    <li>Requires gradients of the log-posterior</li>
                    <li>Often much more efficient than random-walk methods</li>
                </ul>
                <p><strong>Best for:</strong> High-dimensional problems, when gradients are available.</p>
            `,
            'gibbs-sampler': `
                <p><strong>Gibbs Sampling</strong> samples from the full conditional distributions of each parameter block, given all other parameters.</p>
                <p><strong>Key features:</strong></p>
                <ul>
                    <li>Samples from conditional distributions directly</li>
                    <li>No rejection - always accepts proposals</li>
                    <li>Requires tractable conditional distributions</li>
                    <li>Can be very efficient when conditionals are simple</li>
                </ul>
                <p><strong>Best for:</strong> Hierarchical models, when full conditionals are available.</p>
            `
        };
        return explanations[category] || '<p>Explanation not available.</p>';
    }

    getMCMCProcess(category) {
        const processes = {
            'non-adaptive-metropolis-hastings': `
                <div class="process-steps">
                    <h4>Metropolis-Hastings Process</h4>
                    <ol>
                        <li><strong>Initialization:</strong> Start with initial value θ₀</li>
                        <li><strong>Proposal:</strong> Generate candidate θ* ~ q(θ*|θₜ)</li>
                        <li><strong>Acceptance:</strong> Calculate α = min(1, π(θ*)q(θₜ|θ*)/π(θₜ)q(θ*|θₜ))</li>
                        <li><strong>Decision:</strong> Accept θ* with probability α, otherwise keep θₜ</li>
                        <li><strong>Repeat:</strong> Return to step 2 for next iteration</li>
                    </ol>
                    <p><strong>Key Parameters:</strong> Proposal variance σ², acceptance rate target ~0.44</p>
                </div>
            `,
            'adaptive-metropolis-hastings': `
                <div class="process-steps">
                    <h4>Adaptive Metropolis Process</h4>
                    <ol>
                        <li><strong>Initialization:</strong> Start with fixed proposal covariance C₀</li>
                        <li><strong>Adaptation:</strong> Update Cₜ based on chain history</li>
                        <li><strong>Proposal:</strong> Generate θ* ~ N(θₜ, sₜ²Cₜ)</li>
                        <li><strong>Acceptance:</strong> Standard MH acceptance probability</li>
                        <li><strong>Update:</strong> Modify proposal based on acceptance rate</li>
                        <li><strong>Convergence:</strong> Stop adaptation when chain stabilizes</li>
                    </ol>
                    <p><strong>Key Parameters:</strong> Adaptation rate γ, target acceptance rate, adaptation window</p>
                </div>
            `,
            'population-based-algorithms': `
                <div class="process-steps">
                    <h4>Population-based Process</h4>
                    <ol>
                        <li><strong>Initialization:</strong> Create K chains at different temperatures</li>
                        <li><strong>Parallel Sampling:</strong> Each chain samples independently</li>
                        <li><strong>Temperature Ladder:</strong> T₁ > T₂ > ... > Tₖ = 1</li>
                        <li><strong>Swap Proposals:</strong> Attempt to swap adjacent chains</li>
                        <li><strong>Acceptance:</strong> Accept swaps based on temperature difference</li>
                        <li><strong>Output:</strong> Use samples from T = 1 chain</li>
                    </ol>
                    <p><strong>Key Parameters:</strong> Number of chains K, temperature schedule, swap frequency</p>
                </div>
            `,
            'sequential-algorithms': `
                <div class="process-steps">
                    <h4>Particle Filter Process</h4>
                    <ol>
                        <li><strong>Initialization:</strong> Sample particles {x₀ⁱ} from prior</li>
                        <li><strong>Prediction:</strong> Propagate particles through dynamics</li>
                        <li><strong>Update:</strong> Weight particles by likelihood wₜⁱ ∝ p(yₜ|xₜⁱ)</li>
                        <li><strong>Resampling:</strong> Resample if effective sample size is low</li>
                        <li><strong>Estimation:</strong> Compute posterior estimates</li>
                        <li><strong>Repeat:</strong> Move to next time step</li>
                    </ol>
                    <p><strong>Key Parameters:</strong> Number of particles N, resampling threshold, proposal distribution</p>
                </div>
            `,
            'hamiltonian-monte-carlo': `
                <div class="process-steps">
                    <h4>HMC Process</h4>
                    <ol>
                        <li><strong>Momentum:</strong> Sample p₀ ~ N(0, M)</li>
                        <li><strong>Dynamics:</strong> Simulate Hamiltonian equations for L steps</li>
                        <li><strong>Leapfrog:</strong> Use leapfrog integrator with step size ε</li>
                        <li><strong>Acceptance:</strong> Accept (θ*, p*) with probability min(1, exp(-H(θ*, p*) + H(θ, p)))</li>
                        <li><strong>Discard:</strong> Discard momentum, keep position</li>
                        <li><strong>Repeat:</strong> Sample new momentum and repeat</li>
                    </ol>
                    <p><strong>Key Parameters:</strong> Step size ε, number of steps L, mass matrix M</p>
                </div>
            `,
            'gibbs-sampler': `
                <div class="process-steps">
                    <h4>Gibbs Sampling Process</h4>
                    <ol>
                        <li><strong>Partition:</strong> Divide parameters into blocks θ = (θ₁, θ₂, ..., θₖ)</li>
                        <li><strong>Initialize:</strong> Set initial values for all blocks</li>
                        <li><strong>Sample Block 1:</strong> θ₁⁽ᵗ⁺¹⁾ ~ p(θ₁|θ₂⁽ᵗ⁾, ..., θₖ⁽ᵗ⁾, y)</li>
                        <li><strong>Sample Block 2:</strong> θ₂⁽ᵗ⁺¹⁾ ~ p(θ₂|θ₁⁽ᵗ⁺¹⁾, θ₃⁽ᵗ⁾, ..., θₖ⁽ᵗ⁾, y)</li>
                        <li><strong>Continue:</strong> Sample remaining blocks in sequence</li>
                        <li><strong>Repeat:</strong> Complete one cycle, return to step 3</li>
                    </ol>
                    <p><strong>Key Parameters:</strong> Block structure, sampling order, convergence criteria</p>
                </div>
            `
        };
        return processes[category] || '<p>Process not available.</p>';
    }

    getMCMCExamples(category, algorithms) {
        const examples = {
            'non-adaptive-metropolis-hastings': `
                <div class="example-code">
                    <h4>Random-walk Metropolis-Hastings</h4>
                    <pre><code># Using MCMCpack
library(MCMCpack)
result <- MCMCmetrop1R(function(x) dnorm(x, 0, 1), 
                       theta.init = 0, 
                       V = 1, 
                       mcmc = 10000)</code></pre>
                    
                    <h4>Independence Metropolis-Hastings</h4>
                    <pre><code># Using MCMCpack
result <- MCMCmetrop1R(function(x) dnorm(x, 0, 1), 
                       theta.init = 0, 
                       V = 1, 
                       mcmc = 10000,
                       method = "IndMH")</code></pre>
                </div>
            `,
            'adaptive-metropolis-hastings': `
                <div class="example-code">
                    <h4>Adaptive Metropolis (AM)</h4>
                    <pre><code># Using MCMCpack
result <- MCMCmetrop1R(function(x) dnorm(x, 0, 1), 
                       theta.init = 0, 
                       V = 1, 
                       mcmc = 10000,
                       adaptive = TRUE)</code></pre>
                    
                    <h4>Robust Adaptive Metropolis (RAM)</h4>
                    <pre><code># Using BayesianTools
library(BayesianTools)
setup <- createBayesianSetup(likelihood = function(x) dnorm(x, 0, 1),
                            prior = createUniformPrior(-10, 10))
result <- runMCMC(setup, sampler = "AM", iterations = 10000)</code></pre>
                </div>
            `,
            'population-based-algorithms': `
                <div class="example-code">
                    <h4>Parallel Tempering</h4>
                    <pre><code># Using MCMCpack
result <- MCMCmetrop1R(function(x) dnorm(x, 0, 1), 
                       theta.init = 0, 
                       V = 1, 
                       mcmc = 10000,
                       method = "PT")</code></pre>
                    
                    <h4>Differential Evolution MCMC</h4>
                    <pre><code># Using BayesianTools
library(BayesianTools)
setup <- createBayesianSetup(likelihood = function(x) dnorm(x, 0, 1),
                            prior = createUniformPrior(-10, 10))
result <- runMCMC(setup, sampler = "DE", iterations = 10000)</code></pre>
                </div>
            `,
            'sequential-algorithms': `
                <div class="example-code">
                    <h4>Bootstrap Particle Filter</h4>
                    <pre><code># Using dust2
library(dust2)
# Define state space model
model <- dust2::dust_example("sir")
# Run particle filter
result <- model$run(pars = list(), n_particles = 1000)</code></pre>
                    
                    <h4>Auxiliary Particle Filter</h4>
                    <pre><code># Using dust2
result <- model$run(pars = list(), 
                   n_particles = 1000,
                   filter = "auxiliary")</code></pre>
                </div>
            `,
            'hamiltonian-monte-carlo': `
                <div class="example-code">
                    <h4>No-U-Turn Sampler (NUTS)</h4>
                    <pre><code># Using rstanarm
library(rstanarm)
model <- stan_glm(y ~ x, data = data, 
                  family = gaussian(),
                  chains = 4, iter = 2000)</code></pre>
                    
                    <h4>Riemannian Manifold HMC</h4>
                    <pre><code># Using rstanarm
model <- stan_glm(y ~ x, data = data, 
                  family = gaussian(),
                  algorithm = "fullrank")</code></pre>
                </div>
            `,
            'gibbs-sampler': `
                <div class="example-code">
                    <h4>Gibbs Sampling</h4>
                    <pre><code># Using MCMCglmm
library(MCMCglmm)
model <- MCMCglmm(y ~ x, data = data,
                  family = "gaussian",
                  nitt = 10000, burnin = 1000)</code></pre>
                    
                    <h4>Block Gibbs Sampling</h4>
                    <pre><code># Using MCMCglmm
model <- MCMCglmm(y ~ x, data = data,
                  family = "gaussian",
                  nitt = 10000, burnin = 1000,
                  block = TRUE)</code></pre>
                </div>
            `
        };
        return examples[category] || '<p>Examples not available.</p>';
    }

    getMCMCLogo(category) {
        const logos = {
            'non-adaptive-metropolis-hastings': `
                <div class="mcmc-logo-icon">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="#2c2c2c" stroke-width="2"/>
                        <path d="M8 20 L16 12 L24 20 L32 12" stroke="#2c2c2c" stroke-width="2" fill="none"/>
                        <circle cx="8" cy="20" r="3" fill="#2c2c2c"/>
                        <circle cx="16" cy="12" r="3" fill="#2c2c2c"/>
                        <circle cx="24" cy="20" r="3" fill="#2c2c2c"/>
                        <circle cx="32" cy="12" r="3" fill="#2c2c2c"/>
                    </svg>
                </div>
            `,
            'adaptive-metropolis-hastings': `
                <div class="mcmc-logo-icon">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="#2c2c2c" stroke-width="2"/>
                        <path d="M8 20 Q20 8 32 20" stroke="#2c2c2c" stroke-width="2" fill="none"/>
                        <circle cx="8" cy="20" r="3" fill="#2c2c2c"/>
                        <circle cx="20" cy="8" r="3" fill="#2c2c2c"/>
                        <circle cx="32" cy="20" r="3" fill="#2c2c2c"/>
                        <text x="20" y="35" text-anchor="middle" font-size="8" fill="#2c2c2c">AM</text>
                    </svg>
                </div>
            `,
            'population-based-algorithms': `
                <div class="mcmc-logo-icon">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="#2c2c2c" stroke-width="2"/>
                        <circle cx="12" cy="12" r="2" fill="#2c2c2c"/>
                        <circle cx="28" cy="12" r="2" fill="#2c2c2c"/>
                        <circle cx="12" cy="28" r="2" fill="#2c2c2c"/>
                        <circle cx="28" cy="28" r="2" fill="#2c2c2c"/>
                        <circle cx="20" cy="20" r="3" fill="#2c2c2c"/>
                        <path d="M12 12 L20 20 M28 12 L20 20 M12 28 L20 20 M28 28 L20 20" stroke="#2c2c2c" stroke-width="1"/>
                    </svg>
                </div>
            `,
            'sequential-algorithms': `
                <div class="mcmc-logo-icon">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="#2c2c2c" stroke-width="2"/>
                        <rect x="8" y="15" width="4" height="10" fill="#2c2c2c"/>
                        <rect x="14" y="12" width="4" height="16" fill="#2c2c2c"/>
                        <rect x="20" y="10" width="4" height="20" fill="#2c2c2c"/>
                        <rect x="26" y="13" width="4" height="14" fill="#2c2c2c"/>
                        <text x="20" y="35" text-anchor="middle" font-size="6" fill="#2c2c2c">PF</text>
                    </svg>
                </div>
            `,
            'hamiltonian-monte-carlo': `
                <div class="mcmc-logo-icon">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="#2c2c2c" stroke-width="2"/>
                        <path d="M8 20 Q20 8 32 20 Q20 32 8 20" stroke="#2c2c2c" stroke-width="2" fill="none"/>
                        <circle cx="8" cy="20" r="3" fill="#2c2c2c"/>
                        <circle cx="32" cy="20" r="3" fill="#2c2c2c"/>
                        <text x="20" y="35" text-anchor="middle" font-size="8" fill="#2c2c2c">HMC</text>
                    </svg>
                </div>
            `,
            'gibbs-sampler': `
                <div class="mcmc-logo-icon">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="#2c2c2c" stroke-width="2"/>
                        <rect x="10" y="10" width="20" height="20" fill="none" stroke="#2c2c2c" stroke-width="2"/>
                        <rect x="15" y="15" width="10" height="10" fill="#2c2c2c"/>
                        <text x="20" y="35" text-anchor="middle" font-size="8" fill="#2c2c2c">GS</text>
                    </svg>
                </div>
            `
        };
        return logos[category] || '<div class="mcmc-logo-icon">?</div>';
    }

    toggleDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        const arrow = dropdown.previousElementSibling.querySelector('.dropdown-arrow');
        
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
        } else {
            dropdown.style.display = 'block';
            arrow.style.transform = 'rotate(180deg)';
        }
    }

    createAlgorithmCard(algorithm) {
        // Create package links
        const packageLinks = algorithm.packages.map(pkg => `
            <div class="algorithm-package-link">
                <a href="https://cran.r-project.org/package=${pkg.name}" target="_blank" class="algorithm-package-name">${pkg.name}</a>
                <span class="algorithm-package-function">${pkg.function}</span>
                <span class="algorithm-package-description">${pkg.description}</span>
            </div>
        `).join('');
        
        return `
            <div class="algorithm-card">
                <h3 class="algorithm-name">${algorithm.name}</h3>
                <p class="algorithm-description">${algorithm.description}</p>
                <div class="algorithm-packages">
                    <h5 class="packages-heading">Available in:</h5>
                    ${packageLinks}
                </div>
            </div>
        `;
    }

    renderPackages() {
        const grid = document.getElementById('packages-grid');
        if (!grid) return;

        grid.innerHTML = this.packages.map(pkg => this.createPackageCard(pkg)).join('');
    }

    createPackageCard(pkg) {
        const algorithmCount = this.algorithms.filter(a => a.package === pkg.name).length;
        
        return `
            <div class="package-card">
                <h3 class="package-name">${pkg.name}</h3>
                <p class="package-version">v${pkg.version}</p>
                <p class="package-description">${pkg.description}</p>
                <div class="package-stats">
                    <div class="package-stat">
                        <strong>${algorithmCount}</strong>
                        <span>Algorithms</span>
                    </div>
                    <div class="package-stat">
                        <strong>${pkg.categories.length}</strong>
                        <span>Categories</span>
                    </div>
                </div>
                <div class="package-actions">
                    <a href="${pkg.cran_url}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-download"></i> Install
                    </a>
                    <a href="${pkg.documentation_url}" target="_blank" class="btn btn-outline">
                        <i class="fas fa-book"></i> Docs
                    </a>
                </div>
            </div>
        `;
    }

    showAlgorithmDetails(algorithmId) {
        const algorithm = this.algorithms.find(a => a.id === algorithmId);
        if (!algorithm) return;

        // Create modal or detailed view
        const modal = this.createModal(`
            <h2>${algorithm.name}</h2>
            <div class="algorithm-details">
                <div class="detail-section">
                    <h3>Description</h3>
                    <p>${algorithm.long_description || algorithm.description}</p>
                </div>
                <div class="detail-section">
                    <h3>Package</h3>
                    <p><strong>${algorithm.package}</strong> - ${algorithm.function_name}</p>
                </div>
                <div class="detail-section">
                    <h3>Complexity</h3>
                    <span class="algorithm-complexity complexity-${algorithm.complexity}">${this.capitalizeFirst(algorithm.complexity)}</span>
                </div>
                <div class="detail-section">
                    <h3>Parameters</h3>
                    <ul>
                        ${algorithm.parameters.map(param => `
                            <li><strong>${param.name}</strong> (${param.type}): ${param.description}</li>
                        `).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h3>Advantages</h3>
                    <ul>
                        ${algorithm.pros.map(pro => `<li>${pro}</li>`).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h3>Limitations</h3>
                    <ul>
                        ${algorithm.cons.map(con => `<li>${con}</li>`).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h3>Use Cases</h3>
                    <ul>
                        ${algorithm.use_cases.map(use => `<li>${use}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    }

    showExampleCode(algorithmId) {
        const algorithm = this.algorithms.find(a => a.id === algorithmId);
        if (!algorithm) return;

        const modal = this.createModal(`
            <h2>${algorithm.name} - Example Code</h2>
            <div class="code-example">
                <pre><code>${algorithm.example_code}</code></pre>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="navigator.clipboard.writeText(\`${algorithm.example_code}\`)">
                    <i class="fas fa-copy"></i> Copy Code
                </button>
            </div>
        `);
        
        document.body.appendChild(modal);
    }

    createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                ${content}
            </div>
        `;
        return modal;
    }

    showContributeForm(type) {
        const form = document.getElementById('contribute-form');
        const formTitle = document.getElementById('form-title');
        const formContent = document.getElementById('form-content');
        
        if (type === 'algorithm') {
            formTitle.textContent = 'Add New Algorithm';
            formContent.innerHTML = this.getAlgorithmFormHTML();
        } else if (type === 'package') {
            formTitle.textContent = 'Add New Package';
            formContent.innerHTML = this.getPackageFormHTML();
        } else if (type === 'algorithm-package') {
            formTitle.textContent = 'Add Algorithm + Package';
            formContent.innerHTML = this.getAlgorithmPackageFormHTML();
        } else if (type === 'issue') {
            formTitle.textContent = 'Report Issue';
            formContent.innerHTML = this.getIssueFormHTML();
        }
        
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }

    hideContributeForm() {
        document.getElementById('contribute-form').style.display = 'none';
    }

    getAlgorithmFormHTML() {
        return `
            <div class="form-group">
                <label for="alg-name">Algorithm Name *</label>
                <input type="text" id="alg-name" name="name" required>
            </div>
            <div class="form-group">
                <label for="alg-category">Category *</label>
                <select id="alg-category" name="category" required>
                    <option value="">Select Category</option>
                    <option value="standard">Standard</option>
                    <option value="hmc">HMC</option>
                    <option value="parallel">Parallel</option>
                    <option value="mixed">Mixed</option>
                    <option value="adaptive">Adaptive</option>
                    <option value="specialized">Specialized</option>
                </select>
            </div>
            <div class="form-group">
                <label for="alg-description">Description *</label>
                <textarea id="alg-description" name="description" required></textarea>
            </div>
            <div class="form-group">
                <label for="alg-package">R Package *</label>
                <input type="text" id="alg-package" name="package" required>
            </div>
            <div class="form-group">
                <label for="alg-example">Example Code</label>
                <textarea id="alg-example" name="example_code" rows="10"></textarea>
            </div>
            <div class="form-group">
                <label for="alg-contributor">Your Name *</label>
                <input type="text" id="alg-contributor" name="contributor" required>
            </div>
        `;
    }

    getPackageFormHTML() {
        return `
            <div class="form-group">
                <label for="pkg-name">Package Name *</label>
                <input type="text" id="pkg-name" name="name" required>
            </div>
            <div class="form-group">
                <label for="pkg-version">Version *</label>
                <input type="text" id="pkg-version" name="version" required>
            </div>
            <div class="form-group">
                <label for="pkg-description">Description *</label>
                <textarea id="pkg-description" name="description" required></textarea>
            </div>
            <div class="form-group">
                <label for="pkg-maintainer">Maintainer *</label>
                <input type="text" id="pkg-maintainer" name="maintainer" required>
            </div>
            <div class="form-group">
                <label for="pkg-cran-url">CRAN URL</label>
                <input type="url" id="pkg-cran-url" name="cran_url">
            </div>
            <div class="form-group">
                <label for="pkg-github-url">GitHub URL</label>
                <input type="url" id="pkg-github-url" name="github_url">
            </div>
            <div class="form-group">
                <label for="pkg-contributor">Your Name *</label>
                <input type="text" id="pkg-contributor" name="contributor" required>
            </div>
        `;
    }

    getAlgorithmPackageFormHTML() {
        return `
            <div class="form-section">
                <h4>Algorithm Information</h4>
                <div class="form-group">
                    <label for="alg-name">Algorithm Name *</label>
                    <input type="text" id="alg-name" name="alg_name" required>
                </div>
                <div class="form-group">
                    <label for="alg-category">Category *</label>
                    <select id="alg-category" name="alg_category" required>
                        <option value="">Select Category</option>
                        <option value="metropolis-hastings">Metropolis Hastings</option>
                        <option value="gibbs-sampler">Gibbs Sampler</option>
                        <option value="hmc">HMC</option>
                        <option value="parallel-tempering">Parallel Tempering</option>
                        <option value="particle-filters">Particle Filters</option>
                        <option value="differential-evolution">Differential Evolution</option>
                        <option value="t-walk">T-walk</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="alg-description">Algorithm Description *</label>
                    <textarea id="alg-description" name="alg_description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="alg-example">Example Code</label>
                    <textarea id="alg-example" name="alg_example" rows="8"></textarea>
                </div>
            </div>
            
            <div class="form-section">
                <h4>Package Information</h4>
                <div class="form-group">
                    <label for="pkg-name">Package Name *</label>
                    <input type="text" id="pkg-name" name="pkg_name" required>
                </div>
                <div class="form-group">
                    <label for="pkg-version">Version *</label>
                    <input type="text" id="pkg-version" name="pkg_version" required>
                </div>
                <div class="form-group">
                    <label for="pkg-description">Package Description *</label>
                    <textarea id="pkg-description" name="pkg_description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="pkg-maintainer">Maintainer *</label>
                    <input type="text" id="pkg-maintainer" name="pkg_maintainer" required>
                </div>
                <div class="form-group">
                    <label for="pkg-cran-url">CRAN URL</label>
                    <input type="url" id="pkg-cran-url" name="pkg_cran_url">
                </div>
                <div class="form-group">
                    <label for="pkg-github-url">GitHub URL</label>
                    <input type="url" id="pkg-github-url" name="pkg_github_url">
                </div>
            </div>
            
            <div class="form-section">
                <h4>Your Information</h4>
                <div class="form-group">
                    <label for="contributor">Your Name *</label>
                    <input type="text" id="contributor" name="contributor" required>
                </div>
            </div>
        `;
    }

    getIssueFormHTML() {
        return `
            <div class="form-group">
                <label for="issue-type">Issue Type *</label>
                <select id="issue-type" name="type" required>
                    <option value="">Select Type</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="improvement">Improvement</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="issue-title">Title *</label>
                <input type="text" id="issue-title" name="title" required>
            </div>
            <div class="form-group">
                <label for="issue-description">Description *</label>
                <textarea id="issue-description" name="description" required></textarea>
            </div>
            <div class="form-group">
                <label for="issue-reporter">Your Name *</label>
                <input type="text" id="issue-reporter" name="reporter" required>
            </div>
        `;
    }

    async handleContribution(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Determine contribution type from the form
        const contributionType = this.getContributionType();
        
        try {
            // Create pull request via GitHub API
            const prUrl = await this.createPullRequest(data, contributionType);
            
            // Show success message with PR link
            this.showSuccessMessage(prUrl, contributionType);
            this.hideContributeForm();
            e.target.reset();
            
        } catch (error) {
            console.error('Error creating pull request:', error);
            this.showErrorMessage('Failed to create pull request. Please try again or contact us directly.');
        }
    }

    getContributionType() {
        const formTitle = document.getElementById('form-title').textContent;
        if (formTitle.includes('Algorithm + Package')) return 'algorithm-package';
        if (formTitle.includes('Algorithm')) return 'algorithm';
        if (formTitle.includes('Package')) return 'package';
        if (formTitle.includes('Issue')) return 'issue';
        return 'unknown';
    }

    async createPullRequest(data, type) {
        // Create a unique branch name
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const branchName = `${type}-contribution-${timestamp}`;
        
        // Prepare the contribution data
        const contributionData = this.prepareContributionData(data, type);
        
        // Create the pull request
        const prData = {
            title: `Add ${type}: ${data.name || data.title}`,
            body: this.createPullRequestBody(contributionData, type),
            head: branchName,
            base: 'main',
            maintainer_can_modify: true
        };

        // For now, we'll create a GitHub issue instead of a full PR workflow
        // In a real implementation, you'd use GitHub's API to create a fork and PR
        const issueData = {
            title: `[${type.toUpperCase()}] ${data.name || data.title}`,
            body: this.createIssueBody(contributionData, type),
            labels: ['contribution', type]
        };

        // Simulate API call (replace with actual GitHub API call)
        const response = await this.simulateGitHubAPI(issueData);
        return response.html_url;
    }

    prepareContributionData(data, type) {
        if (type === 'algorithm') {
            return {
                id: data.name.toLowerCase().replace(/\s+/g, '-'),
                name: data.name,
                category: data.category,
                description: data.description,
                packages: [{
                    name: data.package,
                    function: data.function_name || 'main_function',
                    description: 'User-contributed implementation'
                }],
                example_code: data.example_code,
                contributor: data.contributor,
                date_added: new Date().toISOString().split('T')[0]
            };
        } else if (type === 'package') {
            return {
                id: data.name.toLowerCase(),
                name: data.name,
                version: data.version,
                description: data.description,
                maintainer: data.maintainer,
                cran_url: data.cran_url,
                github_url: data.github_url,
                contributor: data.contributor,
                date_added: new Date().toISOString().split('T')[0]
            };
        } else if (type === 'algorithm-package') {
            return {
                algorithm: {
                    id: data.alg_name.toLowerCase().replace(/\s+/g, '-'),
                    name: data.alg_name,
                    category: data.alg_category,
                    description: data.alg_description,
                    packages: [{
                        name: data.pkg_name,
                        function: 'main_function',
                        description: 'User-contributed implementation'
                    }],
                    example_code: data.alg_example,
                    contributor: data.contributor,
                    date_added: new Date().toISOString().split('T')[0]
                },
                package: {
                    id: data.pkg_name.toLowerCase(),
                    name: data.pkg_name,
                    version: data.pkg_version,
                    description: data.pkg_description,
                    maintainer: data.pkg_maintainer,
                    cran_url: data.pkg_cran_url,
                    github_url: data.pkg_github_url,
                    contributor: data.contributor,
                    date_added: new Date().toISOString().split('T')[0]
                }
            };
        }
        return data;
    }

    createPullRequestBody(contributionData, type) {
        const filePath = type === 'algorithm' ? 'data/algorithms.json' : 'data/packages.json';
        
        return `## ${type.charAt(0).toUpperCase() + type.slice(1)} Contribution

**Contributor:** ${contributionData.contributor}
**Date:** ${contributionData.date_added}

### Details
${JSON.stringify(contributionData, null, 2)}

### Files to modify
- \`${filePath}\`

### Review checklist
- [ ] Data format follows schema
- [ ] All required fields present
- [ ] Package/algorithm information is accurate
- [ ] Example code is valid (if provided)
- [ ] Links are working
- [ ] No duplicate entries

Please review this contribution and merge if approved.`;
    }

    createIssueBody(contributionData, type) {
        return `## ${type.charAt(0).toUpperCase() + type.slice(1)} Contribution

**Contributor:** ${contributionData.contributor}
**Date:** ${contributionData.date_added}

### Contribution Details
\`\`\`json
${JSON.stringify(contributionData, null, 2)}
\`\`\`

### Review Process
This contribution will be reviewed and added to the MCMC Atlas if approved.

### Files to modify
- \`data/${type}s.json\`

### Review checklist
- [ ] Data format follows schema
- [ ] All required fields present
- [ ] Package/algorithm information is accurate
- [ ] Example code is valid (if provided)
- [ ] Links are working
- [ ] No duplicate entries

Thank you for contributing to the MCMC Atlas! 🎉`;
    }

    async simulateGitHubAPI(issueData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock response (replace with actual GitHub API call)
        return {
            html_url: `https://github.com/mcmcatlas/mcmcatlas/issues/new?title=${encodeURIComponent(issueData.title)}&body=${encodeURIComponent(issueData.body)}&labels=${issueData.labels.join(',')}`
        };
    }

    showSuccessMessage(prUrl, type) {
        const message = `
            <div class="success-message">
                <h3>🎉 Contribution Submitted Successfully!</h3>
                <p>Thank you for contributing to the MCMC Atlas!</p>
                <p>Your ${type} contribution has been submitted for review.</p>
                <div class="success-actions">
                    <a href="${prUrl}" target="_blank" class="btn btn-primary">
                        <i class="fab fa-github"></i> View Submission
                    </a>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'modal';
        messageDiv.innerHTML = `
            <div class="modal-content">
                ${message}
            </div>
        `;
        
        document.body.appendChild(messageDiv);
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>❌ Error</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Close
                </button>
            </div>
        `;
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f8d7da;
            color: #721c24;
            padding: 2rem;
            border-radius: 10px;
            z-index: 1000;
            max-width: 400px;
            text-align: center;
        `;
        document.body.appendChild(errorDiv);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Global functions for onclick handlers
window.showContributeForm = (type) => {
    if (window.atlas) {
        window.atlas.showContributeForm(type);
    }
};

window.hideContributeForm = () => {
    if (window.atlas) {
        window.atlas.hideContributeForm();
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.atlas = new MCMCAtlas();
});

// Add modal styles
const modalStyles = `
    .modal {
        display: block;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }
    
    .modal-content {
        background-color: white;
        margin: 5% auto;
        padding: 2rem;
        border-radius: 10px;
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    }
    
    .modal-close {
        position: absolute;
        right: 1rem;
        top: 1rem;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
    }
    
    .modal-close:hover {
        color: #333;
    }
    
    .algorithm-details {
        margin-top: 1rem;
    }
    
    .detail-section {
        margin-bottom: 1.5rem;
    }
    
    .detail-section h3 {
        color: #667eea;
        margin-bottom: 0.5rem;
    }
    
    .code-example {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 5px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .code-example pre {
        margin: 0;
        overflow-x: auto;
    }
    
    .code-example code {
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
    }
    
    .modal-actions {
        margin-top: 1rem;
        text-align: right;
    }
    
    .no-results {
        text-align: center;
        padding: 2rem;
        color: #666;
        font-style: italic;
    }
    
    .tag {
        display: inline-block;
        background: #e9ecef;
        color: #495057;
        padding: 0.25rem 0.5rem;
        border-radius: 10px;
        font-size: 0.8rem;
        margin: 0.25rem 0.25rem 0.25rem 0;
    }
    
    .algorithm-tags {
        margin: 1rem 0;
    }
    
    .package-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
    }
`;

// Add modal styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);
