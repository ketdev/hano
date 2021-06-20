const { firestore } = require('../access/admin');

exports.foreach = async (path, callback) => {
    firestore.collection(path).get().then(async function(querySnapshot) {
        querySnapshot.forEach(async function(doc) {
            await callback(doc.id, doc.data());
        });
    });
}

exports.all = async (path) => {
    const raw = await firestore.collection(path).get();    
    let docs = [];
    raw.forEach((line) => {
        const id = line.id;
        const data = line.data();
        docs.push({ id, ...data });
    });
    return docs;
};

exports.add = async (path, item) => {
    const doc = await firestore.collection(path).add(item);
    return doc.id;
};

exports.where = async (path, field, op, value) => {
    const articlesRef = firestore.collection(path);
    const raw = await articlesRef.where(field, op, value).get();
    let docs = [];
    raw.forEach((line) => {
        const id = line.id;
        const data = line.data();
        docs.push({ id, ...data });
    });
    return docs;
};

exports.query = async (path, id) => {
    const doc = await firestore.collection(path).doc(id).get();
    return { id: doc.id, ...doc.data() };
};

exports.update = async (path, id, item) => {
    return await firestore.collection(path).doc(id).update(item);
};

exports.delete = async (path, id) => {
    return await firestore.collection(path).doc(id).delete();
};