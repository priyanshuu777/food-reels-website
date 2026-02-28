//ye code cloud storage k liye hota hai agar hum imagekit ki jagah pr kisi aur service ka use krna chahte hai to ye code change ho jayega aur jo use krna chahte hai uska code lag jayega
const ImageKit = require("imagekit");
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file, fileName) {
    const result = await imagekit.upload({
        file: file,//required
        fileName: fileName,//required
    });
    return result;
}

module.exports = {
    uploadFile,
};