//Background rules
"use strict";

//Initialize
a.init();
a.generic();

//Rules
{
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/344
    const genPayload = (csid, caid, cbfn) => {
        //Event callbacks are blocked by List
        let payload = `(() => {
            "use strict";
            window.console.log("A request to mmod.v.fwmrm.net is locally loopbacked by uBlock Protector.");
            ${cbfn}({
                version: "1",
                networkId: "100",
                parameters: [
                    {
                        name: "autoloadExtensions",
                        category: "profile",
                        value: "https://jspenguin.com/API/uBlockProtector/Solutions/MoatFreeWheelJSPEM.js",
                    },
                ],
                rendererManifest: {
                    adRenderers: {
                        version: "1",
                        adRenderer: [
                            {
                                name: "g_html5_null",
                                url: "class://NullRenderer",
                                contentType: "null/null,",
                                adUnit: "video,linear-animation,generic-overlay,app-interstitial,",
                                slotType: "preroll,midroll,postroll,overlay,display,pause_midroll,",
                                creativeApi: "None,",
                            },
                        ],
                    },
                },
                visitor: {
                    httpHeaders: [],
                    state: [],
                },
                errors: {
                    errors: [],
                },
                eventCallbacks: {
                    eventCallbacks: [
                        {
                            url: "https://jspenguin.com/API/uBlockProtector/Solutions/Blocked.php",
                            type: "GENERIC",
                            use: "BASE",
                            showBrowser: false,
                            trackingUrls: [],
                        },
                    ],
                },
                ads: {
                    ads: [],
                },
                siteSection: {
                    customId: "${csid}",
                    videoPlayer: {
                        videoAsset: {
                            eventCallbacks: [
                                {
                                    url: "https://jspenguin.com/API/uBlockProtector/Solutions/Blocked.php",
                                    name: "videoView",
                                    type: "IMPRESSION",
                                    use: "OVERRIDE",
                                    showBrowser: false,
                                    trackingUrls: [],
                                },
                            ],
                            customId: "${caid}",
                            networkId: "100",
                            adSlots: [
                                {
                                    eventCallbacks: [
                                        {
                                            url: "https://jspenguin.com/API/uBlockProtector/Solutions/Blocked.php",
                                            name: "slotImpression",
                                            type: "IMPRESSION",
                                            use: "OVERRIDE",
                                            showBrowser: false,
                                            trackingUrls: [],
                                        },
                                        {
                                            url: "https://jspenguin.com/API/uBlockProtector/Solutions/Blocked.php",
                                            name: "slotEnd",
                                            type: "IMPRESSION",
                                            use: "OVERRIDE",
                                            showBrowser: false,
                                            trackingUrls: [],
                                        },
                                    ],
                                    customId: "1000",
                                    selectedAds: [],
                                    timePosition: "0",
                                    timePositionClass: "preroll",
                                    adUnit: "preroll",
                                },
                            ],
                        },
                        adSlots: [],
                    },
                    adSlots: [],
                },
            });
        })();`;
        return "data:text/javascript;base64," + btoa(payload);
    };
    //Matchers
    const reCsid = /csid=([^&]+)/;
    const reCaid = /caid=([^&]+)/;
    const reCbfn = /cbfn=([^&]+)/;
    //Loopback ads request
    a.dynamicServer(
        [
            "http://mmod.v.fwmrm.net/ad/g/*",
        ],
        [
            "script",
        ],
        (details) => {
            const csid = reCsid.exec(details.url);
            const caid = reCaid.exec(details.url);
            const cbfn = reCbfn.exec(details.url);
            if (csid && caid && cbfn) {
                return { redirectUrl: genPayload(csid[1], caid[1], decodeURIComponent(cbfn[1])) };
            } else {
                //Block the request as a fallback
                console.log("Could not extract parameters from a request to mmod.v.fwmrm.net");
                a.debugMode && console.log(details);
                return { cancel: true };
            }
        },
        [
            "ncaa.com",
        ],
    );
}
