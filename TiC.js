var TiC = function(){
	
	var initFlag = true;

	var is_touchy = function() {
		// test borrowed from Modernizr v2.5.3
		var touchy = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		return touchy;
 	};

	var initialize =  function(){
		if ( initFlag ) {
			initFlag = false;
			if ( is_touchy() ){ 
				TiC.touchClick = 'touchstart';
				TiC.touchEnd = 'touchend'; 	
			};
		};
	};
	return { 
		sensitivity: 10,  // pixels of drag distance before a click event gets canceled
		touchClick: 'click',
		touchEnd: 'dblclick',
		init: initialize,

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
					$.publish( action, args );
					break;
			};

		},  // END router() function


		developMode: false,
		registry: [],
		elemList: [],
		
		elements: function(show) {
			var a, b, c, d, list, i, j, domId;
			TiC.elemList = [];

			$('.TiC, .TiClick').each( function(index){
				var dada = $(this).data();
				var delivery = "ticAction: " + dada.ticAction;
				var domId = $(this).attr('id');
				if ( domId ) { delivery = '[ #'+ domId + ' ]  '+ delivery; };
				TiC.elemList.push(delivery);
				delivery=[];
				for ( var prop in dada ){
					if (prop !== "ticAction" ) {
						if ( prop.substring(0,3) === "tic" ) {
							delivery.push(prop + ":" + dada[prop]);
						}
					}
				}
				TiC.elemList.push(delivery);
			});

			if ( show==="show" ) {
				a = '<li>XXXX</li>';
				b = '<ul style="list-style: none;">XXXX</ul>';
				c = '<a style="display:block; float:right; width:60px; padding:10px; text-decoration:none; font-weight:bold; '+
					' border: 1px solid #c06000; margin: -12px -12px 0px 0px;'+
					' border-radius:3px; background:#c0c0c0; color:#ffffff;" '+
					' href="#" onclick="$(\'#ticElemSummary\').remove();">CLOSE</a>'+
					'<h3>TiC DOM elements</h3><span style="display:block; clear:both"></span>';
				list = "";
				for ( i=0; i < TiC.elemList.length; i+=1 ){
					if ( TiC.typeOf(TiC.elemList[i]) === "array" ) {
						d = "|&nbsp;&nbsp;";
						for ( j=0; j < TiC.elemList[i].length; j+=1 ){
							if ( TiC.elemList[i][j] ) {
								d = d + TiC.elemList[i][j] + "&nbsp;&nbsp;|&nbsp;&nbsp;";
							}
						}
						if ( d === "|&nbsp;&nbsp;" ) { d = '<em>no arguments</em>'};
						d = a.replace(/XXXX/g,d)
					} else {
						d = a.replace(/XXXX/g,("<br /><strong>"+TiC.elemList[i]+"</strong>"));
					}
					list = list + d;
				}
				list = list;
				list = b.replace(/XXXX/g,list);
				
				$('<div></div>')
					.attr('id','ticElemSummary')
					.css({'z-index':'9999','position':'absolute','top':'40px','left':'40px'})
					.css({'padding':'30px','background':'#ffffff','border':'1px solid #505050'})
					.html(c)
					.append(list)
					.appendTo('body');
			} else {
				return TiC.elemList;
			}
		},
		
		events: function(show){
			var a, b, c, d, list, i, j;
			
			if ( show==="show" ) {
				a = '<li>XXXX</li>';
				b = '<ul style="list-style: none;">XXXX</ul>';
				c = '<a style="display:block; float:right; width:60px; padding:10px; text-decoration:none; font-weight:bold; '+
					' border: 1px solid #c06000; margin: -12px -12px 0px 0px;'+
					' border-radius:3px; background:#c0c0c0; color:#ffffff;" '+
					' href="#" onclick="$(\'#ticEventSummary\').remove();">CLOSE</a>'+
					'<h3>TiC events fired</h3><span style="display:block; clear:both"></span>';
				list = "";
				for ( i=0; i < TiC.registry.length; i+=1 ){
					if ( TiC.typeOf(TiC.registry[i]) === "array" ) {
						d = "";
						for ( j=0; j < TiC.registry[i].length; j+=1 ){
							if ( TiC.registry[i][j] ) {
								d = d + TiC.registry[i][j] + ",&nbsp; ";
							}
						}
						if (!d ) { d = '<em>no arguments</em>'};
						d = a.replace(/XXXX/g,d)
					} else {
						d = a.replace(/XXXX/g,("<br /><strong>"+TiC.registry[i]+"</strong>"));
					}
					list = list + d;
				}
				list = list;
				list = b.replace(/XXXX/g,list);
				
				$('<div></div>')
					.attr('id','ticEventSummary')
					.css({'z-index':'9999','position':'absolute','top':'40px','left':'40px'})
					.css({'padding':'30px','background':'#ffffff','border':'1px solid #505050'})
					.html(c)
					.append(list)
					.appendTo('body');
			} else {
				return TiC.registry;
			}
		},   // END summary()
		
		typeOf: function (value) {
		    var s = typeof value;
		    if (s === 'object') {
		        if (value) {
		            if (Object.prototype.toString.call(value) == '[object Array]') {
		                s = 'array';
		            }
		        } else {
		            s = 'null';
		        }
		    }
		    return s;
		} // END typeOf utility function
		
	};  // END returned (public) functions

}();
	

