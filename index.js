'use strict';

var { callStatus, callType,
    callEvents, messageEvents,
    messageType, callDisplayType,
    socketStateType
} = require('./consts');
var { callContainer } = require('./template');


export default class VideoCall {

    constructor(hostId, options) {

        this.hostId = hostId;
        this.threadId = 0;
        this.autoAnswer = true;
        this.callStatus = callStatus.DEFAULT;
        this.callId = 0;
        this.callType = callType.VIDEO;
        this.hostElement = {};
        this.badgeElement = {};
        this.callElement = {};
        this.newMessage = 0;
        this.isCamOn = true;
        this.isMicOn = true;
        this.options = options;
        this.endCallback = options.endCallback
        this.cancelCallback = options.cancelCallback;
        this.inCall = false;
        this.isDisposed = false;
        this.totalTime = 0;
        this.callDurationInterval = null;
        this.isHistoryLoaded = false;
        this.currentUser = options.userInfo
        this.userIsCustomer = options.userIsCustomer;
        this.socektStatus = {};
        this.receiveCallTimeout = this.setCallTimeout(options.receiveCallTimeout);
        this.callStartedTimeout = {};


    }

    setCallTimeout(timeout) {
        if (!timeout) {
            timeout = 10000;
        }

        return setTimeout(() => {
            if (this.options.timeoutCallback) {
                this.options.timeoutCallback();
            }
            this.cancelCall();
        }, timeout);
    }

    setChatAgent(chatAgent) {

        this.chatAgent = chatAgent
        this.callListener = this.chatAgent.on('callEvents', (event) => this.call_eventHandler(event));
        this.messageListener = this.chatAgent.on("messageEvents", (event) => this.message_eventHandler(event));
        this.chatStateListener = this.chatAgent.on('chatState', (event) => this.chatState_eventHandler(event));
    }

