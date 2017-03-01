/**
 * Author: huangzhiyang
 * Date: 2016/8/5 17:17
 * Description: ""
 */
export default class AnimationInOut{
    constructor({ele,className,inCallback,outCallback}){

		this.ele = ele.nodeType=="1" ? ele : document.querySelector(ele);

		this.inClass = className + "-in";
		this.outClass = className + "-out";

		this.endEvent = this.witchEndEvent();

		this.endHandler = this.end.bind(this);

		this.inCallback = inCallback;

		this.outCallback = outCallback;
	}
	entry(){
		this.ele.classList.add(this.inClass);
		document.addEventListener(this.endEvent,this.endHandler,false);
	}
	leave(){

	}
	end(){
		var ele = this.ele;
		var classList = ele.classList;
		var isIn = classList.contains(this.inClass);
		var isOut = classList.contains(this.outClass);
		document.removeEventListener(this.endEvent,this.endHandler);

		if(isIn){
			classList.remove(this.inClass);
			this.inCallback && this.inCallback();
		}

		if(isOut){
			classList.remove(this.outClass);
			this.outCallback && this.outCallback();
		}

	}
	witchEndEvent(){
		var elem = document.createElement("div");
		var endEvent = {
			animation : "animationEnd",
			WebkitAnimation : "WebkitAnimationEnd"
		};
		for(var k in endEvent){
			if(elem.style[k]!=="undefined"){
				return endEvent[k];
			}
		}
	}
}