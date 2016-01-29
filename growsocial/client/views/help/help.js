
Template.helpMain.onRendered(function() {
    $('[data-toggle="popover"]').popover(); 
});
Template.homeNew.onDestroyed(function() {
    $('[data-toggle="popover"]').popover("hide"); 
});


Template.helpMain.onDestroyed(function() {
    $('[data-toggle="popover"]').popover("hide"); 
});