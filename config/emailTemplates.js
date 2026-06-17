// Email templates for OTP verification and password reset

const getOTPEmailTemplate = (OTP, { title = "تأیید حساب کاربری", description = "جهت وارد شدن به اپلیکیشن کارنو، رمز یکبار مصرف زیر را وارد نمایید:", timerText = "این رمز تا 24 ساعت معتبر است" } = {}) => {
    return `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; margin: 0;">
            <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">کارنو</h1>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px; text-align: center;">
                    <h2 style="color: #333; font-size: 20px; margin: 0 0 15px 0; font-weight: 600;">${title}</h2>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
                        ${description}
                    </p>
                    
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">رمز یکبار مصرف</p>
                        <h1 style="color: white; font-size: 42px; font-weight: 700; margin: 0; letter-spacing: 2px; font-family: 'Courier New', monospace;">
                            ${OTP}
                        </h1>
                    </div>
                    
                    <!-- Timer Info -->
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px; margin: 0;">⏱️ ${timerText}</p>
                    </div>
                    
                    <!-- Warning -->
                    <p style="color: #d9534f; font-size: 12px; margin: 20px 0 0 0; line-height: 1.5;">
                        ⚠️ این رمز را با هیچ‌کس شریک نکنید. پشتیبانی هرگز این رمز را نخواهد پرسید.
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                        اگر این درخواست را نکردید، لطفاً این ایمیل را نادیده بگیرید.
                    </p>
                    <p style="color: #999; font-size: 11px; margin: 10px 0 0 0;">
                        © 2024 کارنو. تمام حقوق محفوظ است.
                    </p>
                </div>
            </div>
        </div>
    `;
};

const getVerifyOTPTemplate = (OTP) => {
    return getOTPEmailTemplate(OTP, {
        title: "تأیید حساب کاربری",
        description: "جهت وارد شدن به اپلیکیشن کارنو، رمز یکبار مصرف زیر را وارد نمایید:",
        timerText: "این رمز تا 24 ساعت معتبر است"
    });
};

const getResetPasswordOTPTemplate = (OTP) => {
    return getOTPEmailTemplate(OTP, {
        title: "بازیابی رمز عبور",
        description: "جهت بازیابی یا تغییر رمز عبور، رمز یکبار مصرف زیر را در اپلیکیشن وارد نمایید:",
        timerText: "این رمز تا 15 دقیقه معتبر است"
    });
};

module.exports = { getVerifyOTPTemplate, getResetPasswordOTPTemplate, getOTPEmailTemplate };
