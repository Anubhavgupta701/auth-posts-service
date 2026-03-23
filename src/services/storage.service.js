const { ImageKit, toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadImage(buffer, fileName) {
    try {
        const file = await toFile(buffer, fileName);
        const result = await imagekit.files.upload({
            file,
            fileName
        });
        return { url: result.url, fileId: result.fileId };
    } catch (error) {
        console.error("Error in uploadImage:", error);
        throw error;
    }
}
module.exports = { uploadImage };