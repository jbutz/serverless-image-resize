const pkg = require('./package.json');
const { URL } = require('url');
const {send, } = require('micro');
const Jimp = require('jimp');

module.exports = async function (req, res) {
    const url = new URL(`http://${req.headers.host}${req.url}`);

    const desiredWidth = Number(url.searchParams.get('w'));
    const desiredHeight = Number(url.searchParams.get('h'));
    const imageUrl = url.searchParams.get('i');

    // Without parameters redirect to the git repo for documentation
    if(!desiredHeight && !desiredWidth && !imageUrl) {
        res.setHeader('location', pkg.homepage);
        return send(res, 303);
    }

    const jimpImage = await Jimp.read(imageUrl);
    const imageBuffer = await jimpImage
        .scaleToFit(desiredWidth, desiredHeight)
        .getBufferAsync(Jimp.MIME_PNG);

    res.writeHead(200, {
        'Content-Length': Buffer.byteLength(imageBuffer),
        'Content-Type': 'image/png',
    });

    res.end(imageBuffer);
};