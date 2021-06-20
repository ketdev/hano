const { firebaseAdmin, firestore } = require('../access/admin');
const { validateLoginData, validateSignUpData } = require('../access/validators');

// client-side app for login proxy
const { firebase } = require('../access/client');

exports.signUpUser = (request, response) => {
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        country: request.body.country,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        username: request.body.username
    };

    const { valid, errors } = validateSignUpData(newUser);

    if (!valid) return response.status(400).json(errors);

    let token, userId;
    firestore
        .doc(`/users/${newUser.username}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return response.status(400).json({ username: 'this username is already taken' });
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        newUser.email,
                        newUser.password
                    );
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idtoken) => {
            token = idtoken;
            const userCredentials = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                country: newUser.country,
                email: newUser.email,
                createdTime: new Date().toISOString(),
                userId
            };
            return firestore
                .doc(`/users/${newUser.username}`)
                .set(userCredentials);
        })
        .then(() => {
            return response.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return response.status(400).json({ email: 'Email already in use' });
            } else {
                return response.status(500).json({ general: 'Something went wrong, please try again' });
            }
        });
}

exports.loginUser = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    }

    const { valid, errors } = validateLoginData(user);
    if (!valid) return response.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return response.json({ token });
        })
        .catch((error) => {
            console.error(error);
            return response.status(403).json({ general: 'wrong credentials, please try again' });
        })
}

exports.getUserDetail = (request, response) => {
    let userData = {};
    firestore
        .doc(`/users/${request.user.username}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData = doc.data();
                return response.json(userData);
            }
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({ error: error.code });
        });
}

exports.updateUserDetails = (request, response) => {
    let document = firestore.collection('users').doc(`${request.user.username}`);

    const updateableFields = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        country: request.body.country,
        //email: request.body.email, // must update firebase credentials as well in this case
        updatedTime: new Date().toISOString()
    };
    
    document.update(updateableFields)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((error) => {
        console.error(error);
        return response.status(500).json({ 
            message: "Cannot Update the value"
        });
    });
}

function deleteImage(imageName) {
    const bucket = firebaseAdmin.storage().bucket();
    const path = `${imageName}`
    return bucket.file(path).delete()
        .then(() => {
            return
        })
        .catch((error) => {
            return
        })
}

exports.uploadProfilePhoto = (request, response) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({ headers: request.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
            return response.status(400).json({ error: 'Wrong file type submited' });
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${request.user.username}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimetype };
        file.pipe(fs.createWriteStream(filePath));
    });
    deleteImage(imageFileName);
    busboy.on('finish', () => {
        firebaseAdmin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filePath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
                return firestore.doc(`/users/${request.user.username}`).update({
                    imageUrl
                });
            })
            .then(() => {
                return response.json({ message: 'Image uploaded successfully' });
            })
            .catch((error) => {
                console.error(error);
                return response.status(500).json({ error: error.code });
            });
    });
    busboy.end(request.rawBody);
}
