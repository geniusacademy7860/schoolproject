/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const formNumber = e.record.get("formNumber");
  const studentFirstName = e.record.get("studentFirstName");
  const studentLastName = e.record.get("studentLastName");
  const fatherEmail = e.record.get("fatherEmail");
  
  if (!fatherEmail) {
    e.next();
    return;
  }
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: fatherEmail }],
    subject: "Admission Form Confirmation - Form #" + formNumber,
    html: "<h2>Admission Form Submission Confirmation</h2>" +
          "<p>Dear Parent/Guardian,</p>" +
          "<p>Thank you for submitting the admission form for <strong>" + studentFirstName + " " + studentLastName + "</strong>.</p>" +
          "<p><strong>Form Number:</strong> " + formNumber + "</p>" +
          "<p><strong>Next Steps:</strong></p>" +
          "<ul>" +
          "<li>Your application is currently under review</li>" +
          "<li>You will receive an email notification once the admission is approved or if any additional documents are required</li>" +
          "<li>Please keep your form number for future reference</li>" +
          "</ul>" +
          "<p>If you have any questions, please contact the school administration.</p>" +
          "<p>Best regards,<br>School Administration</p>"
  });
  
  $app.newMailClient().send(message);
  e.next();
}, "admissions");