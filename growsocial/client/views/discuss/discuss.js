// http://louisrli.github.io/blog/2013/07/29/using-meteor-js-with-disqus/

// embed.js:16 says: Use DISQUS.reset instead of reloading embed.js please.
//  See https://help.disqus.com/customer/portal/articles/472107-using-disqus-on-ajax-sites

var disqus_config = function () {
  this.page.url = "https://growsocial.meteor.com/discuss";  // Replace PAGE_URL with your page's canonical URL variable
  this.page.identifier = "GROWSOCIAL-PILOT-DISCUSS"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
  this.page.title = 'General Discussion'; // a unique title for each page where Disqus is present
};

Template.discuss.onRendered(function() {
  Session.set("loadDisqus", true);

  if (window.DISQUS) {
    DISQUS.reset({
      reload: true,
      config: disqus_config,
    });
  }
});

Meteor.autorun(function() {
  // Load the Disqus embed.js the first time the template is rendered
  // but never more than once
  
  if (Session.get("loadDisqus") && !window.DISQUS) {
    (function() {  // DON'T EDIT BELOW THIS LINE
      var d = document, s = d.createElement('script');
      s.src = '//growsocialpilot.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }
});
