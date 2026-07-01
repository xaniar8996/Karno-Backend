const CV = require("../../model/CV");

const DuplicateCV = async (req, res) => {
    const { id } = req.params;
    try {
        const findCV = await CV.findById(id);

        if (!findCV) return res.status(404).json({
            success: false,
            message: "رزومه پیدا نشد."
        });

        const copy = findCV.toObject();

        delete copy._id;
        delete copy.createdAt;
        delete copy.updatedAt;

        const duplicatedCV = await CV.create(copy);

        return res.status(201).json({
            success: true,
            message: "رزومه با موفقیت کپی شد.",
            data: duplicatedCV
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "خطا در کپی کردن رزومه",
            error: error.message,
        });
    }
}

module.exports = DuplicateCV