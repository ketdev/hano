
exports.unique = (list) => {
    return [...new Set(list)];
};

exports.asyncfor = async (list, func) => {
    return Promise.all(list.map(async i => await func(i) ));
};