
module.exports.getDate = getDate;

function getDate(){

    var today = new Date();
    
    var options = {
        weekday:"long",
        day:"numeric",
        month:"long"
    };

    var day = today.toLocaleDateString("hi-IN",options);
    return day;
}

//just a different way to declare functions ie both of them work exactly the same

exports.getDay = function(){

    var today = new Date();
    
    var options = {
        weekday:"long",
    };

    var day = today.toLocaleDateString("hi-IN",options);
    return day;
};
