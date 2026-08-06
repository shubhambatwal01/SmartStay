const nodemailer = require("nodemailer");

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
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
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px 24px; text-align: center; color: #fff;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">${isHost ? "✓ New Booking" : "✓ Booking Confirmed"}</h1>
        <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">${intro}</p>
      </div>

      <!-- Main Card -->
      <div style="background: #1f2937; color: #e5e7eb; padding: 32px 24px; margin: 0;">
        <!-- Property Info -->
        <div style="margin-bottom: 28px;">
          <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 600; color: #fff;">${homeName}</h2>
          <p style="margin: 0; font-size: 14px; color: #9ca3af;">📍 ${homeAddress}</p>
        </div>

        <!-- Date & Time Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #374151;">
          <div>
            <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Check-in</p>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #fff;">${checkIn}</p>
          </div>
          <div>
            <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Check-out</p>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #fff;">${checkOut}</p>
          </div>
        </div>

        <!-- Booking Details Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #374151;">
          <div>
            <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af; text-transform: uppercase;">Guests</p>
            <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${guests}</p>
          </div>
          <div>
            <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af; text-transform: uppercase;">Total Amount</p>
            <p style="margin: 0; font-size: 18px; font-weight: 600; color: #10b981;">₹${amount}</p>
          </div>
        </div>

        <!-- Message -->
        <div style="background: #111827; padding: 16px; border-radius: 8px; margin-bottom: 28px;">
          <p style="margin: 0; font-size: 14px; color: #d1d5db;">
            ${
              isHost
                ? "Please review the booking details and prepare the property for the guest's arrival."
                : "We look forward to welcoming you! If you have any questions, feel free to reach out."
            }
          </p>
        </div>

        <!-- Footer -->
        <p style="margin: 0; font-size: 13px; color: #6b7280; text-align: center;">
          Best regards,<br/><strong style="color: #e5e7eb;">SmartStay Team</strong>
        </p>
      </div>

      <!-- Bottom Accent -->
      <div style="background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%); height: 4px;"></div>
    </div>
  `;
};

const sendBookingEmails = async (booking) => {
  const transporter = createTransporter();
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!transporter || !fromAddress) {
    console.warn(
      "Email transport is not configured. Booking emails were not sent.",
    );
    return {
      success: false,
      reason: "SMTP configuration missing",
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
  const homeAddress = home?.houseAddr || "Please check your booking details";

  if (!guestEmail) {
    return {
      success: false,
      reason: "Guest email not available",
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

  const results = await Promise.allSettled(
    emailPayloads.map((payload) =>
      transporter.sendMail({
        from: fromAddress,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    ),
  );

  const successfulSends = results.filter(
    (result) => result.status === "fulfilled",
  );

  if (successfulSends.length === 0) {
    const firstError = results[0]?.reason?.message || "Unknown email error";
    console.error("Booking emails could not be sent:", firstError);
    return {
      success: false,
      reason: firstError,
    };
  }

  return {
    success: true,
    sentCount: successfulSends.length,
  };
};

module.exports = {
  createTransporter,
  buildBookingEmailHtml,
  sendBookingEmails,
};
