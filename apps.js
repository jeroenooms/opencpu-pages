$(function(){
  $.ajax({
    url: "https://api.github.com/orgs/opencpu/repos",
    dataType: "jsonp"
  }).done(function(res){
    if(res.meta.status == 200){
      $.each(res.data, function(index, value) {
        var mydiv = $('<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6">')
           .css("text-align", "center")
           .appendTo("#appsrow");
        var myimg = $('<img class="appicon img img-rounded">').width(100).height(100)
           .attr("src", "https://raw.github.com/opencpu/" + value.name + "/master/inst/icon.png")
           .appendTo(mydiv).on("error", function(){
              myimg.attr("src", value.owner.avatar_url);
           });
        
        var mybr = $("<br />").appendTo(mydiv);
        var btngrp = $('<div class="btn-group">').appendTo(mydiv);
        var appbtn = $('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">').text(value.name + " ").appendTo(btngrp);
        var appurl;
       
        $.ajax({
          url: "/ocpu/library/" + value.name
        }).done(function(){
          appurl = "/ocpu/library/" + value.name;
        }).error(function(){
          appurl = "/ocpu/github/opencpu/" + value.name;       
        }).always(function(){
           var myul = $('<ul class="dropdown-menu" role="menu">').appendTo(btngrp);
           myul.append('<li><a target="_blank" href="' + appurl + '/"><i class="icon icon-info-sign"> Package Info </a></li>');
           myul.append('<li><a target="_blank" href="' + appurl + '/www/"><i class="icon icon-play"> Live App Demo </a></li>'); 
           myul.append('<li class="divider"></li>');
           myul.append('<li><a target="_blank" href="http://www.github.com/opencpu/' + value.name + '"><i class="icon icon-github"> Source Code </a></li>');           
           appbtn.append($('<span class="caret"></span>'))
        });          
      });
    } else {
      res.data.message && alert(res.data.message)
    }
  });
  
  function li(title, url){
    var myli = $("li");
    $("<a>").attr("href", url).attr("target", "_blank").text(title).appendTo(myli);
    return myli;
  }
});
