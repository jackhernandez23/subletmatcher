from email.mime.text import MIMEText
from pyotp import HOTP
from smtplib import SMTP_SSL


def send_email(subject, body, sender, recipients, password):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipients
    with SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
       smtp_server.login(sender, password)
       smtp_server.sendmail(sender, recipients, msg.as_string())
    print("Message sent!")


# Set up the key generator
key = "base32secret3232"
hotp = HOTP(key)
counter = 0

# Generate the key
new_code = hotp.at(counter)

# This would have to be stored in some other file, but counter increments by 1 after each time to generate new code
counter += 1

# The actual email contents
message = f"Your code is {new_code}"
me = "aelly.bot@gmail.com" # I set up this email to send automated messages, we can use this in the final product
you = "aelly.alwardi@ufl.edu" # Test recepient
sub = "Subletter 2FA Code"

passphrase = "iynb jhrh ghro wjvw"



send_email(sub, message, me, you, passphrase)