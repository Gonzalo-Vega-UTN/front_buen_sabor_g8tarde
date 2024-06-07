import { Base } from "./Base";

export class Imagen extends Base {
    imagePath: string;

    constructor(imageFileName: string) {
        super();
        this.imagePath = `assets/images/${imageFileName}`;
    }
}
