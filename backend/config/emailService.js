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
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color: #2563eb;">${title}</h2>
      <p>${intro}</p>
      <div style="background: #f9fafb; padding: 16px; border-radius: 8px;">
        <p><strong>Property:</strong> ${homeName}</p>
        <p><strong>Address:</strong> ${homeAddress}</p>
        <p><strong>Check-in:</strong> ${checkIn}</p>
        <p><strong>Check-out:</strong> ${checkOut}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Total Paid:</strong> ₹${amount}</p>
      </div>
      ${
        isHost
          ? "<p>Please review the booking details and prepare the property for the guest.</p>"
          : "<p>We look forward to welcoming you. If you need any help, reply to this email.</p>"
      }
      <p style="margin-top: 16px;">Thanks,<br/>SmartStay Team</p>
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
