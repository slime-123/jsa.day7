const slider = (function(){
	
	//const
	const slider = document.getElementById("slider"); 
	console.log(slider);
	const sliderContent = document.querySelector(".slider-content"); 
	console.log(sliderContent);
	const sliderWrapper = document.querySelector(".slider-content-wrapper"); 
	const elements = document.querySelectorAll(".slider-content__item"); 
	const sliderContentControls = createHTMLElement("div", "slider-content__controls"); //sliderContent
	let dotsWrapper = null; 
	let prevButton = null; 
	let nextButton = null;
	let autoButton = null;
	let leftArrow = null; 
	let rightArrow = null;
	let intervalId = null; //đặt thời gian
	
	// data
	const itemsInfo = {
		offset: 0, 
		position: {
			current: 0, 
			min: 0, 
			max: elements.length - 1 
		},
		intervalSpeed: 2000, 

		update: function(value) {
			this.position.current = value;
			this.offset = -value;
		},
		reset: function() {
			this.position.current = 0;
			this.offset = 0;
		}	
	};

	const controlsInfo = {
		buttonsEnabled: false,
		dotsEnabled: false,
		prevButtonDisabled: true,
		nextButtonDisabled: false
	};

	
	function init(props) {
		// let {buttonsEnabled, dotsEnabled} = controlsInfo;
		let {intervalSpeed, position, offset} = itemsInfo;
		
		
		if (slider && sliderContent && sliderWrapper && elements) {
			
			if (props && props.intervalSpeed) {
				intervalSpeed = props.intervalSpeed;
			}
			if (props && props.currentItem) {
				if ( parseInt(props.currentItem) >= position.min && parseInt(props.currentItem) <= position.max ) {
					position.current = props.currentItem;
					offset = - props.currentItem;	
				}
			}
			if (props && props.buttons) {
				controlsInfo.buttonsEnabled = true;
			}
			if (props && props.dots) {
				controlsInfo.dotsEnabled = true;
			}
			
			_updateControlsInfo();
			_createControls(controlsInfo.dotsEnabled, controlsInfo.buttonsEnabled);
			_render();	
		} else {
			console.log(" 'slider/slider-content/slider-wrapper/slider-content__item'");
		}
	}

	
	function _updateControlsInfo() {
		const {current, min, max} = itemsInfo.position;
		controlsInfo.prevButtonDisabled = current > min ? false : true;
		controlsInfo.nextButtonDisabled = current < max ? false : true;
	}

	
	function _createControls(dots = false, buttons = false) {
		
		
		sliderContent.append(sliderContentControls);

		
		createArrows();
		buttons ? createButtons() : null;
		dots ? createDots() : null;
		
		// Arrows function
		function createArrows() {
			const dValueLeftArrow = "M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z";
			const dValueRightArrow = "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z";
			const leftArrowSVG = createSVG(dValueLeftArrow);
			const rightArrowSVG = createSVG(dValueRightArrow);
			
			leftArrow = createHTMLElement("div", "prev-arrow");
			leftArrow.append(leftArrowSVG);
			leftArrow.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current - 1))
			
			rightArrow = createHTMLElement("div", "next-arrow");
			rightArrow.append(rightArrowSVG);
			rightArrow.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current + 1))

			sliderContentControls.append(leftArrow, rightArrow);
			
			// SVG function
			function createSVG(dValue, color="currentColor") {
				const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				svg.setAttribute("viewBox", "0 0 256 512");
				const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
				path.setAttribute("fill", color);
				path.setAttribute("d", dValue);
				svg.appendChild(path);	
				return svg;
			}
		}

		// Dots function
		function createDots() {
			dotsWrapper = createHTMLElement("div", "dots");			
			for(let i = 0; i < itemsInfo.position.max + 1; i++) {
				const dot = document.createElement("div");
				dot.className = "dot";
				dot.addEventListener("click", function() {
					updateItemsInfo(i);
				})
				dotsWrapper.append(dot);		
			}
			sliderContentControls.append(dotsWrapper);	
		}
		
		// Buttons function
		function createButtons() {
			const controlsWrapper = createHTMLElement("div", "slider-controls");//tên thẻ tên class
			prevButton = createHTMLElement("button", "prev-control", "Prev");//thẻ ,id,chữ
			prevButton.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current - 1))
			
			autoButton = createHTMLElement("button", "auto-control", "Auto");
			autoButton.addEventListener("click", () => {
				intervalId = setInterval(function(){
					if (itemsInfo.position.current < itemsInfo.position.max) {
						itemsInfo.update(itemsInfo.position.current + 1);
					} else {
						itemsInfo.reset();
					}
					_slideItem();
				}, itemsInfo.intervalSpeed)
			})

			nextButton = createHTMLElement("button", "next-control", "Next");
			nextButton.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current + 1))

			controlsWrapper.append(prevButton, autoButton, nextButton);
			slider.append(controlsWrapper);
		}
	}

	// (buttons, arrows)
	function setClass(options) {
		if (options) {
			options.forEach(({element, className, disabled}) => {
				if (element) {
					disabled ? element.classList.add(className) : element.classList.remove(className)	
				} else {
					console.log("Error: function setClass(): element = ", element);
				}
			})
		}
	}

	// 
	function updateItemsInfo(value) {
		itemsInfo.update(value);
		_slideItem(true);	
	}

	
	function _render() {
		const {prevButtonDisabled, nextButtonDisabled} = controlsInfo;
		let controlsArray = [
			{element: leftArrow, className: "d-none", disabled: prevButtonDisabled},
			{element: rightArrow, className: "d-none", disabled: nextButtonDisabled}
		];
		if (controlsInfo.buttonsEnabled) {
			controlsArray = [
				...controlsArray, 
				{element:prevButton, className: "disabled", disabled: prevButtonDisabled},
				{element:nextButton, className: "disabled", disabled: nextButtonDisabled}
			];
		}
		
		
		setClass(controlsArray);

		
		sliderWrapper.style.transform = `translateX(${itemsInfo.offset*100}%)`;	
		
		
		if (controlsInfo.dotsEnabled) {
			if (document.querySelector(".dot--active")) {
				document.querySelector(".dot--active").classList.remove("dot--active");	
			}
			dotsWrapper.children[itemsInfo.position.current].classList.add("dot--active");
		}
	}

	
	function _slideItem(autoMode = false) {
		if (autoMode && intervalId) {
			clearInterval(intervalId);
		}
		_updateControlsInfo();
		_render();
	}

	
	function createHTMLElement(tagName="div", className, innerHTML) {
		const element = document.createElement(tagName);
		className ? element.className = className : null;
		innerHTML ? element.innerHTML = innerHTML : null;
		return element;
	}

	
	return {init};
}())