(function( $ ){  $.fn.TiC = function(touchOrClick, slowClick) {

	//  use click if any of these is true:
	//  1. touch environmnt is absent
	//	2. the element tapped has data-tic-tc = "click"
	//  3. the wrapper was called with 'click'   $(element).TiC('click')
	//	otherwise default to touchstart
	
	TiC.init(); // This only runs once
	
    $(this).each(function() {
		touchOrClick = touchOrClick || 'touchstart';

		if ( slowClick === "slowClick" ) {
			$(this).on('click',
				'.TiClick',
				function(event){
					event.preventDefault();
					var funcLoc, func, fLen, args, dada;
					dada = $(this).data();
					if ( !dada.ticAction ) {
						console.error('TiC: no Action supplied');
						console.log(this);
					} else {
						funcLoc = dada.ticAction.split(".");
						fLen = funcLoc.length;
						if ( fLen > 8 ) { console.log('function called is too damn nested!' )
						// this somewhat verbose gymnastics lets us avoid using "eval(dada.ticAction)"
						} else if ( fLen === 8 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]][funcLoc[4]][funcLoc[5]][funcLoc[6]][funcLoc[7]]; 
						} else if ( fLen === 7 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]][funcLoc[4]][funcLoc[5]][funcLoc[6]]; 
						} else if ( fLen === 6 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]][funcLoc[4]][funcLoc[5]]; 
						} else if ( fLen === 5 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]][funcLoc[4]];
						} else if ( fLen === 4 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]];
						} else if ( fLen === 3 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]];
						} else if ( fLen === 2 ) { func = window[funcLoc[0]][funcLoc[1]];
						} else if ( fLen === 1 ) { func = window[funcLoc[0]]; };
						args = [dada.ticTarget, dada.ticArg1, dada.ticArg2, dada.ticArg3, dada.ticArg4, dada.ticArg5 ];
	
						if (TiC.developMode ) {
							TiC.registry.push(dada.ticAction);
							TiC.registry.push(args);
						}
	
						if ( dada.ticPublish ) {
							$.publish(dada.ticAction, args);
						} else if ( dada.ticRouter) {
							args.unshift(dada.ticAction);
							TiC.router.apply(this,args)
						} else {
							func.apply(this,args);
						}
	
					};
				}
			);
		};

		$(this).on(TiC.touchClick,
			'.TiC',
			{ touchOrClick: touchOrClick }, // data to pass in
			function(event){
				event.preventDefault();
				var funcLoc, func, fLen, args, clickstart, e, dada;

				dada = $(this).data();

				if ( !dada.ticAction ) {
					console.error('TiC: no Action supplied');
					console.log(this);
				} else {
					clickStart = { x: 0, y: 0, scroll: 0 };	
					funcLoc = dada.ticAction.split(".");
					fLen = funcLoc.length;
					if ( fLen > 8 ) { console.log('function called is too damn nested!' )
					// this somewhat verbose gymnastics lets us avoid using "eval(dada.ticAction)"
					} else if ( fLen === 8 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]][funcLoc[4]][funcLoc[5]][funcLoc[6]][funcLoc[7]]; 
					} else if ( fLen === 7 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]][funcLoc[4]][funcLoc[5]][funcLoc[6]]; 
					} else if ( fLen === 6 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]][funcLoc[4]][funcLoc[5]]; 
					} else if ( fLen === 5 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]][funcLoc[4]];
					} else if ( fLen === 4 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]][funcLoc[3]];
					} else if ( fLen === 3 ) { func = window[funcLoc[0]][funcLoc[1]][funcLoc[2]];
					} else if ( fLen === 2 ) { func = window[funcLoc[0]][funcLoc[1]];
					} else if ( fLen === 1 ) { func = window[funcLoc[0]]; };
					args = [dada.ticTarget, dada.ticArg1, dada.ticArg2, dada.ticArg3, dada.ticArg4, dada.ticArg5 ];

					if (TiC.developMode ) {
						TiC.registry.push(dada.ticAction);
						TiC.registry.push(args);
					}

					if ( TiC.touchClick === "click" ) {  //  CLICK ENVIRONMENT
						// click easy solution
						if ( dada.ticPublish ) {
							$.publish(dada.ticAction, args);
						} else if ( dada.ticRouter) {
							args.unshift(dada.ticAction);
							TiC.router.apply(this,args)
						} else {
							func.apply(this,args);
						}

					} else { // TOUCH ENVIRONMENT
	
						// complicated noClickDelay
						if( event.data.touchOrClick === "click" || dada.ticTc === "click" ) {
							e = event.originalEvent;
							
							clickStart.scroll = window.pageYOffset;
							clickStart.x = e.targetTouches[0].clientX;
							clickStart.y = e.targetTouches[0].clientY;
							$(this).data({
								touchmoved: 'false',
								startx: clickStart.x,
								starty: clickStart.y
							});						
							$(this).on('touchcancel', function(e) {
								$(this).data('touchmoved', 'false');
							});
	
							$(this).on('touchmove', function(event){
								var e = event.originalEvent;
								var clickstartX = $(this).data('startx');
								var clickstartY = $(this).data('starty');
								if ( Math.abs(e.targetTouches[0].clientX - clickStartX) > TiC.sensitivity || 
									 Math.abs(e.targetTouches[0].clientY - clickStartX) > TiC.sensitivity ) {
										$(this).data({'touchmoved':'moved'});  
								};
							});
							
							$(this).one(
								'touchend', 
								{ action: dada.ticAction, target: dada.ticTarget, publish: dada.ticPublish,
								  func: func, router: dada.ticRouter,
								  arg1: dada.ticArg2, arg2: dada.ticArg2, arg3: dada.ticArg3, arg4: dada.ticArg4, arg5: dada.ticArg5 }, 
								function(e) {
									var args = [e.data.target, e.data.arg1, e.data.arg2, e.data.arg3, e.data.arg4, e.data.arg5 ];
									$(this).unbind('touchmove');
									$(this).unbind('touchcancel');
									if ( $(this).data('touchmoved') !== 'moved' ) {
	
	
										if ( e.data.publish ) {
											$.publish(e.data.action, args);
										} else if ( e.data.router ) {
											args.unshift(e.data.action);
											TiC.router.apply(this,args);
										} else {
											e.data.func.apply(this,args);
										}
										// alert('touch context, CLICK');
									}
								}
							);
	
						// touchstart -  easy solution
						} else {  
							// alert('touch context, TOUCH');
							if ( dada.ticPublish ) {
								$.publish(dada.ticAction, args);
							} else if ( dada.ticRouter) {
								args.unshift(dada.ticAction);
								TiC.router.apply(this,args)
							} else {
								func.apply(this,args);
							}
							// TiC.router(dada.ticAction, dada.ticTarget, dada.ticArg1, dada.ticArg2 );
						};
					};  // END touch environment handler
				}  //  END else (yes, we had an Action to target )
			} // END event results function
		);  // END ON event handler
    });  // END iterated "Each"
  };
})( jQuery );

/* ======== jQuery Tiny Pub/Sub v0.7 === 10/27/2011 =============================   
 * ======== https://gist.github.com/661855   http://benalman.com/  ============== */
(function($) {
	var o = $({});
	$.subscribe = 	function() { o.on.apply(o, arguments);  };
	$.unsubscribe = function() { o.off.apply(o, arguments);  };
	$.publish = 	function() { o.trigger.apply(o, arguments);  };
}(jQuery));


(function($) {
	var o = $({});
	$.subscribe = 	function() { o.on.apply(o, arguments);     };
	$.unsubscribe = function() { o.off.apply(o, arguments);    };
	$.publish = 	function() { o.trigger.apply(o, arguments); };
}(jQuery));

/* ======== END jQuery Tiny Pub/Sub   ==============================================  */

