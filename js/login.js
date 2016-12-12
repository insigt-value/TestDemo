/**
 * Created by Administrator on 2016/12/1.
 */
var loginbtn =document.getElementById("loginbtn");
var loginform = document.getElementsByClassName("login")[0];
var closebtn = document.getElementsByClassName("close")[0];
loginbtn.addEventListener('touchstart', function(event)
{ // 如果这个元素的位置内只有一个手指的话
    if (event.targetTouches.length == 1)
    if (event.targetTouches.length == 1)
    {
        var touch = event.targetTouches[0];
        loginform.className = "login show";
    }
}, false);
closebtn.addEventListener('touchend', function(event)
{ // 如果这个元素的位置内只有一个手指的话
    if (event.targetTouches.length == 1)
    {
        var touch = event.targetTouches[0];
        loginform.className = "login hide";
    }
}, false);
