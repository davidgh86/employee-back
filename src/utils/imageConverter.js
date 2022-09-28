const sharp = require('sharp');
const Jimp = require('jimp')

async function convert(data) {

    const uri = data.split(';base64,').pop()
    let imgBuffer = Buffer.from(uri, 'base64');
    const u8 = await sharp(imgBuffer)
        .avif({ lossless: true })
        .toBuffer()
    return 'data:image/avif;base64,'+Buffer.from(u8).toString('base64')
}

module.exports = convert