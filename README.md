# LogAnalysisAssignment


## Description

LogAnalysisAssignment is a command-line application that analyzes log file. The tool extracts valuable information from the log, including endpoint call counts, API calls per minute, and API calls grouped by HTTP status codes. This tool is designed to help developers and administrators gain insights into the API's usage patterns and identify potential issues or bottlenecks.

## Features

- **Endpoint Call Counts:** View the number of times each API endpoint was called.
- **API Calls per Minute:** Analyze the API traffic based on the number of calls made per minute.
- **API Calls by HTTP Status Code:** Get a breakdown of API calls categorized by HTTP status codes.

## Installation

1. Clone the repository: `git clone https://github.com/aditisaran26/LogAnalysisAssignment.git`
2. Navigate to the project directory: `cd LogAnalysisAssignment`
3. Install dependencies: `npm install`

## Usage

1. Ensure you have Node.js installed on your system.
2. Run the log analysis tool by providing the path to the log file as a command-line argument:
   `node log_analysis.js path_to_log_file`
 example      **node log_analysis.js prod-api-prod-out.log**

