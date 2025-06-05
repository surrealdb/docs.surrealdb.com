import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all markdown files in the labs-items directory
const labsItemsDir = path.join(__dirname, '../src/content/labs-items');
const mdFiles = fs.readdirSync(labsItemsDir).filter(file => file.endsWith('.md'));

console.log(`Found ${mdFiles.length} markdown files in ${labsItemsDir}`);

// Process each file
for (const file of mdFiles) {
  const filePath = path.join(labsItemsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`Checking file: ${file}`);
  
  // Check if the content is missing the closing frontmatter delimiter
  // The content should start with --- and have at least one more --- somewhere
  const openingDelimiter = content.indexOf('---');
  const closingDelimiter = content.indexOf('---', openingDelimiter + 3);
  
  if (closingDelimiter === -1 && openingDelimiter === 0) {
    console.log(`Fixing missing closing frontmatter in ${file}`);
    
    // If we have topics that were added, make sure the closing delimiter comes after
    if (content.includes('topics:')) {
      const lines = content.split('\n');
      let topicsIndex = -1;
      
      // Find the topics line or last line of topics array
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('topics:')) {
          topicsIndex = i;
          
          // If topics is an array, find the last item
          if (lines[i].includes('[')) {
            // Empty array case
            if (lines[i].includes('[]')) {
              // No need to look further
            } else {
              // Find closing bracket
              for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].includes(']')) {
                  topicsIndex = j;
                  break;
                }
              }
            }
          } else {
            // If topics is a list format, find the last item
            if (i + 1 < lines.length && lines[i + 1].trim().startsWith('- ')) {
              for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].trim().startsWith('- ')) {
                  topicsIndex = j;
                } else if (!lines[j].trim().startsWith('  ')) {
                  break; // Not part of the list anymore
                }
              }
            }
          }
          break;
        }
      }
      
      // Add the closing delimiter after the topics section
      if (topicsIndex >= 0) {
        lines.splice(topicsIndex + 1, 0, '---');
        content = lines.join('\n');
      } else {
        // If somehow we can't find topics, just add it to the end
        content += '\n---\n';
      }
    } else {
      // No topics, just add the closing delimiter at the end
      content += '\n---\n';
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Fixed file: ${file}`);
  } else {
    console.log(`  File is fine: ${file}`);
  }
}

console.log('Fixed missing closing frontmatter tags!');
