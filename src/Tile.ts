export default class Tile {
  public imageData: ImageData;

  public width: number;

  public height: number;

  constructor(imageData: ImageData, width: number, height: number) {
    this.imageData = imageData;
    this.width = width;
    this.height = height;
  }
}
