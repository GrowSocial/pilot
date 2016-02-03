
Template.helpMain.onRendered(function() {
    $('[data-toggle="popover"]').popover(); 
});

Template.helpMain.onDestroyed(function() {
    $('[data-toggle="popover"]').popover("hide"); 
});

