import * as helper from '../util/helper'

//elements related
var mask=document.createElement('div'),
	wrapper=document.createElement('div'),
	targetEle,targetInsteadHolder,parentEle,
	browserPrefix='webkitAppearance' in document.body.style ?'-webkit-':''
	
//state
var shown=false,
	locked=false,
	oldStyle;

//visual doc box
var viewBox={}

var options={
	bgColor:'#FFF',
	transitionDuration:'0.5s',
	transitionTimingFunction:'cubic-bezier(0.5,0,0,1)',
	zoomWidth:window.innerWidth/2,
	zoomHeight:window.innerHeight/2,
	beforeOpened:null,
	beforeClosed:null,
	afterOpened:null,
	afterClosed:null,
	opacity:.5
}

var transitionPrefix=helper.getTrans(),
	transitionProp=transitionPrefix.transition,
	transformProp=transitionPrefix.transform,
	transformCssProp=transformProp.replace(/(.*)Transform/,'-$1-transform'),
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
helper.setStyle(mask,maskStyle)
helper.setStyle(wrapper,{
	position:'fixed',
	left:'50%',
	top:'50%',
	zIndex:'99001'
})

var stylesCausedReflow=[
	'position','display','float',
	'left','right','top','bottom',
	'font','line-height','vertical-align',
	'margin-top','margin-right','margin-left','margin-right'
	]
var docWidth=document.documentElement.clientWidth,
			docHeight=document.documentElement.clientHeight
		viewBox.width=docWidth
		viewBox.height=docHeight

var enlarger={
	config:function(opts){
		for(var key in opts){
			options[key]=opts[key]
		}

		helper.setStyle(mask,{
			backgroundColor:options.bgColor,
			transition:'opacity '+
						options.transitionDuration+' '+
						options.transitionTimingFunction

		})

		return this
	},

	show:function(el,cb){
		if(shown||locked)return

			console.log(typeof el)
		targetEle=typeof el==='string'
			  ?document.querySelector(el)
			  :el

		if(options.beforeOpened)options.beforeOpened(targetEle)

		shown=locked=true
		
		parentEle=targetEle.parentNode

		var box=targetEle.getBoundingClientRect()


		targetInsteadHolder=helper.copyStyle(stylesCausedReflow,targetEle,box)
		var disX=box.left-(docWidth-box.width)/2,
			disY=box.top-(docHeight-box.height)/2
			console.log(disX+","+disY)
			
		oldStyle=helper.setStyle(targetEle,{
			position:'absolute',
			top:0,
			left:0,
			right:'',
			bottom:'',
			marginTop:-box.height/2+"px",
			marginLeft:-box.width/2+"px",
			cursor:browserPrefix+"zoom-out",
			transform:'translate('+disX+'px,'
						+disY+'px)',
			transition:'',
			whiteSpace:'nowrap'

		},true)
		
		

		
		

		parentEle.insertBefore(targetInsteadHolder,targetEle)
		parentEle.appendChild(mask)
		parentEle.appendChild(wrapper)
		wrapper.appendChild(targetEle)
		mask.style.display="block"

		targetEle.offsetWidth
		mask.style.opacity=options.opacity
		var scale=Math.min(options.zoomWidth/box.width,options.zoomHeight/box.height)
		helper.setStyle(targetEle,{
			transform:'scale('+scale+')',
			transition:transformCssProp+' '+
					   options.transitionDuration+' '+
					   options.transitionTimingFunction	
		})

		targetEle.addEventListener(transEndEvent,function end(){
			targetEle.removeEventListener(transEndEvent,end)
			cb=cb||options.afterOpened
			if(cb){cb(targetEle)}
			locked=false
		})
	return this	

	},
	close:function(cb){
		if(!shown||locked)return
		locked=true

		if(options.beforeClosed)options.beforeClosed(targetEle)

		var pBox=targetInsteadHolder.getBoundingClientRect(),

			dx=pBox.left-(viewBox.width-pBox.width)/2,
			dy=pBox.top-(viewBox.height-pBox.height)/2

		mask.style.opacity=0
		helper.setStyle(targetEle,{
			transform:'translate('+dx+'px,'+dy+'px)'
		})

		targetEle.addEventListener(transEndEvent,function end(){
			targetEle.removeEventListener(transEndEvent,end)

			helper.setStyle(targetEle,helper.extendStyle(oldStyle,{transform:'none'}))
			
			parentEle.insertBefore(targetEle,targetInsteadHolder)
			parentEle.removeChild(targetInsteadHolder)
			parentEle.removeChild(wrapper)
			parentEle.removeChild(mask)

			mask.style.display="none"
			targetInsteadHolder=null

			shown=locked=false,

			cb=cb||options.afterClosed
			if(cb)cb(targetEle)

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
			return this
		}

		helper.setStyle(el,{
			'cursor':browserPrefix+'zoom-in'
		})

		el.addEventListener("click",function(e){
			e.stopPropagation();
			if(shown){
				enlarger.close()
			}
			else{
				enlarger.show(el);
			}
		})
		return this

	}
	   
}

	mask.addEventListener("click",enlarger.close)
	wrapper.addEventListener("click",enlarger.close)

	export  {enlarger}



