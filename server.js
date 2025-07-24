const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: '.env' });
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

app.get('/send-candidature/:email/:id', async (req, res) => {
    console.log(process.env.USER)
    const recipientEmail = req.params.email;
    const candidatureId = req.params.id;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!candidatureId || candidatureId.trim() === '') {
        return res.status(400).json({ error: 'Candidature ID is required' });
    }

    const mailOptions = {
        from: process.env.USER,
        to: recipientEmail,
        subject: 'Candidature Submission Confirmation',
        text: `Dear Candidate,

We are pleased to confirm that your candidature has been successfully submitted and received by our recruitment team.

Your Candidature ID: ${candidatureId}

Please keep this ID for your records, as you may need it for future reference and to track the status of your application.

Our team will review your application and contact you if your profile matches our current requirements.

Thank you for your interest in joining our organization.

Best regards,
Recruitment Team`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #2c3e50; margin-bottom: 20px; text-align: center;">Candidature Submission Confirmation</h2>
                
                <p style="color: #34495e; line-height: 1.6; margin-bottom: 15px;">Dear Candidate,</p>
                
                <p style="color: #34495e; line-height: 1.6; margin-bottom: 20px;">
                    We are pleased to confirm that your <strong>candidature has been successfully submitted</strong> and received by our recruitment team.
                </p>
                
                <div style="background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; color: #2c3e50; font-weight: bold;">Your Candidature ID:</p>
                    <p style="margin: 5px 0 0 0; color: #e74c3c; font-size: 18px; font-weight: bold;">${candidatureId}</p>
                </div>
                
                <p style="color: #34495e; line-height: 1.6; margin-bottom: 15px;">
                    Please keep this ID for your records, as you may need it for future reference and to track the status of your application.
                </p>
                
                <p style="color: #34495e; line-height: 1.6; margin-bottom: 15px;">
                    Our team will review your application and contact you if your profile matches our current requirements.
                </p>
                
                <p style="color: #34495e; line-height: 1.6; margin-bottom: 20px;">
                    Thank you for your interest in joining our organization.
                </p>
                
                <div style="border-top: 1px solid #ecf0f1; padding-top: 20px; margin-top: 30px;">
                    <p style="color: #7f8c8d; margin: 0;">Best regards,</p>
                    <p style="color: #2c3e50; font-weight: bold; margin: 5px 0 0 0;">Recruitment Team</p>
                </div>
            </div>
        </div>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.json({
            success: true,
            messageId: info.messageId,
            recipient: recipientEmail,
            candidatureId: candidatureId,
            message: 'Candidature confirmation email sent successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Email service running on port ${PORT}`);
});