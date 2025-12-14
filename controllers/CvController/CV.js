const CV = require("../../model/CV");
const { parseCVPayload, 
     buildPersonalData,
} = require("./uploadPhoto");


const AddCV = async (req, res) => {
    let payload;

    try {
        payload = parseCVPayload(req.body);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "ساختار داده ارسالی معتبر نیست",
            error: error.message,
        });
    }

    const {
        personal,
        certificate,
        education,
        experiences,
        interests,
        languages,
        projects,
        skills,
        socialLink,
        template
    } = payload;

    const userId = req.userId || payload?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "User authentication required"
        });
    }

    if (!personal) {
        return res.status(404).json({
            success: false,
            message: "اطلاعات شخصی الزامی است !"
        });
    }

    try {
        const existingCV = await CV.findOne({ id: userId, template: template || "" });
        if (existingCV) {
            return res.status(409).json({
                success: false,
                message: "This resume already exists for this template!"
            });
        }

        let personalData;
        try {
            personalData = await buildPersonalData(req, personal);
        } catch (uploadError) {
            return res.status(uploadError.status || 500).json({
                success: false,
                message: "خطا در آپلود تصویر پروفایل",
                error: uploadError.message,
            });
        }

        const newCV = await CV.create({
            id: userId,
            template: template || "",
            personal: personalData,
            certificate,
            education,
            experiences,
            interests,
            languages,
            projects,
            skills,
            socialLink
        });

        res.status(201).json({
            success: true,
            message: "رزومه با موفقیت ذخیره شد",
            data: newCV,
        });
        console.log("رزومه یا موفقیت ذخیره شد");

    } catch (error) {
        console.error("خطا در ذخیره CV:", error);
        res.status(500).json({
            success: false,
            message: "خطا در ذخیره اطلاعات",
            error: error.message
        });
    }
};

const FetchUserCV = async (req, res) => {
    // Prefer authenticated user id injected by verifyJWT, fall back to body/query for flexibility
    const userId = req.userId || req.body?.id || req.query?.id;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "user id is required !"
        });
    }

    try {
        const userCVs = await CV.find({ id: userId });

        if (!userCVs.length) {
            return res.status(404).json({
                success: false,
                message: "هیچ رزومه‌ای برای این کاربر یافت نشد",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "رزومه شما دریافت شد",
            data: userCVs,
        });
    } catch (error) {
        console.error("خطا در دریافت CV کاربر:", error);
        return res.status(500).json({
            success: false,
            message: "خطا در دریافت رزومه‌ها",
            error: error.message,
        });
    }
};


const UpdateCV = async (req, res) => {
    const cvId = req.params?.id;

    if (!cvId) {
        return res.status(400).json({
            success: false,
            message: "شناسه رزومه الزامی است",
        });
    }

    let payload;
    try {
        payload = parseCVPayload(req.body);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "ساختار داده ارسالی معتبر نیست",
            error: error.message,
        });
    }

    const {
        personal,
        certificate,
        education,
        experiences,
        interests,
        languages,
        projects,
        skills,
        socialLink,
        template,
    } = payload;

    const userId = req.userId || payload?.id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "User authentication required",
        });
    }

    try {
        const existing = await CV.findById(cvId);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "رزومه یافت نشد",
            });
        }

        if (existing.id?.toString() !== userId?.toString()) {
            return res.status(403).json({
                success: false,
                message: "اجازه ویرایش این رزومه را ندارید",
            });
        }

        let personalData = personal;
        try {
            personalData = await buildPersonalData(req, personal);
        } catch (uploadError) {
            return res.status(uploadError.status || 500).json({
                success: false,
                message: "خطا در آپلود تصویر پروفایل",
                error: uploadError.message,
            });
        }

        existing.personal = personalData;
        existing.certificate = certificate;
        existing.education = education;
        existing.experiences = experiences;
        existing.interests = interests;
        existing.languages = languages;
        existing.projects = projects;
        existing.skills = skills;
        existing.socialLink = socialLink;
        existing.template = template || existing.template;

        const updated = await existing.save();

        return res.status(200).json({
            success: true,
            message: "رزومه با موفقیت به‌روزرسانی شد",
            data: updated,
        });
    } catch (error) {
        console.error("خطا در ویرایش CV:", error);
        return res.status(500).json({
            success: false,
            message: "خطا در ویرایش رزومه",
            error: error.message,
        });
    }
};


module.exports = { AddCV, FetchUserCV, UpdateCV };