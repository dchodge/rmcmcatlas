# Contributing to the MCMC Atlas

Thank you for your interest in contributing to the MCMC Atlas! This document provides guidelines for contributing algorithms, packages, and improvements to the atlas.

## How to Contribute

### 1. Adding a New Algorithm

When adding a new MCMC algorithm to the atlas, please provide the following information:

#### Required Fields
- **Name**: The algorithm name (e.g., "Metropolis-Hastings")
- **Category**: One of: standard, hmc, parallel, mixed, adaptive, specialized
- **Description**: Brief description of what the algorithm does
- **Package**: The R package that contains this algorithm
- **Function Name**: The specific function name in the package
- **Complexity**: beginner, intermediate, or advanced

#### Optional but Recommended Fields
- **Long Description**: Detailed explanation of the algorithm
- **Parameters**: List of function parameters with types and descriptions
- **Example Code**: Working R code example
- **References**: Academic papers or books
- **Tags**: Keywords for searching
- **Pros/Cons**: Advantages and limitations
- **Use Cases**: When to use this algorithm

#### Example Algorithm Entry

```json
{
  "id": "my-algorithm",
  "name": "My Custom Algorithm",
  "category": "standard",
  "description": "A custom MCMC algorithm for specific use cases",
  "long_description": "Detailed description of how the algorithm works...",
  "package": "myPackage",
  "function_name": "my_mcmc",
  "complexity": "intermediate",
  "parameters": [
    {
      "name": "data",
      "type": "data.frame",
      "description": "Input data",
      "required": true
    }
  ],
  "example_code": "# Example usage\nresult <- my_mcmc(data = my_data, niter = 1000)",
  "references": [
    {
      "title": "My Algorithm Paper",
      "authors": "Author Name",
      "journal": "Journal Name",
      "year": 2024
    }
  ],
  "tags": ["custom", "mcmc", "sampling"],
  "pros": ["Fast convergence", "Easy to use"],
  "cons": ["Limited to specific models"],
  "use_cases": ["When you need fast sampling"],
  "contributor": "Your Name",
  "date_added": "2024-01-01"
}
```

### 2. Adding a New Package

When adding a new R package to the atlas:

#### Required Fields
- **Name**: Package name
- **Version**: Current version
- **Description**: Brief description
- **Maintainer**: Package maintainer
- **CRAN URL**: Link to CRAN page

#### Optional Fields
- **GitHub URL**: Repository link
- **Authors**: List of authors
- **Dependencies**: Required packages
- **Documentation**: Links to documentation
- **Vignettes**: Available tutorials

### 3. Improving Existing Entries

You can improve existing entries by:
- Adding missing information
- Updating outdated information
- Correcting errors
- Adding better examples
- Improving descriptions

## Submission Process

### Using the Web Interface

1. Visit the MCMC Atlas website
2. Click "Contribute" in the navigation
3. Select the appropriate form (Algorithm, Package, or Issue)
4. Fill out all required fields
5. Submit the form

### Direct JSON Submission

For more complex contributions, you can submit JSON files directly:

1. Fork the repository
2. Add your entry to the appropriate JSON file
3. Follow the existing format and schema
4. Submit a pull request

## Quality Guidelines

### Algorithm Descriptions
- Be clear and concise
- Use proper statistical terminology
- Include practical considerations
- Mention when NOT to use the algorithm

### Code Examples
- Use realistic, runnable code
- Include necessary library calls
- Add comments explaining key steps
- Test the code before submitting

### References
- Use proper academic citation format
- Include DOI when available
- Prefer peer-reviewed sources
- Include both original papers and accessible tutorials

## Review Process

All contributions are reviewed for:
- **Accuracy**: Correct information about algorithms and packages
- **Completeness**: All required fields filled
- **Clarity**: Clear and understandable descriptions
- **Format**: Proper JSON structure and formatting
- **Code Quality**: Working, well-commented examples

## Getting Help

If you need help contributing:

1. **Check existing entries** for examples of good contributions
2. **Read the schema** in `data/schema.json` for field definitions
3. **Ask questions** via the issue tracker
4. **Join discussions** in the community forum

## Recognition

Contributors are recognized in several ways:
- Name listed in the contributor field
- Acknowledgment in the README
- Contributor badge on the website
- Invitation to join the maintainer team for regular contributors

## Code of Conduct

Please follow these guidelines:
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and improve
- Follow academic standards for citations
- Respect intellectual property

## Technical Requirements

### JSON Format
- Use valid JSON syntax
- Follow the schema in `data/schema.json`
- Use consistent naming conventions
- Include all required fields

### Code Examples
- Use current R syntax
- Include necessary library calls
- Test examples before submission
- Follow R style guidelines

### Documentation
- Use clear, professional language
- Include proper citations
- Follow academic writing standards
- Be accessible to different skill levels

## Questions?

If you have questions about contributing:
- Check the FAQ in the documentation
- Open an issue on GitHub
- Contact the maintainers
- Join the community discussions

Thank you for helping make the MCMC Atlas a valuable resource for the R community!
