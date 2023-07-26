const fs = require('fs');

// Function to parse log lines and extract required information
function parseLogLines(logFile) {
  const lines = logFile.split('\n');
  const endpointCounts = {};
  const statusCounts = {};

  for (const line of lines) {
    const match = line.match(/.*\[.*\] "(\w+) (.+?) HTTP\/1\.1" (\d+) .*/);

    if (match) {
      const [, method, endpoint, statusCode] = match;
      const timestamp = match[0].split('[')[1].split(']')[0];

      // Count endpoint calls
      if (!endpointCounts[endpoint]) {
        endpointCounts[endpoint] = 1;
      } else {
        endpointCounts[endpoint]++;
      }

      // Count status codes
      if (!statusCounts[statusCode]) {
        statusCounts[statusCode] = 1;
      } else {
        statusCounts[statusCode]++;
      }
    }
  }

  return { endpointCounts, statusCounts };
}

function timestampToMinute(timestamp) {
  const dateObj = new Date(timestamp);
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const hours = String(dateObj.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
  const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}`;
  return formattedTimestamp;
}

function groupCallsByMinute(logFile) {
  const lines = logFile.split('\n');
  const callsByMinute = {};

  for (const line of lines) {
    const timestampMatch = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
    if (timestampMatch) {
      const timestamp = timestampMatch[0];
      const minute = timestampToMinute(timestamp);

      if (!callsByMinute[minute]) {
        callsByMinute[minute] = 1;
      } else {
        callsByMinute[minute]++;
      }
    }
  }

  return callsByMinute;
}

function formatTable(data) {
  console.table(data);
}

function writeDataToFile(data, filename, columnHeaders) {
  let content = `${columnHeaders.join('\t')}\n`;

  if (Array.isArray(data)) {
    data.forEach((item) => {
      content += `${item.name}\t${item.statusCode}\t${item.count}\n`;
    });
  } else if (typeof data === 'object') {
    const dataArray = Object.entries(data).map(([name, { statusCode, count }]) => {
      return {
        name,
        statusCode,
        count,
      };
    });

    dataArray.forEach((item) => {
      content += `${item.name}\t${item.statusCode}\t${item.count}\n`;
    });
  }

  fs.writeFileSync(filename, content, 'utf-8');
}

function main(logFilePath) {
	try {
    const logFile = fs.readFileSync(logFilePath, 'utf-8');
    const { endpointCounts, statusCounts } = parseLogLines(logFile);
    const callsByMinute = groupCallsByMinute(logFile);

    console.log('Endpoint Call Counts:');
    formatTable(endpointCounts);

    console.log('\nAPI Calls per Minute:');
    formatTable(callsByMinute);

    console.log('\nAPI Calls by HTTP Status Code:');
    const statusData = Object.entries(statusCounts).map(([statusCode, count]) => {
      return {
        name: getStatusName(statusCode),
        statusCode,
        count,
      };
    });
    formatTable(statusData);

    // Write data to separate text files with column headers
    writeDataToFile(endpointCounts, 'endpoint_call_counts.txt', ['Endpoint', 'Call Count']);
    writeDataToFile(callsByMinute, 'api_calls_per_minute.txt', ['Minute', 'Call Count']);
    writeDataToFile(statusData, 'api_calls_by_status_code.txt', ['Status', 'Status Code', 'Call Count']);

    console.log('Log data dumped into text files.');
	catch (error) {
    console.error('Error occurred:', error.message);
  }
  
}

// Helper function to get the status name based on the status code (you can modify as needed)
function getStatusName(statusCode) {
  switch (statusCode) {
    case '200':
      return 'OK';
    case '206':
      return 'Partial Content';
    case '304':
      return 'Not Modified';
    case '400':
      return 'Bad Request';
    case '401':
      return 'Unauthorized';
    case '404':
      return 'Not Found';
    case '422':
      return 'Unprocessable Entity';
    case '500':
      return 'Server Error';
    default:
      return 'Unknown Status';
  }
}

const logFilePath = process.argv[2];

if (!logFilePath) {
  console.error('Error: Log file path not provided.');
  console.log('Usage: node log_analysis.js <log_file_path>');
} else {
  main(logFilePath);
}
