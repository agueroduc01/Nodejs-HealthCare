let getUploadFilePage = async(req, res, next) => {
    return res.render('uploadFile', {
        path: 'upload',
    });
};

module.exports = {
    getUploadFilePage,
}