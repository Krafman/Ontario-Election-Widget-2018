/*                                                                                                                                                  
*                  ,'+##+;,                  :######+                       #######:                       ,                      
*              ,##############.              :#######                       #######:                       #`                     
*            '##################:            :#######                       #######:                      ,##                     
*          :######################.          :#######                       #######:                      ###                     
*         #########################+         :#######                       #######:                     ,####                    
*       .############################        :#######                       #######:                     #####                    
*      :##############################`      :#######                       #######:                    ,######                   
*     ,###############++#############+       :#######                       #######:                    #######`                  
*    `###########+`        ,#########        :#######                       #######:                   ,########                  
*    ##########+             `#####+         :#######                       #######:                   #########`                 
*   +#########`                :##+          :#######                       #######:                    #########                 
*  `#########                   .#           :#######                       #######:                    ;########                 
*  #########                                 :#######                       #######:                     #########                
* `########                                  :#######                       #######:                     .########                
* ########,                                  :#######                       #######:                      #########               
* ########                                   :#######                       #######:      ;;;;;;;;;        :,,,,,,,`              
*,#######.                                   :#######                       #######:       #######                .#              
*+#######                                    :#######                       #######:       :#####'                ##`             
*#######+                                    :#######                       #######:        ###+#                ;#+#             
*#######.                                    :#######                       #######:        .###:                ####`            
*#######                                     :#######                       #######:         ###                +#####            
*#######                                     :#######                       #######:          #`                ######            
*#######                                     :#######                       #######:          +                ########           
*#######                                     :#######                       #######:                           '#######`          
*#######`                                    :#######                       #######:                            ########          
*#######,                                    :#######                       #######:                            :#######`         
*########                                    :#######                       #######:                             ########         
*########                                    :#######                       #######:                             `#######         
*.#######:                                   :#######                       #######:                              ########        
* ########                                   :#######                       #######:                               #######        
* ########'                                  :#######                       #######,        ,######       ,################       
* `########.                                 :#######                       #######.        #######'      #################`      
*  +######+#`                                :#######                      :#######        ,########     '+#################      
*  `#########`                  ;#           :#######                      ########        #########+    ###################`     
*   '#########;                +###          :#######                     +########       ,##########`  #####################     
*    ###########.            :######         :#######          #`        +########`       ############ `#####################     
*     ############'`      .+#+#######        :#######         ###+`    ,##########       ,############,#######################    
*     `###############################       :#######        ####################`       ########`                    ########    
*       ##############################       :#######       ####################'       ,########                     ,########   
*        ###########################+        :#######      #####################        ########`                      ########`  
*         '########################:         :#######     .###################+        ,########                       :########  
*          `######################           :#######      `#################'         ########`                        ########` 
*            `##################             :#######        +##############          ,########                         :######## 
*               ;############,               :#######          ;#########+`           ########`                          ######## 
*                   `.,,.`                   `,,,,,,,             `.,,`              `,,,,,,,,                           .,,,,,,,,
* Version 0.3.7                                                                                                                                                                  
*/
     

function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
}

function addSocial(candidate){
  box = $('#'+candidate.first_name+candidate.last_name);
  if ( candidate.email != null){box.append('<div class="contact-icon"><a href=mailto:"'+candidate.email+'" target="_blank"><i class="fas fa-envelope-square fa-2x"></i></a></div>');}
  if ( candidate.facebook != null){box.append('<div class="contact-icon"><a href="'+candidate.facebook+'" target="_blank"><i class="fab fa-facebook-square fa-2x"></i></a></div>');}
  if ( candidate.twitter != null){box.append('<div class="contact-icon"><a href="'+candidate.twitter+'" target="_blank"><i class="fab fa-twitter-square fa-2x"></i></a></div>');}
  if ( candidate.url != null){box.append('<div class="contact-icon"><a href="'+candidate.url+'" target="_blank"><i class="fas fa-globe fa-2x"></i></a></div>');}
}

//Use Restlet DB to get candidate info
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
        // console.log(candidate);
        if (candidate.first_name != null){
          $("#riding").append(
            '<div class="candidate">'
            +'<img class="candidate-image" src="' + ((candidate.image_url) ? (candidate.image_url) : "http://freevector.co/wp-content/uploads/2010/03/20279-dropping-vote-in-box1.png") +'" />'
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

function displayCandidates(){


}

// function getRidingFromGeo(autocomplete) {
//         // Get the place details from the autocomplete object.

//       }

//Use Location info to get riding
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

function findRiding_2(coordinates){
    var ans;
    $.ajax({
      url: ("https://represent.opennorth.ca/boundaries/ontario-electoral-districts-representation-act-2015/?contains=" + coordinates),
      dataType: 'jsonp',
      success: function( result ) {
        // console.log(result.objects[0].name);
        var lines_ans = result.objects[0].name
        var ans = lines_ans.replace(/\u2013|\u2014/g, "-");
        findCandidates(ans);
        // var bsets = result.boundaries_centroid;
        // $.each(bsets, function(i,v) {
        //   if (v.related.boundary_set_url == "/boundary-sets/ontario-electoral-districts-representation-act-2015/"){
        //     var lines_ans = (v.name);
        //     var ans = lines_ans.replace(/\u2013|\u2014/g, "-");
        //     $("#riding").append(ans + "<br/>");
        //     findCandidates(ans);            
        //   }
        // });
      }
    });
    // return ans
}


function initGeo(){

        var placeSearch, autocomplete;

      // function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        var location_input = document.getElementById('pac-input');
        var location_options = {componentRestrictions:{country: 'ca'}}; 
        autocomplete = new google.maps.places.Autocomplete(location_input, location_options);

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', function(){

        var place = autocomplete.getPlace();

        var coordinates = (place.geometry.location.lat() +"," + place.geometry.location.lng());
        // console.log(coordinates)

        findRiding_2(coordinates);



        });
      //}
}     

//DEPRECATED
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
