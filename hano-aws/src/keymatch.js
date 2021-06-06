
exports.matchKeywords = (text, keywords) => {
    var regexMetachars = /[(){[*+?.\\^$|]/g;
    for (var i = 0; i < keywords.length; i++) {
        keywords[i] = keywords[i].replace(regexMetachars, "\\$&");
    }
    var regex = new RegExp("(?:" + keywords.join("|") + ")", "gi");
    return text.match(regex) || [];
}