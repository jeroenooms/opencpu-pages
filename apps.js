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
        $("<h3>").text(value.name).appendTo(mydiv);
        
        $('<a class="btn btn-default">').attr("target", "_blank").attr("href", "http://www.github.com/opencpu/" + value.name).text("Source").appendTo(mydiv);
        $('<a class="btn btn-default">').attr("target", "_blank").attr("href", "/ocpu/github/opencpu/" + value.name).text("Info").appendTo(mydiv);
        $('<a class="btn btn-default">').attr("target", "_blank").attr("href", "/ocpu/github/opencpu/" + value.name + "/www").text("Demo").appendTo(mydiv);
          
      });
    } else {
    	res.data.message && alert(res.data.message)
    }
  });
});