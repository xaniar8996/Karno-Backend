const OpenAI = require("openai");
const Users = require("../../model/Users");
const logger = require("../../config/logger");

const client = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL:
        "https://api.groq.com/openai/v1"
});


const TextSummary = async (req, res) => {
    try {
        const userId = req.userId || req.body?.id || req.query?.id;
        const { description } = req.body;


        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const LIMIT = 20;

        const now = new Date();
        const lastReset = new Date(user.aiUsage.lastReset);
        
        const TWENTY_MINUTES = 20 * 60 * 1000;

        // Reset every 20 minutes
        if (now.getTime() - lastReset.getTime() >= TWENTY_MINUTES) {
            user.aiUsage.count = 0;
            user.aiUsage.lastReset = now;
        }

        // check limit
        if (user.aiUsage.count >= LIMIT) {
            return res.status(429).json({
                success: false,
                message: "Daily AI limit reached"
            });
        }

        if (!description) {
            return res.status(400).json({ success: false, message: "Text is required" });
        };

        const prompt = `
        تو یک متخصص منابع انسانی (HR)، نویسنده حرفه‌ای رزومه و کارشناس برند شخصی هستی.
        
        وظیفه:
        متن ورودی را به گونه‌ای بازنویسی کن که برای قرار گرفتن در رزومه کاملاً حرفه‌ای، روان و تاثیرگذار باشد.
        
        قوانین:
        - متن را به فارسی روان و رسمی بازنویسی کن.
        - مفهوم اصلی و تمام اطلاعات مهم را حفظ کن.
        - غلط‌های املایی، نگارشی و دستوری را اصلاح کن.
        - متن را شفاف‌تر، حرفه‌ای‌تر و جذاب‌تر کن.
        - در صورت نیاز، ساختار جملات را برای خوانایی بهتر تغییر بده.
        - از افعال قوی و لحن حرفه‌ای استفاده کن.
        - از اغراق، اطلاعات ساختگی یا دستاوردهای غیرواقعی خودداری کن.
        - تا حد امکان از جملات اضافی، تکراری و کلمات غیرضروری حذف کن.
        - متن را مناسب استفاده در رزومه و پروفایل‌های شغلی مانند LinkedIn بنویس.
        - هیچ عنوان، توضیح، مقدمه یا نکته اضافه ننویس.
        - فقط نسخه نهایی متن را برگردان.
        `;

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0.4,
            max_tokens: 500,
            messages: [
                {
                    role: "system",
                    content: prompt
                },
                {
                    role: "user",
                    content: description
                }
            ]
        });

        user.aiUsage.count += 1;
        await user.save();

        logger.info({
            event:"TEXT_SUMMARY",
            userId:userId,
            userAiUsage: user.aiUsage.count,
            userlastReset: user.aiUsage.lastReset,
            createdAt:user.createdAt,
            ip: req.ip,
        });

        return res.status(200).json({
            success: true,
            improvedText: response.choices[0].message.content,
            message: "Text improved successfully"
        });
    }
    catch (error) {
        logger.error({
            event: "TEXT_SUMMARY_FAILED",
            message: error.message,
            stack: error.stack,
            userId,
            ip: req.ip,
         });

        return res.status(500).json({ error: error.message });
    }
};


module.exports = TextSummary;