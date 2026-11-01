const axios = require("axios");

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromAddress = process.env.SMTP_FROM;

  if (!apiKey || !fromAddress) {
    throw new Error("Missing BREVO_API_KEY or SMTP_FROM environment variable");
  }

  const response = await axios.post(
    BREVO_API_URL,
    {
      sender: {
        name: "SmartStay",
        email: fromAddress,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    },
    {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      timeout: 15000,
    },
  );

  return response.data;
};

const buildBookingEmailHtml = ({
  recipientName,
  recipientType,
  guestName,
  homeName,
  homeAddress,
  checkIn,
  checkOut,
  guests,
  amount,
}) => {
  const isHost = recipientType === "host";
  const title = isHost
    ? `New booking request for ${homeName}`
    : `Booking confirmed for ${homeName}`;
  const intro = isHost
    ? `${guestName} just booked your property.`
    : `Hello ${recipientName}, your booking has been confirmed.`;

  return `
    <div style="margin:0;padding:30px;background:#f5f7fb;font-family:'Segoe UI',Arial,sans-serif;color:#374151;">
      <div style="max-width:680px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,.08);">
        <div style="background:linear-gradient(135deg,#ff5a5f,#ff7b80);padding:35px 40px;text-align:center;color:#fff;">
          <h1 style="margin:0;font-size:32px;font-weight:700;">🏡 SmartStay</h1>
          <h2 style="margin:18px 0 8px;font-size:24px;">${title}</h2>
          <p style="margin:0;font-size:16px;opacity:.95;">${intro}</p>
        </div>

        <div style="padding:35px 40px;">
          <div style="background:#fff8f8;border:1px solid #ffd9da;border-radius:14px;padding:22px;margin-bottom:30px;">
            <h3 style="margin:0 0 18px;color:#ff5a5f;font-size:20px;">Booking Summary</h3>
            <table width="100%" cellpadding="8" cellspacing="0" style="font-size:15px;border-collapse:collapse;">
              <tr><td style="color:#6b7280;"><strong>🏠 Property</strong></td><td>${homeName}</td></tr>
              <tr><td style="color:#6b7280;"><strong>📍 Address</strong></td><td>${homeAddress}</td></tr>
              <tr><td style="color:#6b7280;"><strong>📅 Check-In</strong></td><td>${checkIn}</td></tr>
              <tr><td style="color:#6b7280;"><strong>📅 Check-Out</strong></td><td>${checkOut}</td></tr>
              <tr><td style="color:#6b7280;"><strong>👥 Guests</strong></td><td>${guests}</td></tr>
              <tr>
                <td style="color:#6b7280;"><strong>💳 Total Paid</strong></td>
                <td style="font-size:18px;font-weight:bold;color:#16a34a;">₹${amount}</td>
              </tr>
            </table>
          </div>

          ${
            isHost
              ? `<div style="background:#eff6ff;border-left:5px solid #3b82f6;padding:18px 20px;border-radius:10px;margin-bottom:25px;">
                  <strong style="font-size:17px;">🎉 Congratulations!</strong>
                  <p style="margin:10px 0 0;color:#4b5563;">You have received a new booking for your property. Please review the booking details and ensure everything is ready before the guest arrives.</p>
                </div>`
              : `<div style="background:#f0fdf4;border-left:5px solid #22c55e;padding:18px 20px;border-radius:10px;margin-bottom:25px;">
                  <strong style="font-size:17px;">🎉 Your booking is confirmed!</strong>
                  <p style="margin:10px 0 0;color:#4b5563;">We're excited to host you. We hope you have a wonderful stay with SmartStay. If you have any questions, simply reply to this email.</p>
                </div>`
          }

          <div style="text-align:center;margin:35px 0;">
            <a href="https://shubz-smart-stay.vercel.app" style="display:inline-block;padding:14px 34px;background:#ff5a5f;color:#fff;text-decoration:none;border-radius:999px;font-size:16px;font-weight:600;">View Booking</a>
          </div>

          <hr style="border:none;border-top:1px solid #ececec;margin:30px 0;">
          <p style="margin:0;color:#6b7280;font-size:15px;line-height:1.8;">Thank you for choosing <strong style="color:#ff5a5f;">SmartStay</strong>. We're committed to making every stay comfortable, secure, and memorable.</p>
          <p style="margin-top:25px;color:#6b7280;">Warm regards,<br><strong style="color:#111827;">The SmartStay Team ❤️</strong></p>
        </div>

        <div style="background:#fafafa;border-top:1px solid #ececec;padding:20px;text-align:center;font-size:13px;color:#9ca3af;">
          © ${new Date().getFullYear()} SmartStay. All rights reserved.
          <br><br>This email was sent automatically. Please do not reply directly to this message.
        </div>
      </div>
    </div>
  `;
};

const sendBookingEmails = async (booking) => {
  console.log("📧 Starting email send process for booking:", booking._id);

  const user = booking.user;
  const home = booking.home;
  const owner = home?.owner;

  const guestName = user?.fullName || "Guest";
  const guestEmail = user?.email;
  const hostName = owner?.fullName || "Host";
  const hostEmail =
    owner?.email ||
    process.env.HOST_NOTIFICATION_EMAIL ||
    process.env.SMTP_FROM;

  const homeName = home?.houseName || "your booked property";
  const homeAddress = home?.houseAddr || "Check your booking details";

  if (!guestEmail) {
    return {
      success: false,
      reason: "Guest email missing",
    };
  }

  if (!hostEmail) {
    return {
      success: false,
      reason: "Host email missing",
    };
  }

  const formattedCheckIn = new Date(booking.checkIn).toLocaleDateString(
    "en-IN",
  );
  const formattedCheckOut = new Date(booking.checkOut).toLocaleDateString(
    "en-IN",
  );

  const emailPayloads = [
    {
      to: guestEmail,
      subject: `Booking confirmed: ${homeName}`,
      html: buildBookingEmailHtml({
        recipientName: guestName,
        recipientType: "guest",
        guestName,
        homeName,
        homeAddress,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        guests: booking.guests,
        amount: booking.amount,
      }),
    },
    {
      to: hostEmail,
      subject: `New booking received for ${homeName}`,
      html: buildBookingEmailHtml({
        recipientName: hostName,
        recipientType: "host",
        guestName,
        homeName,
        homeAddress,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        guests: booking.guests,
        amount: booking.amount,
      }),
    },
  ];

  console.log("📤 Sending booking emails to:", {
    guest: guestEmail,
    host: hostEmail,
  });

  const results = await Promise.allSettled(
    emailPayloads.map((payload) => sendEmail(payload)),
  );

  const successful = results.filter((result) => result.status === "fulfilled");
  const failed = results.filter((result) => result.status === "rejected");

  failed.forEach((result, index) => {
    const error = result.reason;
    console.error(`❌ Email ${index + 1} failed:`, {
      message: error.message,
      status: error.response?.status,
      response: error.response?.data,
      code: error.code,
    });
  });

  console.log(
    `📊 Email Results: ${successful.length} succeeded, ${failed.length} failed`,
  );

  return {
    success: successful.length > 0,
    sentCount: successful.length,
    totalCount: emailPayloads.length,
    failedCount: failed.length,
  };
};

module.exports = {
  buildBookingEmailHtml,
  sendBookingEmails,
};
