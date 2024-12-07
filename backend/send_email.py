from email.mime.text import MIMEText
from smtplib import SMTP_SSL, SMTPAuthenticationError
from pyotp import HOTP


def get_code(key_word):
    key = "".join([letter for letter in key_word if letter.isalpha()])
    hotp = HOTP(key)
    code = hotp.at(0)

    return code


def send_email(recipient):
    code = get_code(recipient)
    subject = f"Subletter 2FA Code: {code}"
    sender = "aelly.bot@gmail.com"  # This email is set up to send automated messages, it can be used in the product
    message = f"Your code is {code}"
    passphrase = open("emailpassword.txt").read()
    msg = MIMEText(message)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    try:
        with SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
            smtp_server.login(sender, passphrase)
            smtp_server.sendmail(sender, recipient, msg.as_string())
            return True
    except SMTPAuthenticationError:
        print("Check password")

    return False
