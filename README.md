# TiC
********************* 

__TiC__ (Touch-interface-Click) is a jQuery plugin for managing touch UI.   
Copyright 2012, Matt Sahr.  Dual licensed under MIT and GPLv2     
Demo Page: [TiC.demo-look.info](http://tic.demo-look.info)
	
	<div id="wrapperDiv">
		<div class="TiC" data-tic-action="myFunction">Tap me!</div>
		<div class="TiC" data-tic-action="otherFunction">Tap me!</div>
	</div>
	<script type="text/javascript">
			$('#wrapperDiv').TiC();			
	</script>

TiC passes click/touch events from DOM elements to functions.    Any DOM element with [ class="TiC" ] can be set up to fire touch events.  It also plays nicely in non-touch environments.

__Fix Slow Clicks__   
Touch screen browsers by default provide a slow click response, which makes your webpage/app feel sluggish and... non-appy.  TiC speeds this up.

__Touchstart First__   
TiC default behavior is to fire on "touchstart" in touch environments, fall back to fast-click behavior where necessary, and fall further back to "click" events in a mouse environment.  Touchstart is the snappiest, fastest UI, but sometimes it it happens _too_ fast, is too sensitive or aggressive.   

The most common reason to avoid "touchstart" is that an element lives inside a scrollable area, in which case the user wants to __scroll__ but they end up also __clicking buttons__.  There are other circumstances where "touchstart" might be just too reactive.   

__Fast Click Fallback__   
In cases where the "touchstart" event is too much, an element can be set to "click" instead.  When an element is set for "click", but it lives in a touch environment, a "fastClick" approach is applied so that the the event happens faster than the regular, awful, slow click behavior.  The "fastClick" code is based on Assanka.net's [FastClick](http://assanka.net/content/tech/2011/08/26/fastclick-native-like-tapping-for-touch-apps/) and Matteo Spinelli's [NoClickDelay](http://cubiq.org/remove-onclick-delay-on-webkit-for-iphone).

__Centralize UI Dispatch__   
Once you've got your "click" in hand as it were, there's still a question of organization.  Larger apps can get chaotic without a centralized dispatch.  Or so I've heard.  TiC is a fairly flexible, standardized way to call functions.  All the UI details are stored on the DOM element as [ data ] declarations.  

**************************

### Dependencies  ###

__jQuery 1.7 or later__   
The plugin uses the "on" event, so jQuery 1.7 or higher is necessary.

 
__Tiny Pub/Sub__  
Ben Alman's "_Tiny Pub/Sub_" plugin is included with TiC.  However, it is quite possible to ignore the pub/sub pattern and use Tic with "direct" function calls.  This document covers the "direct" approach first.

* * *


###The Basics
You generally call TiC on a wrapper object.  Here's the minimal setup.

	<div id="wrapperDiv">
		<div class="TiC" data-tic-action="myFunction">
			Do something!
		</div>
	</div>
	<script>
		$(document).ready(function(){
			$("#wrapperDiv").TiC();
		}); 

		var myFunction = function() {
			alert('Did something!');
		};
	</script>

Multiple TiC setups can be used, each one called on a different wrapper div.  Alternatively, you can call TiC on the document "body" to handle all interface duties.  The jQuery docs suggest that loading event handlers onto the document body root can make the page sluggish, but the whole point of TiC centralization is that you only need to call this one listener to handle all the click UI.  Your mileage may vary.

	$("#wrapperDiv").TiC();  // basic call
	$("#wrapperNo2").TiC();  // you can call it on multiple wrappers
	    //  ...or... 
	$("body").TiC();         // one TiC event handler for the body 

__Do Not Nest__   
TiC is an event handler based on jQuery's "on" delegation.  It does not prevent event bubbling within the TiC wrapper -- does not, for instance, call __event.preventDefault();__  in any useful, per-DOM-element way.  Since TiC events bubble, you don't want to nest TiC calls, as it can end up firing events twice (or more).  In other words, if your html looks like this, it will be troublesome...

	<div id="wrapperDiv">
		<div id="wrapperInside">  <!-- this div is nested -->
		</div>
	</div>

	<script>
		$("#wrapperDiv").TiC();  
		$("#wrapperInside").TiC();  // This call is nested!  Bad!
	</script>

__Click Option: Wrapper-wide fast-click__   
In some cases (such as inside a touch-scrolling div) you will want to set up TiC to handle all wrapped events as fast-clicks.

	$("#scrollingDiv").TiC("click");

__Click Option: individual DOM element fast-click__   
If your wrapper is set up in "normal" mode (preference for "touchstart" event), you can assign individual DOM elements to use the fast-click.

	<div id="wrapperDiv">
		<div class="TiC" data-tic-action="myFunction">
			Fire on touchstart!
		</div>
		<div class="TiC" data-tic-action="myFunction" data-tic-tc="click">
			Fire on fast click!
		</div>
	</div>
	<script>
	    $("#wrapperDiv").TiC();  
	</script>
	
In an environment where you're using the "body" single TiC event handler, you could still keep your scrolling divs under control with something like this...

	$(".scrollingDiv .TiC").data({"ticTc":"click"});

__Click Option:  I REALLY just want a regular, slow click.__   
In the case where fast clicks and touchstart is problematic, you can use the "TiClick" class for DOM elements, in place of the "TiC" class.  To use "TiClick", you call Tic with an extra argument of "slowClick."

	<div id="wrapperDiv">
		<div class="TiC" data-tic-action="myFunction">
			Fire on touchstart!
		</div>
		<div class="TiC" data-tic-action="myFunction" data-tic-tc="click">
			Fire on fast click!
		</div>
		<div class="TiClick" data-tic-action="myFunction">
			Fire on regular slow click!
		</div>
	</div>
	<script>
	    $("#wrapperDiv").TiC('touchstart','slowClick');
	    //  ...or...  $("#wrapperDiv").TiC('click','slowClick');
	</script>
	
Note: Don't use both classes on a div: (__class="TiC TiClick"__) unless you want the function call to happen twice.

****************

## html "data" controls function calls and arguments ##
Once TiC is called, the webpage is listening for events on any element with a classes of "TiC" and "TiClick".  You can now build different function behavior into different elements.  

	<div id="wrapperDiv">
		<div class="TiC" data-tic-action="myFunction">
			Do something!
		</div>
		<div class="TiC" data-tic-action="otherFunction">
			Do something else!
		</div>
	</div>

__HTML5 data gotchas__   
Working with HTML5 data has a few peculiarities.  You can only use lower case in your HTML5 "data" keys, and the safe separator is a hyphen _when it's written out in the DOM_.  But when you manipulate DOM data in javascript, it becomes camelCase without hyphens.  In the above html example, you could add [data-tic-action="myFunction"] via jQuery.  If you do, it is useful to note the quirk where hyphens change to camelCase.

	$("#myDiv").data({ "tic-action" : "myFunction" });  // FAILURE (hyphen)
	$("#myDiv").data({ "ticAction"  : "myFunction" });  // CORRECT (camelCase)

__Available Options__   
You can set an individual DOM element to use click or touchstart, and you can pass up to 6 arguments to a called function (a "target" argument, and then "arg1" to "arg5").  

Why only 6 arguments?  I dunno, I ran out of interest in solving the infinite-arguments problem.  I stopped at 6. This systems lets you easily be specific about passing null arguments mixed with regular arguments.

	<div id="wrapperDiv">
		<div id="myDiv">
		</div>
	</div>

	<script>
		$("#wrapperDiv").TiC();
		$("#myDiv")
			.addClass("TiC")
			.data({ 
				"ticAction" : "myFunction",     // required
				"ticTc" : "click",	     // optional, default is "touchstart"
				"ticTarget" : "first argument",   // optional
				"ticArg1" : "second argument",    // optional
				"ticArg2" : "third argument",     // optional
				"ticArg3" : "fourth argument",    // optional
				"ticArg4" : "fifth argument",     // optional
				"ticArg5" : "sixth argument",     // optional
			 })
			.html("Click me!"); 
	</script>

You don't need jQuery to set up DOM elements.  The same TiC options can be written out in regular html...

	<div id="wrapperDiv">
		<div id="myDiv" class="TiC" data-tic-tc="click" 
		 data-tic-action="myFuction" data-tic-target="first argument" 
		 data-tic-arg1="second argument" data-tic-arg2="third argument"
		 data-tic-arg3="fourth argument" data-tic-arg4="fifth argument"
		 data-tic-arg5="sixth argument">
			Click me!
		</div>
	</div>

	<script>
		$("#wrapperDiv").TiC();
	</script>

__Deeply Nested Functions, and This-ness__   
TiC is pretty good about finding the right function called by [data-tic-action].   If you have deeply nested functions, you can use dot notation to reference them...

	<div class="TiC" data-tic-action="deeply.nested.object.contains.myFunction">
		click deep!
	</div>

Additionally, jQuery maintains the "this" reference of the clicked/touched element.  So you can let your functions affect the DOM with "this"-ness.

	var myFunction = (){
		$(this).css({'background':'red'});
		// the clicked/touched div will turn red
	}

Putting it all together:

	<div id="wrapperDiv">

		<div class="TiC" data-tic-action="myFunction">
			Do Something undefined!
		</div>

		<div class="TiC" 
			data-tic-action="tree.beehive.deep.chamber.buriedFunction"
			data-tic-target="Target Name" 
			data-tic-arg1="First Option" data-tic-arg2="Second Option">
				Do something with Arguments.
		</div>

	</div>

	<script type="text/javascript">

		$(document).ready(function(){
			$('#wrapperDiv').TiC();			
		});

		var myFunction = function(target, arg1, arg2) {
			$(this).css('background','red');
			alert( 'Something Done:  '+target+'  '+arg1+'  '+arg2 );
		};

		var tree = {
			beehive: { 
				deep: {
					chamber: {
						buriedFunction: function(target, arg1, arg2) {
							$(this).css('background','#ffcc22');
							alert( 'Something Done:  '+target+'  '+arg1+'  '+arg2 );
						}
					}
				}
			}
		};
    </script>

***********

## Pub/Sub pattern

Ben Alman's "__Tiny Pub/Sub__" plugin is included with TiC.  Full documentation for his pub/sub solution can be found in this [github gist](https://gist.github.com/661855).

To add pub/sub to TiC elements, you use: "data-tic-publish"

	<div class="TiC" data-tic-action="myFunction" data-tic-publish="true">
		click to publish!
	</div>

Using [data-tic-publish] makes a big change in how TiC hooks things up.  When you use "publish", your [data-tic-action] no longer names a function.  It names a "channel" where stuff gets published.

	<div id="wrapperDiv">
		<div class="TiC" data-tic-action="myChannel" data-tic-publish="true">
			click to publish!
		</div>
	</div>

	<script type="text/javascript">

		$(document).ready(function(){
			$('#wrapperDiv').TiC();	

			$.subscribe("myChannel", myFunction);  
			// makes "myFunction" trigger every time "myChannel" is published.

		});

		var myFunction = function(e, target, arg1arg2) {

			// notice the "e" argument.  We declare "e", and then ignore it.

			$(this).css('background','red');
			alert( 'Something Done:  '+target+'  '+arg1+'  '+args2 );
		};

    </script>

So it's pretty simple to subscribe a function to a channel.  Just one line of code.

		$.subscribe("myChannel", myFunction);

There is an important peculiarity of this pub/sub implementation that must be noted.  You'll see in the "myFunction" above that there's an extra first argument, "e".

		var myFunction = function(e, target, arg1arg2) {

And you'll see that the "e" argument doesn't actually get used or referenced for anything.  For most purposes, it can be ignored, but the event argument HAS TO be the first argument.  Other than the curious extra first argument, pub/sub functions work regularly.  However, pub/sub loses the DOM context.  See below in "router alternative" for a way to fix that.  

Again, you can get a clearer picture of the pub/sub system at Ben Alman's github [gist page](https://gist.github.com/661855).  And for other implementations of pub/sub, take a look at Addy Osmani's [gist](https://gist.github.com/1321768) writeup.  To swap in a different pub/sub system is fairly trivial (you change one line of code).  The place to do that change is in the default behavior of the "TiC.router" described below.

************


## TiC router alternatives

You can bypass the normal function-calling behavior and set up your own custom function dispatch.  The TiC router is accessed with the [data-tic-router] option.

	<div class="TiC" data-tic-action="routeMe" data-tic-router="true">
		click custom!
	</div>

Inside the TiC module, you will find this "router" function.

	router: function(){
		var args = [].slice.call(arguments);
		var action = args.shift();
		switch (action) {  
			case "routeMe": 	// example only, not necessary to keep
				myFunction.apply(this,args);
				break;
			case "localClear":  // example only, not necessary to keep
				localStorage.clear();
				break;
			default:
				$.publish( action, args );  // change me for a different pub-sub
				break;
		};

	},  // END router() function

The idea is that you can overwrite this router, and add your own handlers to the "switch" list.  Note that the router's default is to "publish" an action.

__Handle DOM "this" actions, _and then_ publish an event__   
If you want to call a custom function and THEN publish to a channel, that works too.  One reason to do this is that the pub/sub method does not maintain a "this" reference to your dom element, so you might find a situation where you want a dom-specific change, but you also want to maintain inter-module pub/sub communication.  To do both, you can write a "case" for your action, put it immediatly above the "default" case, and purposefully not include a "break" statement.  In this fashion, your handler will fire, and the action will also get published.  It would look like this:

	router: function(){
		var args = [].slice.call(arguments);
		var action = args.shift();
		switch (action) {  
		case "myCustom":
			customFunction.apply(this,args);
			//  break; //  No!  This break statement is commented out!
		default:
			$.publish( action, args );
			break;
		};
	},  // END router() function

One more note about "this"-ness.  Calling a function in the regular fashion of course works fine, but it doesn't maintain awareness of the dom element that called it:

	customFunction(args[0],args[1],args[2])
  
	var customFunction = function(){
		$(this).css('background','red');
		// nothing happens!
	}

Since jQuery allows us to carry the DOM context into the TiC.router function, we can pass along "this" by means of javascript's "apply" method.  And thus we can keep the DOM context.

	customFunction.apply(this, args)
  
	var customFunction = function(){
		$(this).css('background','red');
		// Success! DOM element turns red!
	}
***************
## Debug helpers

There is an "elements" helper to list every TiC DOM element.

	TiC.elements();  // return an array of (class="TiC") elements with data
	TiC.elements('show');  // output a list of elements in the browser

You can also access a list of the TiC events that have fired.  The first step is to set TiC.developMode to "true" so that it records events.

	TiC.developMode = true;

Then you can view fired events in the console or the browser.

	TiC.events();  // return an array of events
	TiC.events('show');  // output a list of events in the browser


***************
##Robustness and Goofy Code
Here are a few things I'm not sure about.

__1. Gymnastics to avoid using eval();__  The functions-to-be-called are stored on the DOM elements as data text strings.  The quickest way to invoke text as a function would be to use __eval()__, but then I would be a certifiably bad coder(tm).  So, instead I have a rather silly explicit set of "if" statements...

	if ( fLen === 5 ) { 
		func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3][funcLoc[3]]; 
	};
	if ( fLen === 4 ) { 
		func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]]; 
	};
	if ( fLen === 3 ) { 
		func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]]; 
	};
	...etcetera...
It works, but it's severely dumb-looking.  And it will break if you try to pass it a REALLY deeply nested function...

	Behold.my.fabulous.nested.object.structure.nine.levels.deep(); 

Yup.  This would fail.  I stopped at 8 nested levels because it just felt ridiculous to spell out the syntax without some flexible or iterative approach.  But I don't know the trick for this one.  

__2. non-flexible arguments array.__ The inelegant kludge to avoid _eval()_ goes hand-in-hand with the non-flexible way that I set up the arguments to be passed into those (non-eval) functions.

	args = [dada.ticTarget, dada.ticArg1, dada.ticArg2, 
			dada.ticArg3, dada.ticArg4, dada.ticArg5 ];
I know I could build and pass along a more flexible argument hash like...

	myFunction( target, { "key1": "value1", "key2": "value2" });

But this requires a rather specific argument structure for the target "myFunction()" and it's not a structure that I think many coders would want to use...  I personally don't use hash data in my arguments.  Does anybody?

***************
  
>>>>>>> 

***************