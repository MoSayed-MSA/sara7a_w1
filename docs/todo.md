* NGL APP

- features:

1. authentication flow:
    - register.
    - send verification email. [otp,link]
    - verify email using. [otp,link]
    - login.
    - forgot password.
    - reset password.
    - login with Google.

2. user flow:
    - update profile.
    - view profile.
    - view all users.

3. messages flow:
    - send message.
    - view incoming messages.
    - delete a specific message.


* no SQL

1. high availability. [view]
2. eventual consistency.[]


* OTP [one-time password]

- generate OTP.[register,reset-password,vodafone-cash,place-order]
- save OTP into DB within the register.
- delete OTP after usage verify an account.
- delete OTP after 10 minutes.[TTL] >> time to live.


* modules :

1. commonJs -> ES5 -> const require() >> module.exports = fn;
2. moduleJs -> ES6 -> import fn from 'module-name' >> export fn; 