// Dynamically import images from the gallery folder
const imageModules = import.meta.glob<{ default: string }>(
  '../../public/gallery/*.{jpg,jpeg,png,gif}',
  { eager: true }
);

export const galleryImages: Record<string, string> = {};

Object.entries(imageModules).forEach(([path, module]) => {
  const filename = path.split('/').pop() || '';
  galleryImages[filename] = module.default;
});

export function getImageUrl(filename: string): string {
  return galleryImages[filename] || '';
}
