import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function uploadImages() {
  const galleryDir = path.join(__dirname, 'client/public/gallery');
  const files = fs.readdirSync(galleryDir);
  
  const imageUrls = {};
  
  for (const file of files) {
    const filePath = path.join(galleryDir, file);
    const fileContent = fs.readFileSync(filePath);
    
    try {
      const response = await fetch('https://api.manus.im/v1/storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
        body: fileContent,
      });
      
      if (response.ok) {
        const data = await response.json();
        imageUrls[file] = data.url;
        console.log(`✓ ${file}: ${data.url}`);
      } else {
        console.error(`✗ ${file}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error uploading ${file}:`, error.message);
    }
  }
  
  // Save URLs to a JSON file
  fs.writeFileSync(
    path.join(__dirname, 'image-urls.json'),
    JSON.stringify(imageUrls, null, 2)
  );
  
  console.log('\nImage URLs saved to image-urls.json');
}

uploadImages().catch(console.error);
