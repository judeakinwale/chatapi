// const ErrorResponse = require("./errorResponse");
const sendEmail = require("./sendEmail");

exports.activateAccountEmail = async (req, res, user) => {
  //Get reset token
  const activationToken = user.getActivationToken();
  await user.save({ validateBeforeSave: false });

  //Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/activate/${activationToken}`;

  const salutation = `Hello ${user.firstname ?? user.fullname}`;
  const content = `You are receiving this email because you recently created an account, Please click on this button to activate your account \n\n <br /><br /> <a href="${resetUrl}" style="padding:1rem;color:black;background:#ff4e02;border-radius:5px;text-decoration:none;">Activate</a> \n\n <br /><br /> This link would expire in 5 hours <br /><br/> Kindly ignore if you did not create an account`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Account Activation",
      // message: "",
      salutation,
      content,
    });
    return true;
  } catch (err) {
    user.activationToken = undefined;
    user.activationExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    console.log(err);
    // throw new ErrorResponse("Email could not be sent", 500);
    return false;
  }
};
