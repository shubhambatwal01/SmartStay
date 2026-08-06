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
    SMTP_PORT: SMTP_PORT ? "✓ Set" : "✗ Missing",
    SMTP_SECURE: SMTP_SECURE ? "✓ Set" : "✗ Missing",
    SMTP_USER: SMTP_USER ? "✓ Set" : "✗ Missing",
    SMTP_PASS: SMTP_PASS ? "✓ Set (length: " + SMTP_PASS?.length + ")" : "✗ Missing",
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
      pool: {
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 4000,
        rateLimit: 14,
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
    <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 680px; margin: 0 auto; padding: 24px; background: #FF5A5F;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 16px 16px 0 0; padding: 24px 30px; color: #ffffff;">
        <h2 style="margin: 0 0 8px; font-size: 24px;">${title}</h2>
        <p style="margin: 0; font-size: 15px; opacity: 0.95;">${intro}</p>
      </div>

      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; padding: 28px 30px;">
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px 20px; margin-bottom: 18px;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em;">Booking Summary</p>
          <p style="margin: 0 0 8px;"><strong style="color: #111827;">Property:</strong> ${homeName}</p>
          <p style="margin: 0 0 8px;"><strong style="color: #111827;">Address:</strong> ${homeAddress}</p>
          <p style="margin: 0 0 8px;"><strong style="color: #111827;">Check-in:</strong> ${checkIn}</p>
          <p style="margin: 0 0 8px;"><strong style="color: #111827;">Check-out:</strong> ${checkOut}</p>
          <p style="margin: 0 0 8px;"><strong style="color: #111827;">Guests:</strong> ${guests}</p>
          <p style="margin: 0;"><strong style="color: #111827;">Total Paid:</strong> ₹${amount}</p>
        </div>

            ${
              isHost
                ? "<p style='margin: 0 0 12px; color: #374151;'>Please review the booking details and prepare the property for the guest.</p>"
                : "<p style='margin: 0 0 12px; color: #374151;'>We look forward to welcoming you. If you need any help, reply to this email.</p>"
            }
        <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px;">Thanks,<br/><strong>SmartStay Team</strong></p>
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

  console.log(`✓ ${successfulSends.length} of ${emailPayloads.length} booking emails sent`);

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