    initializeView() {
        this.hostElement = document.getElementById(this.hostId);
        this.hostElement.appendChild(callContainer.cloneNode(true));
        this.hostElement.querySelector('.mic').addEventListener('click', (event) => this.toggleMic(event));
        this.hostElement.querySelector('.video').addEventListener('click', (event) => this.toggleCam(event));
        this.hostElement.querySelector('.end-call').addEventListener('click', () => this.endCall());
        this.hostElement.querySelector('.pc-end-call').addEventListener('click', () => this.endCall());
        this.hostElement.querySelector('.cancel-call').addEventListener('click', () => this.cancelCall());
        this.hostElement.querySelector('.close-btn').addEventListener('click', () => this.closeMsg());
        this.hostElement.querySelector('.message').addEventListener('click', () => this.openMessages());
        this.hostElement.querySelector('.send-message').addEventListener('click', () => this.sendMsge(
            this.hostElement.querySelector('.input').value
        ));
        this.badgeElement = this.hostElement.querySelector('.msg-badge');
        this.callElement = this.hostElement.querySelector('.wrapper-video');

        var input = this.hostElement.querySelector('.input');
        input.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.hostElement.querySelector('.send-message').click();
            }
        });

        this._inputMessage = this.hostElement.querySelector('.input');
        this.messageList = this.hostElement.querySelector('.messages-list');
        this._clearCallDiv();
        this.messageList.scrollTop = this.messageList.scrollHeight



        if (this.options.headerText) {
            this.hostElement.querySelector('.caller-info span').innerHTML = this.options.headerText;
        } else {
            this.hostElement.querySelector('.call-header').classList.add('color-transparent');
        }

        if (this.options.waitingText) {
            this.hostElement.querySelector('.waiting').innerHTML = this.options.waitingText;
        }

        this.socektStatus = this.hostElement.querySelector('.socket-status-content');
    }

    openMessages() {


        this.hostElement.querySelector('.call-stream').classList.remove('d-flex-column');
        this.hostElement.querySelector('.call-stream').classList.add('display-none');
        this.hostElement.querySelector('.messages').classList.remove('display-none');
        this.hostElement.querySelector('.messages').classList.add('d-flex-column');
        this.callStatus = callStatus.MESSAGE;
        if (this.newMessage !== 0)
            this.badgeElement.classList.add('display-none');
        this.newMessage = 0;
        this.hostElement.querySelector('.input').focus();
        this.messageList.scrollTop = this.messageList.scrollHeight

    }

    sendMsge(message) {
        message = message.trim();
        if (message == '') {
            return;
        }


        var params = {
            threadId: this.threadId,
            textMessage: message,
            messageType: messageType.TEXT
        };

        this.chatAgent.sendTextMessage(params, {
            onSent: (result) => {
                this._inputMessage.value = '';
            },
            onDeliver: (result) => {
                this.log(result.uniqueId + ' \t has been Delivered!');
            },
            onSeen: (result) => {
                this.log(result.uniqueId + ' \t has been Seen!');
            }
        });
    }

    addMessageToList(message, senderId, msgTime) {

        let li = document.createElement('li');
        let span = document.createElement('span');
        let div = document.createElement('div');
        let time = document.createElement('div');
        let br = document.createElement('br');

        div.classList.add('msgitem');
        if (senderId == this.currentUser.id)
            div.classList.add('msg-send');
        else {
            li.classList.add('content-left')
            div.classList.add('msg-receive');
        }
        span.innerHTML = message
        div.appendChild(span);
        div.appendChild(br);
        let dateStr = new Date(msgTime);
        time.innerHTML = (dateStr.getHours() <= 9 ? ("0" + dateStr.getHours()) : dateStr.getHours()) + ":" + (dateStr.getMinutes() <= 9 ? ("0" + dateStr.getMinutes()) : dateStr.getMinutes());
        div.appendChild(time)

        li.appendChild(div);
        this.hostElement.querySelector('.messages-list').append(li);

    }

    getHistory() {

        if (this.isHistoryLoaded)
            return;

        var params = {
            threadId: this.threadId,
            count: 50,
            offset: 0,
            order: 'DESC',
            messageType: 'TEXT'
        };

        this.chatAgent.getHistory(params, (historyResult) => {
            this.log('load history');
            if (historyResult.hasError) {
                console.log(historyResult.errorMessage);
                return;
            }

            this.isHistoryLoaded = true;
            historyResult.result.history.reverse().forEach(message => {
                this.addMessageToList(`
                         <span>${message.message}</span>`,
                    message.participant.id,
                    message.timeMiliSeconds
                )
            });
        });
    }

    closeMsg() {

        this.hostElement.querySelector('.input').value = '';
        this.hostElement.querySelector('.call-stream').classList.remove('display-none');
        this.hostElement.querySelector('.call-stream').classList.add('d-flex-column');

        this.hostElement.querySelector('.messages').classList.remove('d-flex-column');
        this.hostElement.querySelector('.messages').classList.add('display-none');

        this.callStatus = callStatus.CALLSTREAM;
    }

    render() {
        this.initializeView();
    }

    call(callOption) {

        this.threadId = callOption.threadId;
        if (this.chatAgent) {
            this.chatAgent.startCall(callOption);
            this.callStatus = callStatus.CALLING;

        }

    }

    getThreadParticipant(threadId) {
        if (this.participant)
            return;

        let params = {
            threadId: threadId
        }

        this.chatAgent.getThreadParticipants(params, (response) => {
            this.participant = response.result.participants.find((item) => item.id !== this.currentUser.id);
            this.hostElement.querySelector('.participant').innerHTML = this.participant.name;

        });
    }

    message_eventHandler(event) {


        var type = event.type,
            message = event.result.message;
        this.log('message event!');

        if (message.messageType == 14 && this.threadId === 0) {
            this.threadId = message.threadId;
        }

        this.getThreadParticipant(this.threadId);

        this.getHistory();
        switch (type) {
            case messageEvents.MESSAGE_NEW:
                this.log('new message received!!');
                this.log(event);
                if (message.message && message.threadId == this.threadId) {
                    this.increementBadge();
                    this.addMessageToList(`                 
                             <span>${message.message}</span>`,
                        message.participant.id,
                        message.timeMiliSeconds
                    );
                    this.messageList.scrollTop = this.messageList.scrollHeight
                }
                break;

            case messageEvents.MESSAGE_EDIT:
                break;

            case messageEvents.MESSAGE_DELIVERY:
                break;

            case messageEvents.MESSAGE_SEEN:
                break;

            default:
                break;
        }
    }

    increementBadge() {

        if (this.callStatus == callStatus.MESSAGE)
            return;

        if (this.newMessage == 0)
            this.badgeElement.classList.remove('display-none');

        this.newMessage += 1;
        this.badgeElement.innerHTML = this.newMessage;
    }

    chatState_eventHandler(chatState) {


        let chatStatTitle = '';

        switch (chatState.socketState) {
            case socketStateType.CONNECTING:
                chatStatTitle = "در حال اتصال"
                break;
            case socketStateType.OPEN:
                chatStatTitle = "آنلاین";
                break;
            case socketStateType.CLOSED:
                chatStatTitle = "آفلاین";
                break;
            case socketStateType.CLOSING:
                chatStatTitle = "در حال قطع شدن";
                break;
            default:
                break;
        }

        this.socektStatus.innerHTML = chatStatTitle;

    }

    call_eventHandler(event) {

        this.log('call event occured!!');
        this.log(event);
        var type = event.type;


        switch (type) {
            case callEvents.RECEIVE_CALL:

                clearTimeout(this.receiveCallTimeout);

                this.call_received(event.result.callId);
                this.callId = event.result.callId;
                this._initInterval();
                this._clearCallDiv();
                this.log('rec callId:' + this.callId);
                this.callStartedTimeout = this.setCallTimeout(this.options.callStartedTimeout);
                if (this.options.receiveCallback) {
                    this.options.receiveCallback(event);
                }

                break;
            case callEvents.CALL_SESSION_CREATED:
                clearTimeout(this.receiveCallTimeout);
                this.log('call session created!!!');
                this._clearCallDiv();
                this.callId = event.result.callId;
                this.log('session callId:' + this.callId);
                this.callStartedTimeout = this.setCallTimeout(this.options.callStartedTimeout);
                break;
            case callEvents.CALL_STARTED:
                clearTimeout(this.callStartedTimeout);
                clearTimeout(this.receiveCallTimeout);
                this.log('call sarted!!!');
                this._initInterval();
                this.callElement.innerHTML = '';
                this.callStatus = callStatus.CALLSTREAM;
                this._changeCallStatus(callStatus.CALLSTREAM);

                break;

            case callEvents.CALL_ENDED:
                this.log('call ended!!!');
                this._clearCallDiv();
                clearInterval(this.callDurationInterval);
                break;
            case callEvents.POOR_VIDEO_CONNECTION:
                this.poorConnection();
                break;
            case callEvents.POOR_VIDEO_CONNECTION_RESOLVED:
                this.poorConnectionResolved();
                break;
            case callEvents.CALL_DIVS:
                const {
                    uiLocalVideo,
                    uiLocalAudio,
                    uiRemoteElements
                } = event.result;

                uiLocalVideo.classList.add('pic-in-pic');
                uiRemoteElements[0]["uiRemoteVideo"].classList.add('full-screen');
                break;
            case callEvents.CALL_ERROR:
                break;
            default:
                break;
        }
    }

    call_received(callId) {

        this.chatAgent.acceptCall({
            callId: callId,
            video: true,
            mute: false
        }, (res) => {
            this.log('call accepted!')
        });

        this.callStatus = callStatus.CALLSTREAM;

    }

    _changeCallStatus(call) {

        if (call == callStatus.CALLSTREAM) {

            this.hostElement.querySelector('.call-stream').classList.remove('display-none');
            this.hostElement.querySelector('.call-stream').classList.add('d-flex-column');

            this.hostElement.querySelector('.call-home').classList.remove('d-flex-column');
            this.hostElement.querySelector('.call-home').classList.add('display-none');

            this.hostElement.querySelector('.poor-connection').classList.remove('d-flex-column');
            this.hostElement.querySelector('.poor-connection').classList.add('display-none');
        }
        else if (call == callStatus.POOR_CONNECTION) {

            this.hostElement.querySelector('.call-home').classList.remove('d-flex-column');
            this.hostElement.querySelector('.call-home').classList.add('display-none');

            this.hostElement.querySelector('.poor-connection').classList.remove('display-none');
            this.hostElement.querySelector('.poor-connection').classList.add('d-flex-column');

            this.hostElement.querySelector('.call-stream').classList.remove('d-flex-column');
            this.hostElement.querySelector('.call-stream').classList.add('display-none');
        }
    }

    poorConnection() {

        this.chatAgent.pauseCamera();

        if (this.callStatus == callStatus.CALLSTREAM) {
            this.hostElement.querySelector('.call-stream').classList.remove('d-flex-column');
            this.hostElement.querySelector('.call-stream').classList.add('display-none');
        }
        else if (this.callStatus == callStatus.MESSAGE) {
            this.hostElement.querySelector('.messages').classList.remove('d-flex-column');
            this.hostElement.querySelector('.messages').classList.add('display-none');
        }
        this.hostElement.querySelector('.poor-connection').classList.remove('display-none');
        this.hostElement.querySelector('.poor-connection').classList.add('d-flex-column');
    }

    poorConnectionResolved() {

        this.chatAgent.resumeCamera();


        if (this.callStatus == callStatus.CALLSTREAM) {
            this.hostElement.querySelector('.call-stream').classList.remove('display-none');
            this.hostElement.querySelector('.call-stream').classList.add('d-flex-column');
        }
        else if (this.callStatus == callStatus.MESSAGE) {
            this.hostElement.querySelector('.messages').classList.remove('display-none');
            this.hostElement.querySelector('.messages').classList.add('d-flex-column');
        }
        this.hostElement.querySelector('.poor-connection').classList.remove('d-flex-column');
        this.hostElement.querySelector('.poor-connection').classList.add('display-none');

    }

    toggleCam(event) {


        if (this.callId == 0 || !this.callId)
            return;

        this.isCamOn = !this.isCamOn;
        let camBtn = this.hostElement.querySelector('.video');

        if (this.isCamOn) {

            camBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="vb-icon" width="36" height="24" style=""><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/>
                        <defs>
                            <filter id="m0ghs82paa" width="276.3%" height="276.3%" x="-88.9%" y="-85.7%" filterUnits="objectBoundingBox">
                               <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1"/>
                               <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="12"/>
                               <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.357143589 0"/>
                              <feMerge>
                              <feMergeNode in="shadowMatrixOuter1"/>
                              <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                      </filter>
                       </defs>           
                        <g class="currentLayer" style=""><title>Layer 1</title><g fill="none" fill-rule="evenodd" id="svg_1" class="">
                           <g fill="#252525" fill-rule="nonzero" id="svg_2">
                               <g id="svg_3">
                              <g filter="url(#m0ghs82paa)" transform="translate(-83,0) translate(136,709) " id="svg_4">
                                  <path d="M-31.76600030517578,-684.7960087890625 c3.531,0 5.625,-2.047 5.625,-5.579 v-2.25 l5.6880000000000015,4.782 c0.5780000000000002,0.4840000000000001 1.218,0.812 1.828,0.812 c1.218,0 2.03,-0.906 2.03,-2.234 V-704.5310087890625 c0,-1.328 -0.812,-2.234 -2.03,-2.234 c-0.6100000000000002,0 -1.25,0.3280000000000001 -1.828,0.812 l-5.6880000000000015,4.766 v-2.235 c0,-3.5460000000000003 -2.094,-5.578 -5.625,-5.578 h-15.61 c-3.39,0 -5.6240000000000006,2.032 -5.6240000000000006,5.578 V-690.3740087890625 c0,3.532 2.093,5.578 5.625,5.578 h15.61 zm-0.3900000000000001,-2.016 H-46.98600030517578 c-2.468,0 -3.8600000000000003,-1.2810000000000001 -3.8600000000000003,-3.89 V-703.0940087890625 c0,-2.6100000000000003 1.3920000000000001,-3.891 3.8600000000000003,-3.891 h14.828 c2.47,0 3.8600000000000003,1.2810000000000001 3.8600000000000003,3.89 v12.391 c0,2.6100000000000003 -1.3900000000000001,3.89 -3.8600000000000003,3.89 zm13.187,-2.625 c-0.15600000000000006,0 -0.281,-0.09400000000000006 -0.453,-0.21900000000000006 l-6.719,-5.516 v-3.468 l6.719,-5.5 c0.17200000000000001,-0.14 0.2970000000000001,-0.21900000000000006 0.453,-0.21900000000000006 c0.203,0 0.2970000000000001,0.15600000000000006 0.2970000000000001,0.4220000000000001 v14.078 c0,0.266 -0.09400000000000006,0.4220000000000001 -0.2970000000000001,0.4220000000000001 z" id="svg_5"/>
                              </g>
                               </g>
                             </g>
                            </g>
                        </g>
                    </svg>`;

            this.chatAgent.resumeCamera();

        } else {
            camBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="vb-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" /> <line x1="1" y1="1" x2="23" y2="23" /> </svg>';
            this.chatAgent.pauseCamera();
        }

    }

    toggleMic(event) {

        this.isMicOn = !this.isMicOn;
        let micBtn = this.hostElement.querySelector('.mic');

        if (this.isMicOn) {
            micBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="vb-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>';
            this.chatAgent.resumeMice();
        } else {
            micBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="vb-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic-off"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>';
            this.chatAgent.pauseMice();
        }
    }

    endCall() {

        this.log('callId:' + this.callId);
        this.chatAgent.endCall({
            callId: this.callId
        }, (res) => {

        });
        if (this.endCallback)
            this.endCallback();

        this.dispose();
    }

    cancelCall() {

        if (this.callId) {
            this.chatAgent.endCall({
                callId: this.callId
            }, function (res) {
                console.log({ res });
            });

        }

        if (this.cancelCallback)
            this.cancelCallback();

        this.dispose();
    }

    dispose() {

        this._clearCallDiv();
        if (!this.isDisposed && this.chatAgent) {

            this.callId = 0;
            this.threadId = 0;
            this.chatAgent.off('callEvents', this.callListener);
            this.chatAgent.off('messageEvents', this.messageListener);
            this.chatAgent.off('chatState', this.chatStateListener);
            this.isDisposed = true;
            clearInterval(this.callDurationInterval)
            clearTimeout(this.receiveCallTimeout);
            clearTimeout(this.callStartedTimeout);
        }

    }

    _milisecondToTime(ms) {
        let delim = ':';
        const showWith0 = value => (value < 10 ? `0${value}` : value);
        const hours = showWith0(Math.floor((ms / (1000 * 60 * 60)) % 60));
        const minutes = showWith0(Math.floor((ms / (1000 * 60)) % 60));
        const seconds = showWith0(Math.floor((ms / 1000) % 60));
        return `${parseInt(hours) ? `${hours}${delim}` : ""}${minutes}${delim}${seconds}`;
    }

    _initInterval() {
        if (this.callDurationInterval != null)
            return;
        this.totalTime = 0;
        this.callDurationInterval = setInterval(() => {
            this.totalTime += 1;
            this.hostElement.querySelector('.call-duration lable').classList.remove('display-none');
            this.hostElement.querySelector('.call-duration lable span').innerHTML = this._milisecondToTime(this.totalTime * 1000);
        }, 1000);
    }

    _clearCallDiv() {
        this.hostElement.querySelector('#vb-call-container').innerHTML = '';
    }

    log(str) {
        if (this.options.consoleLogging) {
            console.log(str);
        }
    }
}

