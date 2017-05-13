$(function(){
  $.ajax({
    url: "https://api.github.com/orgs/rwebapps/repos",
    dataType: "jsonp"
  }).done(function(res){
    if(res.meta.status == 200){
      $.each(res.data, function(index, value) {
        var mydiv = $('<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6">')
           .css("text-align", "center")
           .appendTo("#appsrow");
        var myimg = $('<img class="appicon img img-rounded">').width(100).height(100)
           .attr("src", "https://raw.github.com/rwebapps/" + value.name + "/master/inst/icon.png")
           .appendTo(mydiv).on("error", function(){
              myimg.attr("src", value.owner.avatar_url);
           });

        var mybr = $("<br />").appendTo(mydiv);
        var btngrp = $('<div class="btn-group">').appendTo(mydiv);
        var appbtn = $('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">').text(value.name + " ").appendTo(btngrp);
        var appurl;

        $.ajax({
          url: "//rwebapps.ocpu.io/" + value.name
        }).done(function(){
          appurl = "https://rwebapps.ocpu.io/" + value.name;
        }).error(function(){
          appurl = "https://cran.ocpu.io/" + value.name;
        }).always(function(){
           var myul = $('<ul class="dropdown-menu" role="menu">').appendTo(btngrp);
           myul.append('<li><a target="_blank" href="' + appurl + '/info"><i class="icon icon-info-sign"> Package Info </a></li>');
           myul.append('<li><a target="_blank" href="' + appurl + '/www/"><i class="icon icon-play"> Live App Demo </a></li>');
           myul.append('<li class="divider"></li>');
           myul.append('<li><a target="_blank" href="http://www.github.com/rwebapps/' + value.name + '"><i class="icon icon-github"> Source Code </a></li>');
           appbtn.append($('<span class="caret"></span>'))
        });
      });
    } else {
      res.data.message && alert(res.data.message)
    }
  }).fail(function(){
    $("#appsrow").append('<div class="alert alert-danger"> <a href="#" class="close" data-dismiss="alert">&times;</a><strong>Github API Error</strong> Could not load apps list from repository. Might be a problem with Github. Have a look at <a href="https://status.github.com/">status.github.com</a> and try again later.</div>');
  });

  function li(title, url){
    var myli = $("li");
    $("<a>").attr("href", url).attr("target", "_blank").text(title).appendTo(myli);
    return myli;
  }
});
