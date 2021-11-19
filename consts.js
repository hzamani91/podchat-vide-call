const callType = {
    VOICE: 'VOICE',
    VIDEO: 'VIDEO'
};

const callStatus = {
    DEFAULT: "DEFAULT",
    CALLING: "CALLING",
    CALLCONFIRM: "CALLCONFIRM",
    CALLSTREAM: "CALLSTREAM",
    MESSAGE: "MESSAGE",
    POOR_CONNECTION: "POOR_CONNECTION"
};

const callEvents = {

    RECEIVE_CALL: "RECEIVE_CALL",//چنانچه تماسی با شما صورت گیرد، نخستین رویدادی که دریافت میکنید رویداد RECIVE_CALL می باشد که حاوی اطلاعات تماس گیرنده میباشد.
    CALL_SESSION_CREATED: "CALL_SESSION_CREATED",//بعد از قبول کردن تماس و وصل شدن مخاطبان، این رویداد رخ میدهد.
    CALL_STARTED: "CALL_STARTED",//بعد از قبول کردن تماس و وصل شدن مخاطبان، این رویداد رخ میدهد.
    ACCEPT_CALL: "ACCEPT_CALL",//با قبول کردن تماس در جواب سرور این رویداد را به شما برمیگرداند.
    REJECT_CALL: "REJECT_CALL",//چنانچه تماس را رد کنید، سرور در جواب این رویداد را برمیگرداند.
    CALL_DIVS: "CALL_DIVS",//پس از برقراری تماس و تشکیل شدن Divهای صوت و تصویر، در این رویداد این المان ها به کلاینت ارسال میگردند.
    END_CALL: "END_CALL",//چنانچه از تماسی که گرفته اید قبل از برقرار شدن تماس منصرف شوید، میتوانید از تابع endCall استفاده کنید. پس از صدا زدن تابع endCall سرور این رویداد را به کلاینت ارسال میکند.
    CALL_ENDED: "CALL_ENDED",//چنانچه تماس به طور کامل پایان یابد سرور این رویداد را به تمامی اعضای تماس ارسال میکند.
    CALL_PARTICIPANT_RECONNETING: "CALL_PARTICIPANT_RECONNETING",//اگر ارتباط عضوی از تماس در طول تماس قطع شود این رویداد به دیگر اعضای تماس ارسال میگردد تا به آنها وضعیت عضو مورد نظر را نشان دهد.
    CALL_PARTICIPANT_CONNECTED: "CALL_PARTICIPANT_CONNECTED",//در صورت برقراری دوباره ی ارتباط عضو قطع شده، سرور این رویداد را به اطلاع تمامی اعضای تماس می رساند.
    CALL_PARTICIPANT_LEFT: "CALL_PARTICIPANT_LEFT",//اگر عضوی از اعضای تماس، تماس را ترک کند، این رویداد به دیگر اعضای فعال تماس ارسال میگردد.
    CALL_PARTICIPANT_JOINED: "CALL_PARTICIPANT_JOINED",//چنانچه فرد جدیدی به تماس ملحق شود، ورودش با این رویداد به اطلاع دیگر اعضای تماس میرسد.
    CALL_PARTICIPANT_REMOVED: "CALL_PARTICIPANT_REMOVED",//اگر ادمین، فردی را از تماس حذف کند، این رویداد به دیگر اعضای تماس ارسال میگردد تا وضعیت خود را بروزرسانی کنند.
    TERMINATE_CALL: "TERMINATE_CALL",//در صورتی که ادمین تماس را به کل قطع کند، این رویداد را در جواب خواهد گرفت.
    CALL_PARTICIPANT_MUTE: "CALL_PARTICIPANT_MUTE",//اگر کسی صدای خودش را mute کند، یا ادمین یکی از اعضای تماس را mute کند این رویداد به همه ی اعضای تماس ارسال میگردد.
    CALL_PARTICIPANT_UNMUTE: "CALL_PARTICIPANT_UNMUTE",//اگر وضعیت فرد mute شده به unmute تغییر کند این رویداد به همه ارسال میگردد.
    START_RECORDING_CALL: "START_RECORDING_CALL",//در صورتی که یکی از اعضای فعال درخواست ضبط تماس را بدهد، تمامی اعضای حاضر در تماس این رویداد را دریافت میکنند.
    STOP_RECORDING_CALL: "STOP_RECORDING_CALL",//چنانچه ضبط تماس پایان یابد، این رویداد به تمامی اعضای فعال در ترد ارسال میشود.
    CALL_ERROR: 'CALL_ERROR', // خطا در تماس
    POOR_VIDEO_CONNECTION: 'POOR_VIDEO_CONNECTION',
    POOR_VIDEO_CONNECTION_RESOLVED: 'POOR_VIDEO_CONNECTION_RESOLVED'

}

const messageEvents = {

    MESSAGE_NEW: "MESSAGE_NEW",
    MESSAGE_EDIT: "MESSAGE_EDIT",
    THREAD_LAST_ACTIVITY_TIME: "THREAD_LAST_ACTIVITY_TIME",
    THREAD_UNREAD_COUNT_UPDATED: "THREAD_UNREAD_COUNT_UPDATED",
    MESSAGE_DELIVERY: "MESSAGE_DELIVERY",
    MESSAGE_SEEN: "MESSAGE_SEEN"
};

const messageType = {

    TEXT: "TEXT",
    VOICE: "VOICE",
    PICTURE: "PICTURE",
    VIDEO: "VIDEO",
    SOUND: "SOUND",
    FILE: "FILE",
    POD_SPACE_PICTURE: "POD_SPACE_PICTURE",
    POD_SPACE_VIDEO: "POD_SPACE_VIDEO",
    POD_SPACE_SOUND: "POD_SPACE_SOUND",
    POD_SPACE_VOICE: "POD_SPACE_VOICE",
    POD_SPACE_FILE: "POD_SPACE_FILE",
    LINK: "LINK",
    STICKER: "STICKER"
}

const callDisplayType = {
    VERTICAL: "VERTICAL",
    PIC_IN_PIC: "PIC_IN_PIC"
}

const socketStateType = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
}

export{ callType, callStatus, callEvents, messageEvents, messageType, callDisplayType, socketStateType };
  
