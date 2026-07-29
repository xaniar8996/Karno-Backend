// Email templates for OTP verification and password reset

const getOTPEmailTemplate = (
  OTP,
  {
    title = "تأیید حساب کاربری",
    description = "جهت وارد شدن به اپلیکیشن کارنو، رمز یکبار مصرف زیر را وارد نمایید:",
    timerText = "این رمز تا 24 ساعت معتبر است",
  } = {},
) => {
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

const getContactUsData = (Fullname, email, subject, message) => {
    return `
      <div dir="rtl" style="font-family: Tahoma, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 20px; font-size: 20px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
          📩 پیام جدید از فرم تماس با ما
        </h2>
  
        <div style="margin-bottom: 12px; font-size: 14px; color: #334155;">
          <strong style="color: #64748b; display: inline-block; width: 120px;">نام و نام خانوادگی:</strong>
          <span style="color: #0f172a; font-weight: 600;">${Fullname}</span>
        </div>
  
        <div style="margin-bottom: 12px; font-size: 14px; color: #334155;">
          <strong style="color: #64748b; display: inline-block; width: 120px;">ایمیل فرستنده:</strong>
          <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a>
        </div>
  
        <div style="margin-bottom: 16px; font-size: 14px; color: #334155;">
          <strong style="color: #64748b; display: inline-block; width: 120px;">موضوع:</strong>
          <span style="color: #0f172a; font-weight: 600;">${subject}</span>
        </div>
  
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
  
        <p style="color: #475569; font-size: 14px; font-weight: 700; margin-bottom: 8px;">متن پیام:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-right: 4px solid #4f46e5; padding: 16px; border-radius: 8px; color: #1e293b; font-size: 14px; line-height: 1.7; white-space: pre-wrap; word-break: break-word;">
          ${message}
        </div>
  
      </div>
    `;
  };
  
  module.exports = getContactUsData;

const getVerifyOTPTemplate = (OTP) => {
  return getOTPEmailTemplate(OTP, {
    title: "تأیید حساب کاربری",
    description:
      "جهت وارد شدن به اپلیکیشن کارنو، رمز یکبار مصرف زیر را وارد نمایید:",
    timerText: "این رمز تا 24 ساعت معتبر است",
  });
};

const getResetPasswordOTPTemplate = (OTP) => {
  return getOTPEmailTemplate(OTP, {
    title: "بازیابی رمز عبور",
    description:
      "جهت بازیابی یا تغییر رمز عبور، رمز یکبار مصرف زیر را در اپلیکیشن وارد نمایید:",
    timerText: "این رمز تا 15 دقیقه معتبر است",
  });
};


module.exports = {
  getVerifyOTPTemplate,
  getResetPasswordOTPTemplate,
  getOTPEmailTemplate,
  getContactUsData
};
