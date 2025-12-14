const cloudinary = require("../../config/cloudinary");

const isDataUri = (value) =>
    typeof value === "string" && value.trim().startsWith("data:");
const isHttpUrl = (value) =>
    typeof value === "string" && /^https?:\/\//.test(value);

const parseCVPayload = (body = {}) => {
    if (body.payload) {
        return JSON.parse(body.payload);
    }
    return body;
};

const uploadProfileImage = async (file) => {
    if (!file) return "";

    const base64 = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64}`;
    const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: "cv/profile",
        resource_type: "auto",
    });
    return uploaded.secure_url;
};

const uploadProfileImageFromDataUri = async (dataUri) => {
    if (!dataUri) return "";
    const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: "cv/profile",
        resource_type: "auto",
    });
    return uploaded.secure_url;
};

const buildPersonalData = async (req, personal = {}) => {
    let personalData = { ...personal };

    try {
        if (req.file) {
            const imageUrl = await uploadProfileImage(req.file);
            personalData.Image = imageUrl;
        } else if (isDataUri(personal?.Image)) {
            const imageUrl = await uploadProfileImageFromDataUri(personal.Image);
            personalData.Image = imageUrl;
        }

        // Never persist raw data URIs (heavy and unsafe); keep only Cloudinary URLs
        if (isDataUri(personalData.Image)) {
            delete personalData.Image;
        } else if (personalData.Image && !isHttpUrl(personalData.Image)) {
            // Strip any non-URL value (e.g., local paths) to keep DB clean
            delete personalData.Image;
        }

        return personalData;
    } catch (uploadError) {
        // Do not store the base64 string in DB on failure
        delete personalData.Image;
        const err = new Error(uploadError.message || "Upload failed");
        err.status = 500;
        throw err;
    }
};

module.exports = {
    parseCVPayload,
    uploadProfileImage,
    uploadProfileImageFromDataUri,
    buildPersonalData,
    isDataUri,
    isHttpUrl
}