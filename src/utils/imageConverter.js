const sharp = require('sharp');
const Jimp = require('jimp')

async function convert(data) {

    let imgBuffer = Buffer.from(data, 'utf-8');
    const u8 = await sharp(imgBuffer)
        .avif({ lossless: true })
        .toBuffer()
    return 'data:image/avif;base64,'+Buffer.from(u8).toString('base64')
}

module.exports = convert