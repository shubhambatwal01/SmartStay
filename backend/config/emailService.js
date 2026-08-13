const nodemailer = require("nodemailer");

let cachedTransporter = null;

const verifyTransporter = (transporter) => {
  return new Promise((resolve) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ SMTP Connection Failed:", {
          message: error.message,
          code: error.code,
        });
        resolve(false);
      } else {
        console.log("✓ SMTP Server is ready to send emails");
        resolve(true);
      }
    });
  });
};

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM } =
    process.env;

  console.log("🔧 Checking SMTP Configuration:", {
    SMTP_HOST: SMTP_HOST ? "✓ Set" : "✗ Missing",
    SMTP_PORT: Number(SMTP_PORT) || 587 ? "✓ Set" : "✗ Missing",
    SMTP_SECURE: SMTP_SECURE ? "✓ Set" : "✗ Missing",
    SMTP_USER: SMTP_USER ? "✓ Set" : "✗ Missing",
    SMTP_PASS: SMTP_PASS
      ? "✓ Set (length: " + SMTP_PASS?.length + ")"
      : "✗ Missing",
    SMTP_FROM: SMTP_FROM ? "✓ Set" : "✗ Missing",
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("❌ SMTP Configuration Error - Missing required variables!");
    return null;
  }

  if (!SMTP_FROM) {
    console.warn("⚠️ SMTP_FROM not set, will use SMTP_USER as sender");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      
      connectionUrl: undefined,
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,

      tls: {
        minVersion: "TLSv1.2",
      },
    });

    // Verify async but don't block
    verifyTransporter(transporter);

    return transporter;
  } catch (error) {
    console.error("❌ Failed to create transporter:", error.message);
    return null;
  }
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

  <div
    style="max-width:680px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,.08);">

    <div style="background:linear-gradient(135deg,#ff5a5f,#ff7b80);padding:35px 40px;text-align:center;color:#fff;">
      <h1 style="margin:0;font-size:32px;font-weight:700;">🏡 SmartStay</h1>

      <h2 style="margin:18px 0 8px;font-size:24px;">
        ${title}
      </h2>

      <p style="margin:0;font-size:16px;opacity:.95;">
        ${intro}
      </p>
    </div>

    <div style="padding:35px 40px;">
      <div style="background:#fff8f8;border:1px solid #ffd9da;border-radius:14px;padding:22px;margin-bottom:30px;">

        <h3 style="margin:0 0 18px;color:#ff5a5f;font-size:20px;">
          Booking Summary
        </h3>

        <table width="100%" cellpadding="8" cellspacing="0" style="font-size:15px;border-collapse:collapse;">

          <tr>
            <td style="color:#6b7280;"><strong>🏠 Property</strong></td>
            <td>${homeName}</td>
          </tr>

          <tr>
            <td style="color:#6b7280;"><strong>📍 Address</strong></td>
            <td>${homeAddress}</td>
          </tr>

          <tr>
            <td style="color:#6b7280;"><strong>📅 Check-In</strong></td>
            <td>${checkIn}</td>
          </tr>

          <tr>
            <td style="color:#6b7280;"><strong>📅 Check-Out</strong></td>
            <td>${checkOut}</td>
          </tr>

          <tr>
            <td style="color:#6b7280;"><strong>👥 Guests</strong></td>
            <td>${guests}</td>
          </tr>

          <tr>
            <td style="color:#6b7280;"><strong>💳 Total Paid</strong></td>
            <td style="font-size:18px;font-weight:bold;color:#16a34a;">
              ₹${amount}
            </td>
          </tr>

        </table>

      </div>

      ${
        isHost
          ? `
      <div
        style="background:#eff6ff;border-left:5px solid #3b82f6;padding:18px 20px;border-radius:10px;margin-bottom:25px;">
        <strong style="font-size:17px;">🎉 Congratulations!</strong>
        <p style="margin:10px 0 0;color:#4b5563;">
          You have received a new booking for your property.
          Please review the booking details and ensure everything is ready before the guest arrives.
        </p>
      </div>
      `
          : `
      <div
        style="background:#f0fdf4;border-left:5px solid #22c55e;padding:18px 20px;border-radius:10px;margin-bottom:25px;">
        <strong style="font-size:17px;">🎉 Your booking is confirmed!</strong>
        <p style="margin:10px 0 0;color:#4b5563;">
          We're excited to host you.
          We hope you have a wonderful stay with SmartStay.
          If you have any questions, simply reply to this email.
        </p>
      </div>
      `
      }

      <div style="text-align:center;margin:35px 0;">
        <a href="https://shubz-smart-stay.vercel.app"
          style="display:inline-block;padding:14px 34px;background:#ff5a5f;color:#fff;text-decoration:none;border-radius:999px;font-size:16px;font-weight:600;">
          View Booking
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #ececec;margin:30px 0;">

      <p style="margin:0;color:#6b7280;font-size:15px;line-height:1.8;">
        Thank you for choosing <strong style="color:#ff5a5f;">SmartStay</strong>.
        We're committed to making every stay comfortable, secure, and memorable.
      </p>
      <p style="margin-top:25px;color:#6b7280;">
        Warm regards,<br>
        <strong style="color:#111827;">The SmartStay Team ❤️</strong>
      </p>
    </div>
    <div
      style="background:#fafafa;border-top:1px solid #ececec;padding:20px;text-align:center;font-size:13px;color:#9ca3af;">

      © ${new Date().getFullYear()} SmartStay. All rights reserved.

      <br><br>
      This email was sent automatically. Please do not reply directly to this message.
    </div>
  </div>
