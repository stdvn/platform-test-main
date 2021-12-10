import * as canvas from 'canvas';

function getImageDimensions(imageUrl) {
    return new Promise((resolve, reject)=> {
        const image = new canvas.Image();
        image.onload = () => {
            resolve({
                height: image.height,
                width: image.width,
            });
        };
        image.onerror = () => {
            reject('Image not found : ' + imageUrl);
        };
        image.src = imageUrl;
    });
}

module.exports = { getImageDimensions }