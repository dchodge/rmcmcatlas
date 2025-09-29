# MCMC Atlas API Documentation

This document describes the data structures and API used by the MCMC Atlas web application.

## Data Structure

### Algorithm Schema

```json
{
  "id": "string (required)",
  "name": "string (required)",
  "category": "string (required, enum: standard|hmc|parallel|mixed|adaptive|specialized)",
  "description": "string (required)",
  "long_description": "string (optional)",
  "package": "string (required)",
  "function_name": "string (optional)",
  "complexity": "string (required, enum: beginner|intermediate|advanced)",
  "parameters": [
    {
      "name": "string (required)",
      "type": "string (required)",
      "description": "string (required)",
      "required": "boolean (required)",
      "default": "string (optional)"
    }
  ],
  "example_code": "string (optional)",
  "references": [
    {
      "title": "string (required)",
      "authors": "string (required)",
      "journal": "string (optional)",
      "year": "integer (optional)",
      "doi": "string (optional)",
      "url": "string (optional)"
    }
  ],
  "tags": ["string array (optional)"],
  "pros": ["string array (optional)"],
  "cons": ["string array (optional)"],
  "use_cases": ["string array (optional)"],
  "contributor": "string (required)",
  "date_added": "string (required, ISO date)",
  "last_updated": "string (required, ISO date)"
}
```

### Package Schema

```json
{
  "id": "string (required)",
  "name": "string (required)",
  "version": "string (required)",
  "description": "string (required)",
  "long_description": "string (optional)",
  "maintainer": "string (required)",
  "authors": ["string array (optional)"],
  "url": "string (optional)",
  "cran_url": "string (optional)",
  "github_url": "string (optional)",
  "license": "string (optional)",
  "depends": ["string array (optional)"],
  "suggests": ["string array (optional)"],
  "algorithms": ["string array (optional)"],
  "categories": ["string array (optional)"],
  "installation": "string (optional)",
  "documentation_url": "string (optional)",
  "vignettes": [
    {
      "title": "string (required)",
      "url": "string (required)"
    }
  ],
  "contributor": "string (required)",
  "date_added": "string (required, ISO date)",
  "last_updated": "string (required, ISO date)"
}
```

## JavaScript API

### MCMCAtlas Class

The main application class that handles all functionality.

#### Methods

##### `constructor()`
Initializes the MCMC Atlas application.

##### `async init()`
Loads data and sets up the application.

##### `async loadData()`
Loads algorithm and package data from JSON files.

##### `showSection(sectionName)`
Shows the specified section and updates navigation.

**Parameters:**
- `sectionName` (string): Name of the section to show

##### `handleSearch(query)`
Filters algorithms based on search query.

**Parameters:**
- `query` (string): Search term

##### `applyFilters()`
Applies current filter settings to the algorithm list.

##### `renderAlgorithms(algorithms)`
Renders the algorithm cards in the grid.

**Parameters:**
- `algorithms` (array): Array of algorithm objects to render

##### `renderPackages()`
Renders the package cards in the grid.

##### `showAlgorithmDetails(algorithmId)`
Shows detailed information about a specific algorithm.

**Parameters:**
- `algorithmId` (string): ID of the algorithm to show

##### `showExampleCode(algorithmId)`
Shows example code for a specific algorithm.

**Parameters:**
- `algorithmId` (string): ID of the algorithm

##### `showContributeForm(type)`
Shows the contribution form for the specified type.

**Parameters:**
- `type` (string): Type of contribution (algorithm, package, issue)

##### `hideContributeForm()`
Hides the contribution form.

##### `handleContribution(e)`
Handles form submission for contributions.

**Parameters:**
- `e` (Event): Form submission event

## Data Files

### algorithms.json
Contains the complete database of MCMC algorithms. Each entry follows the algorithm schema.

### packages.json
Contains the complete database of R packages. Each entry follows the package schema.

### schema.json
Defines the JSON schemas for algorithms and packages.

## Filtering and Search

### Search Functionality
- Searches algorithm names, descriptions, packages, and tags
- Case-insensitive matching
- Real-time filtering as user types

### Filter Options
- **Category**: Filter by algorithm type
- **Package**: Filter by R package
- **Complexity**: Filter by difficulty level

### Filter Combinations
Multiple filters can be applied simultaneously. All active filters must match for an algorithm to be displayed.

## Contribution System

### Form Types

#### Algorithm Form
- Basic information (name, category, description)
- Package and function details
- Complexity level
- Example code
- Contributor information

#### Package Form
- Package metadata (name, version, maintainer)
- URLs (CRAN, GitHub, documentation)
- Contributor information

#### Issue Form
- Issue type (bug, feature, improvement)
- Title and description
- Reporter information

### Validation
- Required fields are validated on the client side
- JSON schema validation ensures data consistency
- Server-side validation (when implemented) provides additional security

## Browser Compatibility

### Required Features
- ES6+ JavaScript support
- CSS Grid and Flexbox
- Fetch API
- Local Storage (for future features)

### Supported Browsers
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Considerations

### Data Loading
- JSON files are loaded asynchronously
- Data is cached in memory after initial load
- Lazy loading for large datasets (future enhancement)

### Rendering
- Virtual scrolling for large lists (future enhancement)
- Debounced search to prevent excessive filtering
- Efficient DOM updates using document fragments

## Security

### Client-Side Security
- Input validation and sanitization
- XSS prevention through proper escaping
- No sensitive data stored in client-side code

### Future Server-Side Security
- CSRF protection for form submissions
- Rate limiting for contributions
- Content moderation system

## Extensibility

### Adding New Categories
1. Update the schema in `data/schema.json`
2. Add category to the enum in algorithm schema
3. Update filter options in JavaScript
4. Add category-specific styling if needed

### Adding New Fields
1. Update the schema in `data/schema.json`
2. Add field to existing entries in JSON files
3. Update form templates in JavaScript
4. Update rendering functions to display new fields

### Custom Styling
- CSS custom properties for easy theming
- Modular CSS structure
- Responsive design patterns
- Accessibility considerations

## Error Handling

### Data Loading Errors
- Graceful fallback when JSON files fail to load
- User-friendly error messages
- Retry mechanisms for network failures

### Form Validation Errors
- Real-time validation feedback
- Clear error messages
- Prevention of invalid submissions

### Browser Compatibility
- Feature detection for modern APIs
- Polyfills for older browsers (if needed)
- Graceful degradation for unsupported features
