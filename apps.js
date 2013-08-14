$(function(){
  $.ajax({
    url: "https://api.github.com/orgs/opencpu/repos",
    dataType: "jsonp"
  }).done(function(res){
    $.each(res.data, function(index, value) {
      var coldiv = $('<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6">').css("margin-left", "auto").css("margin-right", "auto")
         .appendTo("#appsrow");
      var mydiv = $('<div>').width(200).css("margin-left", "auto").css("margin-right", "auto")
         .appendTo(coldiv);
      var myimg = $('<img class="img img-rounded">').width(100).height(100)
         .attr("src", "https://raw.github.com/opencpu/" + value.name + "/master/inst/icon.png")
         .appendTo(mydiv).on("error", function(){
            myimg.attr("src", value.owner.avatar_url);
         });
      var myul = $('<ul class="nav nav-tabs nav-stacked">')
         .appendTo(mydiv);
      $('<li>').text("Source code").appendTo(myul);
      $('<li>').text("Package Info").appendTo(myul);
      $('<li>').text("Live Demo").appendTo(myul);
      $('<li><a href="#">Profile</a></li>').appendTo(myul)
    });
  });
});