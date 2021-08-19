function generateResetEmail({ name, url }) {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>PathRoute | Password Reset</title>
      <style type="text/css" rel="stylesheet" media="all">
  @media only screen and (max-width: 500px) {
    .button {
      width: 100% !important;
      text-align: center !important;
    }
  }
  @media only screen and (max-width: 600px) {
    .email-body_inner,
  .email-footer {
      width: 100% !important;
    }
  }
  @media (prefers-color-scheme: dark) {
    body,
  .email-body,
  .email-body_inner,
  .email-content,
  .email-wrapper,
  .email-masthead,
  .email-footer {
      background-color: #333333 !important;
      color: #FFF !important;
    }
  
    p,
  ul,
  ol,
  blockquote,
  h1,
  h2,
  h3 {
      color: #FFF !important;
    }
  
    .attributes_content,
  .discount {
      background-color: #222 !important;
    }
  
    .email-masthead_name {
      text-shadow: none !important;
    }
  }
  </style>
      <!--[if mso]>
      <style type="text/css">
        .f-fallback  {
          font-family: Arial, sans-serif;
        }
      </style>
    <![endif]-->
    </head>
    <body style="height: 100%; margin: 0; -webkit-text-size-adjust: none; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; width: 100%;">
      <span class="preheader" style="visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; display: none;">Use this link to reset your password. The link is only valid for 10 Minutes.</span>
      <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7;" bgcolor="#F4F4F7">
        <tr>
          <td align="center" style="word-break: break-word; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; font-size: 16px;">
            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0;">
              <tr>
                <td class="email-masthead" style="word-break: break-word; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; font-size: 16px; padding: 25px 0; text-align: center;" align="center">
                  <a href="https://www.pathroute.io" class="f-fallback email-masthead_name" style="font-size: 16px; font-weight: bold; color: #A8AAAF; text-decoration: none; text-shadow: 0 1px 0 white;">
                  PathRoute
                </a>
                </td>
              </tr>
              <!-- Email Body -->
              <tr>
                <td class="email-body" width="100%" cellpadding="0" cellspacing="0" style="word-break: break-word; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;" bgcolor="#FFFFFF">
                  <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="width: 570px; margin: 0 auto; padding: 0; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;" bgcolor="#FFFFFF">
                    <!-- Body content -->
                    <tr>
                      <td class="content-cell" style="word-break: break-word; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; font-size: 16px; padding: 35px;">
                        <div class="f-fallback">
                          <h1 style="margin-top: 0; color: #333333; font-size: 22px; font-weight: bold; text-align: left;">Hi ${name},</h1>
                          <p style="margin: .4em 0 1.1875em; font-size: 16px; line-height: 1.625; color: #51545E;">You recently requested to reset your password for your PathRoute account. Use the button below to reset it. <strong>This password reset link is only valid for the next 10 Minutes.</strong></p> If you did not make this request please ignore it.
                          <!-- Action -->
                          <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 30px auto; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center;">
                            <tr>
                              <td align="center" style="word-break: break-word; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; font-size: 16px;">
                                <!-- Border based button-->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                  <tr>
                                    <td align="center" style="word-break: break-word; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; font-size: 16px;">
                                      <a href="${url}" class="f-fallback button button--green" target="_blank" style="display: inline-block; color: #FFF; text-decoration: none; border-radius: 3px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16); -webkit-text-size-adjust: none; box-sizing: border-box; background-color: #22BC66; border-top: 10px solid #22BC66; border-right: 18px solid #22BC66; border-bottom: 10px solid #22BC66; border-left: 18px solid #22BC66;">Reset your password</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          
                          <p style="margin: .4em 0 1.1875em; font-size: 16px; line-height: 1.625; color: #51545E;">Thank You,
                            <br>The PathRoute Team</p>
                          <!-- Sub copy -->
                          <table class="body-sub" role="presentation" style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #EAEAEC;">
                            <tr>
                              <td style="word-break: break-word; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; font-size: 16px;">
                                <p class="f-fallback sub" style="margin: .4em 0 1.1875em; line-height: 1.625; font-size: 13px; color: #6B6E76;">If you’re having trouble with the button above, copy and paste the URL below into your web browser.</p>
                                <p class="f-fallback sub" style="margin: .4em 0 1.1875em; line-height: 1.625; font-size: 13px; color: #6B6E76;">${url}</p>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="word-break: break-word; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; font-size: 16px;">
                  <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="width: 570px; margin: 0 auto; padding: 0; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center;">
                    <tr>
                      <td class="content-cell" align="center" style="word-break: break-word; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; font-size: 16px; padding: 35px;">
                        <p class="f-fallback sub align-center" style="margin: .4em 0 1.1875em; line-height: 1.625; text-align: center; font-size: 13px; color: #6B6E76;">Copyright &copy; 2021 PathRoute. All rights reserved.</p>
                        <p class="f-fallback sub align-center" style="margin: .4em 0 1.1875em; line-height: 1.625; text-align: center; font-size: 13px; color: #6B6E76;">
                          <br>Atlanta, GA
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
    `;
}

module.exports = generateResetEmail;
