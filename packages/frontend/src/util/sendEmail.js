const sendEmail = (
  to,
  subject = "",
  body = "",
  cc = process.env.REACT_APP_MAIL_HELPDESK,
) => {
  const compose = `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  window.location.href = compose;
};

export default sendEmail;
