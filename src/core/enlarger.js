import * from './util/helper'
//elements related
var mask=document.createElement('div'),
	wrapper=document.createElement('div'),
	targetEle,targetInsteadHolder,parentEle,
	browserPrefix='webkitAppearance' in document.style ?'-webkit-':''
//state
var shown=false,
	locked=false,
	oldStyle;
var viewBox

var options={
	bgColor:'#FFF',
	transitionDuration:0.5s,
	transitionTimingFunction:'cubic-bezier(0.5,0,0,1)',
	zoomWidth:300,
	zoomHeight:300,
	beforeOpened:null,
	beforeClosed:null,
	afterOpened:null,
	afterClosed:null
}

var transitionPrefix=getTrans(),
	transitionProp=transitionPrefix.transition,
	transformProp=transitionPrefix.transform,
	transEndEvent=transitionPrefix.transEnd

var maskStyle={
	position:'fixed',
	display:'none',
	zIndex:'99000',
	top:0,
	left:0,
	right:0,
	bottom:0,
	opacity:0,
	backgroundColor:options.bgColor

}
setStyle(mask,maskStyle)


var stylesCausedReflow=[
	'position','display','float',
	'left','right','top','bottom',
	'font','line-height','vertical-align',
	'margin-top','margin-right','margin-left','margin-right'
	]


var enlarger={
	config:function(opts){
		for(var key in opts){
			options[key]=opts[key]
		}

		setStyle(mask,{
			backgroundColor:options.bgColor,
			transition:'opacity '+
						transitionDuration+' '+
						transitionTimingFunction

		})

		return this
	},

	show:function(el,cb){
		if(shown||locked)return

		target=typeof el==='string'
			  ?document.querySelector(el)
			  :el

		if(options.beforeOpened)options.beforeOpened(target)

		shown=locked=true
		
		parentEle=target.parentNode

		var box=target.getBoundingClientRect()

		viewBox=document.documentElement.getBoundingClientRect()

		var holder=copyStyles(stylesCausedReflow,target,box)

		oldStyle=setStyle(target,{
			position:'absolute',
			top:0,
			left:0,
			right:'',
			bottom:'',
			marginTop:-box.height/2+"px",
			marginLeft:-box.width/2+"px",
			cursor:browserPrefix+"zoom-out",
			transform:'translate('+(box.left-(viewBox.width-box.width)/2)+'px,
						'+(box.top-(viewBox.height-box.height)/2)+'px)',
			transition:''

		},true)
		
		

		wrapper.appendChild(target)
		

		parentEle.insertBefore(holder,target)
		parentEle.appendChild(mask)
		parentEle.appendChild(wrapper)
		wrapper.appendChild(target)

		target.offsetWidth
		mask.style.opacity=options.opacity
		setStyle(target,{
			transform:'scale('+options.maxWidth/box.width+')',
			transition:transformProp+' '+
					   transitionDuration+' '+
					   transitionTimingFunction	
		})

		traget.addEventListener(transEndEvent,function end(){
			target.removeEventListener(transEndEvent,end)
			cb=cb||options.afterOpened
			if(cb){cb(target)}
			locked=false
		})
	return this	

	},
	close:function(cb){
		if(!shown||locked)return
		locked=true

		if(options.beforeClosed)options.beforeClosed(target)

		var pBox=holder.getBoundingClientRect(),

			dx=pBox.left-(viewBox.width-pBox.width)/2,
			dy=pBox.top-(viewBox.height-pBox.height)/2

		mask.style.opacity=0
		setStyle(target,{
			transform:'translate('+dx+'px,'+dy+'px)'
		})

		target.addEventListener(transEndEvent,function end(){
			target.removeEventListener(transEndEvent,end)

			setStyle(target,extendStyle(oldStyle,{transform:'none'}))
			
			parentEle.insertBefore(target,holder)
			parentEle.removeChild(holder)
			parentEle.removeChild(wrapper)
			parentEle.removeChild(mask)

			mask.style.display="none"
			holder=null

			shown=locked=false,

			cb=cb||option.afterClosed
			if(cb)cb(target)

		})
		return this

	},
	watch:function(el){
		if(typeof el==='string'){
			var elArr=document.querySelectorAll(el),
			l=elArr.length

			while(l--){
				this.watch(elArr[l])
			}
			return
		}

		setStyle(el,{
			'cursor':browserPrefix+'zoom-in'
		})

		el.addEventListener("click",function(e){
			e.stopPropagation();
			if(shown){
				enlarger.close()
			}
			else{
				enlarger.open();
			}
		})
		return this

	}
	

   
}

	mask.addEventListener("click",enlarger.close)
	wrapper.addEventListener("click",enlarger.close)

	export default enlarger



