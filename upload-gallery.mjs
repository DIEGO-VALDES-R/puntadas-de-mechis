import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GALLERY_DIR = path.join(__dirname, 'client', 'public', 'gallery');
const API_URL = process.env.BUILT_IN_FORGE_API_URL || 'https://api.manus.im';
const API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!API_KEY) {
  console.error('Error: BUILT_IN_FORGE_API_KEY environment variable is not set');
  process.exit(1);
}

async function uploadImage(filePath, fileName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType });
    formData.append('file', blob, fileName);
    
    const response = await fetch(`${API_URL}/storage/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✓ Uploaded: ${fileName} -> ${data.url}`);
    return data.url;
  } catch (error) {
    console.error(`✗ Failed to upload ${fileName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Starting gallery upload to S3...\n');
  
  const files = fs.readdirSync(GALLERY_DIR).filter(f => 
    f.endsWith('.jpg') || f.endsWith('.png')
  );
  
  const urls = {};
  
  for (const file of files) {
    const filePath = path.join(GALLERY_DIR, file);
    const url = await uploadImage(filePath, `gallery/${file}`);
    if (url) {
      urls[file] = url;
    }
  }
  
  console.log('\n\nGallery URLs:');
  console.log(JSON.stringify(urls, null, 2));
  
  // Save URLs to a file for reference
  fs.writeFileSync(
    path.join(__dirname, 'gallery-urls.json'),
    JSON.stringify(urls, null, 2)
  );
  
  console.log('\nURLs saved to gallery-urls.json');
}

main().catch(console.error);
