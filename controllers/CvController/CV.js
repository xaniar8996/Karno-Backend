const CV = require("../../model/CV");

const AddCV = async (req, res) => {
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
    } = req.body;

    // Get user ID from JWT token (set by verifyJWT middleware)
    const userId = req.body.id;

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
    
    // Check if user already has a CV with this template
    const existingCV = await CV.findOne({ id: userId, template: template || "" });
    if (existingCV) {
        return res.status(409).json({
            success: false, 
            message: "This resume already exists for this template!" 
        });
    }

    try {
        const newCV = await CV.create({
            id: userId, // User ID from JWT token
            template: template || "", // Template name (Nova, Royal, Aura, etc.)
            personal,
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


module.exports = { AddCV }