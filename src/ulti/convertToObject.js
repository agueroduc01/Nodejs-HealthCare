module.exports = {
    multipleToObject: function(moreData) {
        return moreData.map(data => data.toObject());
    },
    oneToObject: function(data) {
        return data ? data.toObject() : data;
    }
}