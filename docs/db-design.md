* User

- name [String, required, minlength:3, maxlength:20, trim]
- email [String, required, unique, lowercase, trim] todo:check email format [regex]
- password [String, required, minlength:6] >> optional in case login with google
- provider [String] enum:['system','google','instagram']
- profilePic:[String] URL
- isVerified[ Boolean] default:false
- createdAt [date]
- updatedAt [date]
- isDeleted [Boolean] default:false [soft delete]

===========================

* Message

- content [String,required,minlength:1,maxlength:200]
- receiver [ObjectId,required,ref:User]
- sender [ObjectId,ref:User]
- isDeleted [Boolean] default:false [soft delete]
- createdAt [date]
- updatedAt [date]

=======================

* OTP

- value [String,required,length:6]
- email [String,required]
- expiredAt [date] 2026-09-13T07:15:00
- createdAt [date] 2026-09-13T07:05:00
- updatedAt [date]
