// ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// '''''''''+'':    .'+'+   '''''''   '''''+'+`''''''''''''''''
// ''''''''++'        ,'+   '''''''   '''''+', ''''''''''''''''
// ''''''''''     .    ++   '''''''   '''''''  .'''''''''''''''
// '''''''''   ;+'''' +++   '''''''   '+'+'''   '++''''''''''''
// ''''''+'`  ''''''+'+''   '''''''   '++'+'''  .'+''''''''''''
// '''''''+   '''''''''''   '''''''   '''  ''''' '+''''''''''''
// ''''''++  ;'''''''''''   '''''''   ''' .'''+'  +''''''''''''
// ''''''''  ''''''''''''   '''''''   '''+''''+'  '''''''''''''
// ''''''+'  ;+'+''''''''   ''''''+   '+''''''''` `''''''''''''
// ''''''''   ''+''''''''   '''''+'   ++'  `'+     +++'''''''''
// ''''''+'.  :''''''''''   '''''''   '';   +       '''''''''''
// ''''''''+   .'+''' '''   ''';'+'  .''    ,       '+'''''''''
// ''''''''++          '+   '';      ''+   ''+''''   ''''''''''
// ''''''''+''        ;''   '+      :+'   ''''''''`  +'''''''''
// '''''''''''+'`   ;'''+++''++:  `++''+''''''''''++'''''''''''
// '''''''''+''+++''+'+++'+'+++'+''++++++'+''''''++''''''''''''
// ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

// var db = new restdb("5af0a41a25a622ae4d528902");

function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
}

function addSocial(candidate){
  box = $('#'+candidate.first_name+candidate.last_name);
  if ( candidate.email != null){box.append('<div style="float:left; display:inline; border:solid; width:15%;"><a href="'+candidate.email+'"><i class="fas fa-envelope-square"></i></a></div>');}
  if ( candidate.facebook != null){box.append('<div style="float:left; display:inline; border:solid; width:15%;"><a href="'+candidate.facebook+'"><i class="fab fa-facebook-square"></i></a></div>');}
  if ( candidate.twitter != null){box.append('<div style="float:left; display:inline; border:solid; width:15%;"><a href="'+candidate.twitter+'"><i class="fab fa-twitter-square"></i></a></div>');}
  if ( candidate.url != null){box.append('<div style="float:left; display:inline; border:solid; width:15%;"><a href="'+candidate.url+'"><i class="fas fa-external-link-square-alt"></i></a></div>');}
}

function findCandidates(riding){
  $.ajax({
    type: "GET",
    url: "https://oeapi.restlet.net/v1/mAINs/?riding=" + riding,
    dataType: "json",
    beforeSend: function (xhr){
      xhr.setRequestHeader('Authorization', make_base_auth("0b016dbf-266e-4c29-802f-f4e943a31436", "42c144d7-a6ea-4a8d-9f7e-40f70bde2f6c"));
    },
    success: function( result) {
      $("#riding").empty();
      $.each(result, function(index,candidate) {
        console.log(candidate);
        if (candidate.first_name != null){
          $("#riding").append(
            '<div class="candidate" style="float:left; display:inline; border:solid; width:33%;">'
            +'<img width="30%"  class="candidate-image" src="' + candidate.image_url +'" />'
            +'<h3>' + candidate.first_name + ' ' + candidate.last_name +'</h3><h4>'+ candidate.party +'</h4>'
            +'<div id="' + candidate.first_name+candidate.last_name+ '" class="contact-options">'+'</div>'
            +'</div>'
          );
          addSocial(candidate);
        }
      });
    }
  });
}

function findRiding(postal){
    postal = document.getElementById('postal_code').value.toUpperCase().replace(/\s/g, '');
    var ans;
    $.ajax({
      url: ("https://represent.opennorth.ca/postcodes/" + postal +"/"),
      dataType: 'jsonp',
      success: function( result ) {
        var bsets = result.boundaries_centroid;
        $.each(bsets, function(i,v) {
          if (v.related.boundary_set_url == "/boundary-sets/ontario-electoral-districts-representation-act-2015/"){
            var lines_ans = (v.name);
            var ans = lines_ans.replace(/\u2013|\u2014/g, "-");
            $("#riding").append(ans + "<br/>");
            findCandidates(ans);            
          }
        });
      }
    });
    return ans
}

function findMPP() {
  postal = document.getElementById('postal_code').value.toUpperCase().replace(/\s/g, '');
  $.ajax({
    url: ("https://represent.opennorth.ca/postcodes/" + postal +"/"),
    dataType: 'jsonp',
    success: function( result ) {
      for (var key in result.representatives_centroid){
        if (result.representatives_centroid.hasOwnProperty(key)) {
          var ola = result.representatives_centroid[key].email.search("ola.org")
          if (ola >1) {mpp = result.representatives_centroid[key]}
        }
      }
      mpp_name = mpp.first_name + " " + mpp.last_name;
      mpp_photo = mpp.photo_url;
      mpp_email = mpp.email;
      mpp_phone = mpp.offices[0].tel;
      mpp_riding = mpp.district_name;
      console.log(mpp_phone)
      $( "#result" ).html( "<strong>" + mpp_name + " (" + mpp_riding + ")</strong>");
      $( "#mpp_info").html( "<strong>Phone Number: </strong>" +mpp_phone + "<br/>"
                            +"<strong>Email: </strong>" +mpp_email + "<br/>"

    );
      $( "#mpp_image").html('<img class="media-object" src="' + mpp_photo +'"/>');
    }
  });
};