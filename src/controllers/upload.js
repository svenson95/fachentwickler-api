const upload = require("../middleware/upload");

const uploadFile = async (req, res) => {
    try {
        await upload(req, res);

        if (req.file == undefined) {
            return res.status(400).send(`You must select a file.`);
        }
        return res.json({ message: 'Image successfully uplaoded', file: req.file });
        // return res.send(`File has been uploaded: ${JSON.stringify(req.file)}`);
    } catch (error) {
        return res.json({ message: `Error when trying upload image: ${error}`});
    }
};

module.exports = {
    uploadFile: uploadFile
};
