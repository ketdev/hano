
exports.unique = (list) => {
    return [...new Set(list)];
};

exports.asyncmap = async (arr, func) => {
    return Promise.all(arr.map(async i => await func(i) ));
};

exports.asyncfilter = async (arr, predicate) => {
    return Promise.all(arr.map(predicate))
	.then((results) => arr.filter((_v, index) => results[index]));
};