slider.init({
	// intervalSpeed: 1000,
	currentItem: 0,
	buttons: true,
	dots: true
});
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
	document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
	if (!event.target.matches('.dropbtn5')) {
	  var dropdowns = document.getElementsByClassName("dropdown-content");
	  var i;
	  for (i = 0; i < dropdowns.length; i++) {
		var openDropdown = dropdowns[i];
		if (openDropdown.classList.contains('show')) {
		  openDropdown.classList.remove('show');
		}
	  }
	}
  }
  const buttonQuery = document.querySelector('drop2');
  function myDrop2(){
	// window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
	window.location.href ='test1.html'
	// window.location.href('D:\lập trình\bài cuối khóa lập trình JSB07\index.html')
  }
  const btnQuery = document.querySelector('btn1');
  function backTomain(){
	window.location.href ='end2.html'
  }
  const btn2Query = document.querySelector('btn2');
  function introDuce(){
	window.location.href ='test2.html'
  }
  const btn3query = document.querySelector('btn3')
  function item(){
	window.location.href = 'test3.html'

  }
  const drop3query = document.querySelector('drop3')
  function myDrop3(){
	window.location.href='test4.html'
  }
  const btn4query = document.querySelector('btn4')
  function shop(){
	window.location.href='test6.html'
  }
  const drop1query = document.querySelector('drop1')
  function myDrop1(){
	window.location.href='test5.html'
  }
  const logoutquery = document.querySelector('logout')
  function logoutButton(){
	window.location.href='index.html'
  }
  const backquery = document.querySelector('btn1')
  function backTomain(){
	alert('Chào mừng bạn đã đến với cửa hàng của chúng tôi :33')
  }