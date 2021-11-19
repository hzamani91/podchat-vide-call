const callContainer = document.createElement('div');
callContainer.style.height = '100%';
callContainer.innerHTML = `
<style>
    .call-main-container{
        width:100%;
        height:100%;
        -webkit-backdrop-filter: blur(5px);
        backdrop-filter: blur(5px);
        background-color: rgba(0, 0, 0, 0.7);
        position:relative;
        display:flex;
        direction:rtl;
    }
    .d-flex-column{
       flex:1;
       display:flex !important;
       flex-direction: column !important;
    }
    .call-stream {
        position:relative
    }
    .call-home{
        align-items: center;
        justify-content: center;
    }
    .poor-connection{
        position:absolute;
        top:0px;
        right:0px;
        left:0px;
        width:100%;
        height:100%;
        background: gray;
        align-items: center;
        justify-content: center;
        z-index:9999;
    }
    .poor-connection h2{
        font-size: 0.9rem;
        margin-top:5px;
    }
    .socket-status{
        position:absolute;
        top:5px;
        right:5px;
        background-color: white;
        height:40px;
        display:flex;
        justify-content:center;
        align-items: center;
        width:70px;
    }
    #vb-call-container{
        flex:1;
        width:100%
    }
    .wrapper-video{
        position:relative;
    }

    .pic-in-pic {
        position:absolute !important;
        bottom:80px  !important;
        right:5px  !important;
        border: 1px solid white;
        border-radius:5px ;
        height:150px  !important;
        width:100px !important;
        background-color:whitesmoke;
        object-fit:cover;
        z-index:9999;    
    }

    .video-rotate{
        transform: rotate(90deg);
        transform-origin: bottom right;
        visibility: visible;
    }
    .wrapper-video audio{
        display:none
    }
    .full-screen{
        width: 100% !important;
        height:100%;
        object-fit: cover;
        background-size: cover;
    }

    .caller-info{
        padding:5px;
        font-size: 13px;
    }

   .call-header{
     display: flex;
     position: absolute;
     top: 0px;
     width: 100%;
     height: 50px;
     align-items: center;
     padding: 2px;
     background: gray;
     opacity: 0.7;
     z-index:9999;
   }
    .color-transparent{
        background: transparent !important;
    }

    .footer-call{
        display:flex;
        justify-content:center;
        position:absolute;
        bottom:0px;
        width:100%;
        height:70px;
        text-align:center
    }
    .call-duration{  
        display:flex;
        align-items:center;  
        height:25px;
        flex: 0 0 70px;
        color:gray;
        text-align:center;
        z-index:9999;
        background-color:whitesmoke;
        border: 1px solid whitesmoke;
        border-radius:20px;  
    }
   

    .call-duration lable{
        padding:5px;  
        min-width:80px;
        max-width:95%;
        font-size:13px;
       
    }
    .call-duration lable span{
        margin:auto;
    }
    .circle-btn{
        width:55px;
        height:55px;
        border-radius: 50%;
        border: 0px;
        display:flex;
        align-items: center;
        justify-content: center;
        outline:none;
    }
    .margin-5{
        margin:5px
    }
    .margin-8{
        margin:8px
    }
    .msg-badge{
        text-align:center;
        height:20px;
        width:20px;
        background-color: red;
        color:white;
        border-radius:10px;
        position: absolute;
        left: 1px;
        top:1px;
        z-index:999;
    }
    .video{
        background-color : #ffff;
        color: white;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5);
    }
    .end-call ,.pc-end-call{
        background-color : #ff415d;
        color: white;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5);
    }

    .cancel-call{
        background-color : #ff415d;
        color: white;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5);
    }
    .bgc-white{
        background-color : white;
        color : black;
    }

    .bgc-green{
        background-color : green !important;
        color : white;
    }

    .messages{
       background-color : white;
       width : 100%;
       display: flex;
       flex-direction: column;    
       text-align:right; 
    }

    .messages ul{
        list-style-type : none;
        background-color:#f5f5f5;
        padding: 2px;
        flex: 1 1 200px !important;
        overflow :auto;
    }
    .messages ul li{
        
        color: #455a64;
        min-height :40px;
        margin: 5px;
        display:flex;
        text-align:right;
        padding :5px;
        
    }
    
    .msgitem {
        padding:5px;
        border-radius:5px;
        max-width:50%;
        min-width:20%;
        word-wrap: break-word;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.19);
    }
    .content-left{
        justify-content:flex-end
    }
   
    .msg-send{
        background-color:#c8e6c9;
    }
    .msg-receive{
        background-color:#ffff;
    }
    .close-bar{ 
        display:flex;
        align-items:center;
        padding : 5px;
        flex: 0 0 30px;
        text-align : left;
    }
    .participant{
        flex:1;
        text-align:center;
    }

    .send-message{
        background-color:#e1f5fe;
    }

    .message-input{
        flex: 0 0 40px;
        display:flex;
        align-items:center;
        justify-content: center;
        padding: 4px  15px;
        border: 0.5px solid #eeeeee;
        margin: 5px;
        border-radius: 10px;
    }
    .close-btn{
        width:40px;
        height:40px;
        border: 0px;
        background-color:transparent;
    }

    .input{
        height:40px;
        border:none;
        outline:none;
        padding:4px;
        flex:1;
        text-align:right;
    }
    
    .display-none {
        display : none
    }
    .message {
        position:relative;
        background-color:#f5f5f5;
    }
    .loading{
        width: 100px;
        height: 100px;
        margin: 20px;
        
    }
    .vb-icon{
        margin:auto;
        vertical-align:middle;
    }
    .vb-color-white{
        color:white;
    }
    .waiting{
        font-size:0.9rem;
    }
    .poor-connection h2{
        padding:5px;
        text-align:center;
        font-size: 0.8rem !important;
    }
</style>
<div class='call-main-container'>
    <div class='poor-connection display-none'>
        <svg width="100" height="100" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
           <g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
               <circle cx="22" cy="22" r="6" stroke-opacity="0">
                   <animate attributeName="r"
                        begin="1.5s" dur="3s"
                        values="6;22"
                        calcMode="linear"
                        repeatCount="indefinite" />
                   <animate attributeName="stroke-opacity"
                        begin="1.5s" dur="3s"
                        values="1;0" calcMode="linear"
                        repeatCount="indefinite" />
                   <animate attributeName="stroke-width"
                        begin="1.5s" dur="3s"
                        values="2;0" calcMode="linear"
                        repeatCount="indefinite" />
               </circle>
               <circle cx="22" cy="22" r="6" stroke-opacity="0">
                   <animate attributeName="r"
                        begin="3s" dur="3s"
                        values="6;22"
                        calcMode="linear"
                        repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity"
                        begin="3s" dur="3s"
                        values="1;0" calcMode="linear"
                        repeatCount="indefinite" />
                       <animate attributeName="stroke-width"
                        begin="3s" dur="3s"
                        values="2;0" calcMode="linear"
                        repeatCount="indefinite" />
               </circle>
               <circle cx="22" cy="22" r="8">
                   <animate attributeName="r"
                        begin="0s" dur="1.5s"
                        values="6;1;2;3;4;5;6"
                        calcMode="linear"
                        repeatCount="indefinite" />
               </circle>
           </g>
        </svg>
        <h2 class="vb-color-white"  >ارتباط شبکه ضعیف است.</h2>
        <h2 class="vb-color-white"  > تصویر بصورت موقت قطع گردید.</h2>
        <button type='button' class='circle-btn margin-8 pc-end-call' >   
            <svg xmlns="http://www.w3.org/2000/svg" class='vb-icon' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </button>       
    </div>
    <div class='call-home d-flex-column'>
         <div class='socket-status'>
            <span class='socket-status-content'></span>
         </div>
        <svg class='loading' version="1.1" id="L2" xm5lns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
            <circle fill="none" stroke="#81c784" stroke-width="4" stroke-miterlimit="10" cx="50" cy="50" r="48"></circle>
            <line fill="none" stroke-linecap="round" stroke="#81c784" stroke-width="4" stroke-miterlimit="10" x1="50" y1="50" x2="85" y2="50.5">
                 <animateTransform attributeName="transform" dur="2s" type="rotate" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
            </line>
            <line fill="none" stroke-linecap="round" stroke="#81c784" stroke-width="4" stroke-miterlimit="10" x1="50" y1="50" x2="49.5" y2="74">
                 <animateTransform attributeName="transform" dur="15s" type="rotate" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
            </line>
        </svg>
        <h2 class="vb-color-white waiting" >در حال برقرای تماس منتظر بمانید</h2>
        <button type='button' class='circle-btn margin-8 cancel-call' >   
            <svg xmlns="http://www.w3.org/2000/svg" class='vb-icon' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </button>
    </div>
    <div class='call-stream  display-none'>
        <div class="call-header vb-color-white">
            <div class='call-duration'>
             <lable class='display-none'>
                <span></span>
                </lable>
             </div>
             <div class="caller-info">
                <span></span>
             </div>
        </div>   
        <div class='wrapper-video' id='vb-call-container'>
        </div>
        
        <div class='footer-call'>
            <button type='button' class='circle-btn margin-8 message' >
                 <span class='msg-badge display-none'></span>
                 <svg xmlns="http://www.w3.org/2000/svg" class='vb-icon' width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <button type="button" class="circle-btn margin-8 mic">
            <svg xmlns="http://www.w3.org/2000/svg" class="vb-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            </button>  
            <button type='button' class='circle-btn margin-8 end-call' > 
            <svg xmlns="http://www.w3.org/2000/svg" class='vb-icon'  width="43" height="43" style="">
                <rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/>
                <defs>
                        <filter id="9hesgmcrra" width="276.3%" height="276.3%" x="-88.9%" y="-85.7%" filterUnits="objectBoundingBox">
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
                    <g fill="#FFF" fill-rule="nonzero" id="svg_2">
                     <g id="svg_3">
                     <g filter="url(#9hesgmcrra)" transform="translate(-83,0) translate(239,709) " id="svg_4">
                    <path d="M-95.48342335510253,-639.5389745788574 c1.06,0 2.048,-0.18800000000000008 2.965,-0.5640000000000003 c0.917,-0.37600000000000017 1.7400000000000002,-0.974 2.47,-1.794 c0.42000000000000015,-0.47900000000000015 0.7600000000000003,-0.991 1.016,-1.538 s0.3850000000000002,-1.1 0.3850000000000002,-1.6580000000000006 c0,-0.41000000000000014 -0.08600000000000005,-0.809 -0.257,-1.196 c-0.17,-0.3880000000000002 -0.455,-0.7180000000000003 -0.8540000000000003,-0.991 l-4.973,-3.521 c-0.3880000000000002,-0.28500000000000014 -0.7440000000000003,-0.49000000000000016 -1.068,-0.6150000000000003 c-0.3250000000000002,-0.126 -0.6360000000000003,-0.18800000000000008 -0.932,-0.18800000000000008 c-0.36400000000000016,0 -0.7200000000000003,0.1 -1.068,0.29900000000000015 c-0.3470000000000003,0.2 -0.7040000000000003,0.48700000000000015 -1.068,0.8630000000000003 l-1.18,1.1280000000000001 c-0.15900000000000009,0.17 -0.36400000000000016,0.256 -0.6150000000000003,0.256 c-0.125,0 -0.24400000000000008,-0.02000000000000001 -0.35800000000000015,-0.06000000000000003 c-0.11400000000000005,-0.04000000000000002 -0.21100000000000008,-0.07700000000000004 -0.29000000000000015,-0.11000000000000004 c-0.514,-0.274 -1.166,-0.7470000000000003 -1.9580000000000002,-1.42 c-0.792,-0.6710000000000006 -1.586,-1.4060000000000001 -2.384,-2.204 c-0.809,-0.797 -1.55,-1.5950000000000002 -2.221,-2.392 c-0.6730000000000006,-0.798 -1.1400000000000001,-1.447 -1.4020000000000001,-1.949 c-0.04500000000000003,-0.09000000000000007 -0.08800000000000006,-0.19000000000000009 -0.128,-0.29900000000000015 c-0.04000000000000002,-0.10800000000000004 -0.06000000000000003,-0.23 -0.06000000000000003,-0.36700000000000016 c0,-0.24000000000000007 0.08600000000000005,-0.43900000000000017 0.257,-0.5980000000000003 l1.145,-1.162 c0.36400000000000016,-0.37600000000000017 0.6490000000000004,-0.7380000000000003 0.8540000000000003,-1.086 c0.20500000000000004,-0.3470000000000003 0.30800000000000016,-0.7090000000000003 0.30800000000000016,-1.085 c0,-0.29600000000000015 -0.06600000000000004,-0.6060000000000003 -0.1970000000000001,-0.931 c-0.13,-0.3250000000000002 -0.3330000000000003,-0.6800000000000006 -0.6070000000000003,-1.068 l-3.503,-4.905 c-0.273,-0.3990000000000003 -0.6100000000000003,-0.6920000000000006 -1.008,-0.8800000000000003 c-0.3990000000000003,-0.18800000000000008 -0.8260000000000003,-0.28200000000000014 -1.282,-0.28200000000000014 c-1.117,0 -2.159,0.467 -3.127,1.401 c-0.798,0.7640000000000003 -1.379,1.6070000000000002 -1.7440000000000002,2.5300000000000002 c-0.36400000000000016,0.922 -0.546,1.9020000000000001 -0.546,2.939 c0,1.56 0.36100000000000015,3.207 1.085,4.939 c0.7230000000000003,1.7320000000000002 1.7120000000000002,3.46 2.965,5.187 c1.2530000000000001,1.726 2.672,3.375 4.255,4.947 c1.561,1.584 3.213,3.008 4.956,4.273 c1.743,1.264 3.487,2.2640000000000002 5.23,2.999 c1.743,0.7350000000000003 3.39,1.102 4.939,1.102 z" transform="rotate(-225 -134.58041381835943,-687.5809936523436) translate(-30.79958152770996,-32.88356399536133) " id="svg_5"/>
                    </g>
                  </g>
                 </g>
                 </g></g>
             </svg>
            </button>
            <button type='button' class='circle-btn margin-8 video' >
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
                    </g></g></svg>
            </button>
        </div>
    </div>
    <div class='messages  display-none'>
        <div class='close-bar'>
            <span class="participant"></span>
            <button type='button' class='bgc-white close-btn' >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                     stroke-width="2"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     class="vb-icon"
                     >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
            </button>
        </div>
        <ul class='messages-list'>
        </ul>
        <div class='message-input'>
            <button type='button' class='bgc-green circle-btn send-message' >
                 <svg
                 class="vb-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                 stroke-linecap="round"
                stroke-linejoin="round">
               <line x1="5" y1="12" x2="19" y2="12" />
               <polyline points="12 5 19 12 12 19" />
                </svg>
            </button>
            <input type='text' class="input" placeholder="متن پیام" />
            
        </div>
    </div>
</div>
`;

export{ callContainer };