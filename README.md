## Javascript component for podchat video call

With `pod chat-video-call` you can use video/voice call from Pod platform, without any headache for configurations.

Installation:
```
npm install podchat-video-call
```
Import reference:

```
import VideoCall from 'podchat-video-call';
```

How to use:

``` js
import * as PodChat from 'podchat-browser';

function main(){

    var params = {
    
     ... // as usual
     
      callOptions: {
        callSocketAddress: "wss://46.32.6.187",
        callTurnIp: "46.32.6.188",
        callDivId: "call-div",
        callAudioTagClassName: "podcall-audio",
        callVideoTagClassName: "podcall-video"
      },
      ....
    };

    this.chatAgent = new PodChat(params);
  	let videoCall= initVideoComponent();
    this.chatAgent.on("chatReady", () => {
    	videoCall.setChatAgent(this.chatAgent);
   		videoCall.call(
        {
          threadId: "thread id" // the thread id that use for call ,
           invitees: [
             		 {
               			 "id": 'username',
               			 "idType": "TO_BE_USER_USERNAME"
             		 }],
         type: "VIDEO"
       });

    });
      
  });
   
}

 function initVideoComponent(){
    let videoCall = new VideoCall(
   'call-container', // HTML element ID that you want to load video  component on it.
    {
      endCallback: endCall ,// this event will raise when video call is ended
      cancelCallback: cancelCall //// this event will raise when  video call is canceled
    });

   videoCall.render();
   return videoCall;
 }


function endCall(){

} 


```

## Full example
Below code show full example of podchat video call that set all required parameters and functions


``` js
import * as PodChat from 'podchat-browser';

function main(){

    var params = {
      appId: "appId",
      /**
       * Sand Box
       */
      socketAddress: "wss://chat-sandbox.pod.ir/ws",
      ssoHost: "https://accounts.pod.ir",
      platformHost: "https://sandbox.pod.ir:8043/srv/basic-platform",
      fileServer: 'https://core.pod.ir',
      podSpaceFileServer: 'https://podspace.pod.ir',
      serverName: "chat-server",

      token: 'token',// pod token
      grantDeviceIdFromSSO: false,
      enableCache: false,
      fullResponseObject: true,
      typeCode: "default",
      wsConnectionWaitTime: 500,
      connectionRetryInterval: 5000,
      connectionCheckTimeout: 10000,
      messageTtl: 24 * 60 * 60,
      reconnectOnClose: true,
      httpRequestTimeout: 30000,
      httpUploadRequestTimeout: 0,
      forceWaitQueueInMemory: true,
      asyncRequestTimeout: 20000,
      callOptions: {
        callSocketAddress: "wss://46.32.6.187",
        callTurnIp: "46.32.6.188",
        callDivId: "call-div",
        callAudioTagClassName: "podcall-audio",
        callVideoTagClassName: "podcall-video"
      },
      asyncLogging: {
        onFunction: true,
        consoleLogging: true,
        onMessageReceive: false,
        onMessageSend: false,
        actualTiming: false
      }
    };

    this.chatAgent = new PodChat(params);
  	let videoCall= initVideoComponent();
    this.chatAgent.on("chatReady", () => {
    	videoCall.setChatAgent(this.chatAgent);
   		 var Params = {
     		 invitees: [
        	{
        	  "id": 'username',
       		  "idType": "TO_BE_USER_USERNAME"
       	 }],
   		 };

	    this.chatAgent.createThread(Params, (createThreadResult) => {
      	
     		if (!createThreadResult.hasError) {
        	
      	 	 this.threadId = createThreadResult.result.thread.id;       		 
      		 		videoCall.call(
       		 	 	 {
          		 	 threadId: this.threadId,
           			 invitees: [
             		 {
               		 "id": 'username',
               		 "idType": "TO_BE_USER_USERNAME"
             		 }],
            		type: "VIDEO"
         		 });
     		 } else {
       			 console.log('thread creation failed!!!')
    	  	}
          
     	 	if (createThreadResult.errorCode == 21) {
     	 	 console.log('unauthenticated user!!!')
      		}

    });
      
  });

  this.chatAgent.on("error", (err) => {
     console.error(err);

    }); 
   
}

 function initVideoComponent(){
    let videoCall = new VideoCall(
   'call-container', // HTML element ID that you want to load video 
    component on it.
    {
      endCallback: endCall, // this event will raise when video call is ended
      cancelCallback: cancelCall //// this event will raise when  video call is canceled
    });

   videoCall.render();
   return videoCall;
 }


function endCall(){

} 

fuction cancelCall(){
  
}

```


