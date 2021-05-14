const path = require("path");

const imagesHome = (req, res) => {
    return res.sendFile(path.join(`${__dirname}/../views/index.html`));
};

module.exports = {
    getHome: imagesHome
};
