# MCMC Atlas

A comprehensive guide to Markov Chain Monte Carlo algorithms available in R packages.

## 🚧 Work in Progress

This atlas is actively being developed and expanded. We're continuously adding new algorithms, packages, and features.

## 🌐 Live Site

The MCMC Atlas is deployed on GitHub Pages: [https://dchodge.github.io/Rmcmcatlas](https://dchodge.github.io/rmcmcatlas/)

## 📋 Features

- **Algorithm Categories**: Organised by MCMC type (Non-adaptive MH, Adaptive MH, Population-based, Sequential, HMC, Gibbs)
- **Package Information**: Links to CRAN packages with function details
- 
- **Educational Content**: Explanations and process steps for each algorithm type
- **Contribution System**: Submit new algorithms and packages for review
- **Posterior Analysis Tools**: Resources for MCMC output analysis

## 🛠️ Local Development

To run the MCMC Atlas locally:

```bash
# Clone the repository
git clone https://dchodge.github.io/rmcmcatlas.git
cd Rmcmcatlas

# Start a local server (Python 3)
python3 -m http.server 8080

# Or using Node.js
npx serve .

# Or using PHP
php -S localhost:8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

## 📁 Project Structure

```
Rmcmcatlas/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   └── js/
│       └── app.js          # JavaScript functionality
├── data/
│   ├── algorithms.json     # Algorithm data
│   ├── packages.json       # Package data
│   └── schema.json         # Data schema
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment
└── README.md               # This file
```

## 🤝 Contributing

We welcome contributions! You can:

1. **Add New Algorithms**: Submit new MCMC algorithms with package information
2. **Add New Packages**: Suggest R packages that implement MCMC methods
3. **Improve Content**: Enhance explanations, add examples, or fix errors
4. **Report Issues**: Let us know about bugs or missing information

### How to Contribute

1. Fork the repository
2. Make your changes
3. Test locally
4. Submit a pull request

## 📊 Data Format

The atlas uses JSON files to store algorithm and package information:

- `data/algorithms.json`: Contains algorithm definitions, descriptions, and package links
- `data/packages.json`: Contains package information, descriptions, and links
- `data/schema.json`: Defines the data structure

## 🚀 Deployment

The site is automatically deployed to GitHub Pages using GitHub Actions. The workflow:

1. Triggers on pushes to main/master branch
2. Builds the static site
3. Deploys to GitHub Pages

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- R community for the amazing MCMC packages
- Contributors who help maintain and expand the atlas
- GitHub for hosting and GitHub Pages

## 📞 Contact

For questions or suggestions, please open an issue on GitHub.
