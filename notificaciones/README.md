# Notification-scheduler

## Description

Service in charge of scheduling notifications and sent them by _Telegram_ or _email_, or both.
Notifications are sent on the dot or at half past, and the user is enable can create, edit, update or delete a notification

To schedule a notification a form must be sent containing the following information:

+ **Start Date:** when the notification is triggered
+ **Via:** can be Telegram, Mail or Both. The notification will be delivery to one of these services, or both
+ **Message:** message to be sent to the user
+ **End Date:** when the notifications should stop. If none data was pass to this attribute, the notification never ends
+ **Hours:** hours of the day on which the notification should be sent

E.g:

```
Start Date: 2024/02/23
Via: Telegram
Message: Olvídala. No es fácil para mí, por eso quiero hablarle. Si es preciso rogarle que regrese a mi vida 
End Date: 2024/03/23
Hours: 10.30, 22.30

Start Date: 2024/02/23
Via: Both
Message: Forget her. It's not easy for me, that's why I want to talk to you. If it is necessary to beg him to return to my life
End Date: -
Hours: 10.30, 22.30
```

## Run

COMPLETE

## How to use

Once the project is running, in the following [link](http://localhost:9069/notifications/swagger/index.html) you will find a swagger to perform
different requests.

**OBS:** some features are not enable (like sending notifications via email) due to the project is run locally