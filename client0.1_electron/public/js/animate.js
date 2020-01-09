function renderAnimColor(params) {
    //{FromColor: []color Code, ToColor: []color Code,time: ms, id: id des elements}
    console.log('render Animation Start')
    
    var element = document.getElementById(params.id) 
    var startcolor = params.FromColor
    var endcolor = params.ToColor
    var steps = 200
    var delay = params.time / steps
    var currentcolor = startcolor;
    var stepcount = 0;
    console.log(currentcolor)
    var red_change = (startcolor[0] - endcolor[0]) / steps;
    var green_change = (startcolor[1] - endcolor[1]) / steps;
    var blue_change = (startcolor[2] - endcolor[2]) / steps;

    var timer = setInterval(function(){
        console.log(stepcount)
        
        currentcolor[0] = parseInt(currentcolor[0] - red_change);
        currentcolor[1] = parseInt(currentcolor[1] - green_change);
        currentcolor[2] = parseInt(currentcolor[2] - blue_change);
        console.log(currentcolor)
        element.style.backgroundColor = 'rgb(' + currentcolor.toString() + ')';
        stepcount += 1;
        if (stepcount >= steps) {
            element.style.backgroundColor = 'rgb(' + endcolor.toString() + ')';
            clearInterval(timer);
        }
    }, delay);


}
function renderAnimColor2(params) {
    //{FromColor: []color Code, ToColor: []color Code,time: ms, id: id des elements}
    console.log('render Animation Start')
    
    var element = document.getElementById(params.id) 
    var startcolor = params.FromColor
    var endcolor = params.ToColor
    
    console.log(endcolor)
  

    $('#' + params.id).animate({
        backgroundColor: 'rgb(' + endcolor.toString() + ')', opacity: "1"
      }, params.time);


}





//renderAnimColor({id: 'testtt',FromColor: [255,255,60],ToColor: [0,0,255], time: 750});
//renderAnimColor({id: 'testtt',FromColor: [255,255,60],ToColor: [0,0,255], time: 750});