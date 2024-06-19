export function getImage(img: string) {
  const image = new Image();
  image.src = img;
  return image;
}