</div>
  `;
};

const sendBookingEmails = async (booking) => {
  const transporter = createTransporter();
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  console.log("📧 Starting email send process for booking:", booking._id);

  if (!transporter) {
    const errorMsg =
      "❌ Email transport could not be created. Check SMTP environment variables on Render.";
    console.error(errorMsg);
    return {
      success: false,
      reason: "SMTP transporter creation failed",
      details: errorMsg,
    };
  }

  if (!fromAddress) {
    const errorMsg =
      "❌ SMTP_FROM email address not configured. Set SMTP_FROM in Render environment.";
    console.error(errorMsg);
    return {
      success: false,
      reason: "SMTP_FROM missing",
      details: errorMsg,
    };
  }

  const user = booking.user;
  const home = booking.home;
  const owner = home?.owner;

  const guestName = user?.fullName || "Guest";
  const guestEmail = user?.email;
  const hostName = owner?.fullName || "Host";
  const hostEmail =
    owner?.email || process.env.HOST_NOTIFICATION_EMAIL || fromAddress;
  const homeName = home?.houseName || "your booked property";
  const homeAddress = home?.houseAddr || "Check your booking details";

  console.log("📋 Email Recipients Check:", {
    guestEmail: guestEmail ? "✓ Available" : "✗ Missing",
    hostEmail: hostEmail ? "✓ Available" : "✗ Missing",
  });

  if (!guestEmail) {
    const errorMsg =
      "❌ Guest email not available. User data not properly populated.";
    console.error(errorMsg, { user });
    return {
      success: false,
      reason: "Guest email missing",
      details: errorMsg,
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
      type: "guest",
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
      type: "host",
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

  console.log("📤 Sending emails to:", {
    guest: guestEmail,
    host: hostEmail,
  });

  // Send emails with timeout protection
  const sendWithTimeout = (mailOptions, timeoutMs = 30000) => {
    return Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`Email send timeout after ${timeoutMs}ms`)),
          timeoutMs,
        ),
      ),
    ]);
  };

  const results = await Promise.allSettled(
    emailPayloads.map((payload) => {
      console.log(`📤 Sending ${payload.type} email to ${payload.to}...`);
      return sendWithTimeout({
        from: fromAddress,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });
    }),
  );

  const successfulSends = results.filter(
    (result) => result.status === "fulfilled",
  );
  const failedSends = results.filter((result) => result.status === "rejected");

  console.log(
    `📊 Email Results: ${successfulSends.length} succeeded, ${failedSends.length} failed`,
  );

  if (failedSends.length > 0) {
    failedSends.forEach((failed, index) => {
      const error = failed.reason;
      console.error(`❌ Email ${index + 1} failed:`, {
        error: error?.message,
        code: error?.code,
        command: error?.command,
        response: error?.response,
      });
    });
  }

  if (successfulSends.length === 0) {
    const firstError = failedSends[0]?.reason;
    const errorMessage = firstError?.message || "Unknown email error";
    const errorCode = firstError?.code || "UNKNOWN_ERROR";
    const errorDetails = {
      message: errorMessage,
      code: errorCode,
      command: firstError?.command,
      response: firstError?.response,
    };

    console.error("❌ All emails failed. Render Environment Variables:", {
      SMTP_HOST: process.env.SMTP_HOST ? "Set" : "MISSING",
      SMTP_PORT: process.env.SMTP_PORT ? "Set" : "MISSING",
      SMTP_USER: process.env.SMTP_USER ? "Set" : "MISSING",
      SMTP_PASS: process.env.SMTP_PASS ? "Set" : "MISSING",
    });

    return {
      success: false,
      reason: errorMessage,
      code: errorCode,
      details: errorDetails,
      allFailed: true,
    };
  }

  console.log(
    `✓ ${successfulSends.length} of ${emailPayloads.length} booking emails sent`,
  );

  return {
    success: true,
    sentCount: successfulSends.length,
    totalCount: emailPayloads.length,
    failedCount: failedSends.length,
  };
};

module.exports = {
  createTransporter,
  buildBookingEmailHtml,
  sendBookingEmails,
};
