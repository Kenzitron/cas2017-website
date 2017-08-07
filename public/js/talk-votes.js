(function(){
    var $grid = undefined;
    var $remaining_votes = undefined;
    
    $( document ).ready(function() {      

         /* Votaciones */     
        $remaining_votes = parseInt($("#remaining_votes").val());

        $("button.vote").click(function(event){            
            var talkId = $(event.target).attr("data-talk");
            var score = $(event.target).attr("data-score");
            var deltaVote = calculateDeltaRemainingvotes(event);
            $remaining_votes = $remaining_votes + deltaVote; 
            $(event.target).parent().attr("current-vote", score);  
            updateClassesAfterVote(event, $remaining_votes); 
            updateTotalScoreOfTheTalk(event, deltaVote);     
            updateVotedByMeStatus(score);      
            updateRemainingVotes($remaining_votes);
            vote(talkId, score);
        });    
        

        /* Isotope */
        $grid = $('.grid').isotope({
            // options
            itemSelector: '.grid-item',
            layoutMode: 'masonry',
            getSortData: {
                time: function( itemElem ) { // function
                    var level = $( itemElem ).find('#format').text();
                    return level;                    
                }, // text from querySelector
                score: '[total-score]', // value of attribute
                level: function( itemElem ) { // function
                    var level = $( itemElem ).find('.level').text();
                    return level;                    
                }
            }
        });  
    
        // sort items on button click
        $('.sort-by-button-group').on( 'click', 'button', function(event) {            
            var sortByValue = $(this).attr('data-sort-by');
            var sortAscending = sortByValue !== 'score';
            $('.sort-by-button-group button').attr('is-checked', '');
            $(event.currentTarget).attr('is-checked','is-checked');
            $grid.isotope({ sortBy: sortByValue, sortAscending: sortAscending });
        });

        //Filters are combined. You need to save them
        var filters = {};
         // filter items on button click
        $('.filter-button-group').on( 'click', 'button', function(event) {           
            var filterValue = $(this).attr('data-filter');            
            $('.filter-button-group button').attr('is-checked', '');
            $(event.currentTarget).attr('is-checked','is-checked');
            filters['type'] = filterValue;
            combineFilters(filters, $grid);
            //$grid.isotope({ filter: filterValue });
        });

         // tags items on span click
        $('.filter-span-group').on( 'click', 'span', function(event) {           
            var filterValue = $(this).attr('data-filter');
            $('.filter-span-group span').attr('is-checked', '');
            $(event.currentTarget).attr('is-checked','is-checked');
            filters['tag'] = filterValue;
            combineFilters(filters, $grid);
            //$grid.isotope({ filter: filterValue });
        });

        /* Descriptions */
        $(".speaker .read-more").on('click',showLargeDescription);


        /* Login */
        $('#popup.login-container').click(function(event){
            event.stopPropagation()
        });

        $("#popup-background").click(function(){
            $("#popup-background").css("display", "none");
        })
        
        // aquí le pasamos la clase o id de nuestro div a centrar (en este caso "caja")
        $('#popup').css({
            position:'absolute',
            left: ($(window).width() - $('#popup').outerWidth())/2,
            top: ($(window).height() - $('#popup').outerHeight())/2 
        });

        $("#submit").click(function(){
            $( "#login" ).submit();
        })
       
           
        $('#login').submit(function(e){
            e.preventDefault();
            let validForm = true;
            $.each($(this).serializeArray(), function(i, field) {
                if (field.value === undefined || field.value === ''){
                    $('#popup.login-container').addClass('error');
                    validForm = false;
                }
            });

            if (validForm) {
                $.ajax({
                    url: $(this).attr('action'),
                    type: 'POST',
                    data: $(this).serialize(),
                    success: function (data) {
                        if (data.code === 0){
                            $('#popup.login-container').addClass('error');
                        }else{
                            $("#popup-background").css("display", "none");
                            location.reload();
                        }
                    }
                });
            }
            return false;
        });

        /* Mobile filters */
        $('#filter-mobile-toogler').on('click', function(event){
            openMobileFilters();
        });


        function openMobileFilters(){
            $('#filters-desktop-container').slideDown();
            $('#filter-mobile-toogler').addClass('opened');
            $('#filter-mobile-toogler').on('click', closeMobileFilters);
            $('#filter-mobile-toogler').off('click', openMobileFilters);
        }

        function closeMobileFilters(){
            $('#filters-desktop-container').slideUp(function(){
                $('#filter-mobile-toogler').removeClass('opened');
            });            
            $('#filter-mobile-toogler').on('click', openMobileFilters);
            $('#filter-mobile-toogler').off('click', closeMobileFilters);
        }
        
        /* Instructions modal for ipad less */
        if ($('#myModal') && $(window).width() <= 1024){
             $('#myModal').modal('show');
        }  

        /* Desktop slider */   
        if(!localStorage.getItem("no-more")){
            setTimeout(slideInMySlider, 1500);   
        }else{
             $('#mySliderDesktop').on('click', slideInMySlider);  
        }  
        
        
        /* no more info events */
        $('#no-more-slider').on('click', function(){
            slideInMySlider();
            setNoMoreInstructions();
        });
    });

    
    /* Helper functions */

    function slideOutMySlider(){
        if( $('#mySliderDesktop')){
            $('#mySliderDesktop').animate({
                'left': -600,
            });
            $('.hidden-button span').css( { transition: "transform 0.5s",
                  transform:  "rotate(0deg)" } );
            $('#mySliderDesktop').off('click', slideOutMySlider);
            $('#mySliderDesktop').on('click', slideInMySlider);
        }       
    }

    function slideInMySlider(){
        if( $('#mySliderDesktop')){
            $('#mySliderDesktop').animate({
                left: 0
            });
            $('.hidden-button span').css( { transition: "transform 0.5s",
                transform:  "rotate(180deg)" } );
            $('#mySliderDesktop').on('click', slideOutMySlider);
            $('#mySliderDesktop').off('click', slideInMySlider);
        }
    }

    function setNoMoreInstructions(){
        localStorage.setItem("no-more", true);
    }

    
    function vote(talkId, score){
        $.ajax({
            type: "POST",
            url:  '/api/paper/' + talkId +'/vote',
            data: {score: score}
        });
    }

    function combineFilters(filters, isotopeObject){
        var filterValue = concatValues( filters );
        isotopeObject.isotope({ filter: filterValue });
    }

    // flatten object by concatting values
    function concatValues( obj ) {
        var value = '';
        for ( var prop in obj ) {
            value += obj[ prop ];
        }
        return value;
    }


    function calculateDeltaRemainingvotes(event){
        var oldScore = $(event.target).parent().children(".selected").attr("data-score");
        var newScore = $(event.target).attr("data-score");
        return parseInt(oldScore) - parseInt(newScore);
    }      

    function updateClassesAfterVote(event, remainingVotes){
        var classesNotAllowed = getClassStringVoteByMaxpointsAllowed(remainingVotes);   
        $("button.vote").prop("disabled", false);
        $(classesNotAllowed).prop("disabled", true);
        $(event.target).parent().children(".selected").removeClass("selected");
        $(event.target).addClass("selected"); 
        FixVotesAllowedCurrentVote(remainingVotes);       
    }

    function updateVotedByMeStatus(score){
        var talkItem = $(event.currentTarget).closest('.grid-item');
        if(parseInt(score) === 0){
            talkItem.removeClass('voted-by-me');
        }else{
            talkItem.addClass('voted-by-me');
        }
    }

    function updateTotalScoreOfTheTalk(event, deltaVote){
        var talkItem = $(event.currentTarget).closest(".grid-item");
        var totalScoreItem = talkItem.find(".total-score");
        var currentTalkScore = parseInt(talkItem.attr('total-score'));
        var newTotalScore = currentTalkScore - deltaVote;        
        totalScoreItem.text(newTotalScore + " pts");
        talkItem.attr('total-score', newTotalScore);
    }
    
    function updateRemainingVotes(remainingVotes){
        $("#my-remaining-votes").text(remainingVotes);
    }

    /* 
     * Las votaciones bajo el valor actual, o la suma de la votación actual
     * más los puntos restantes deben permitirse 
     */
    function FixVotesAllowedCurrentVote(remainingVotes){
        var votesContainers = $(".votes-container");
        $.each(votesContainers, function(index, voteContainer){
            var currentVote =  parseInt($(voteContainer).attr('current-vote')) || 0; 
            var classString = getClassStringElementUnderCurrentVote(currentVote); 
            classString += ',';
            classString += getClassStringElementAboveCurrentVote(currentVote, remainingVotes);  
            $(voteContainer).children(classString).prop("disabled", false);
        })
    }

    function getClassStringElementUnderCurrentVote(currentVote){
        var classString = '';
        for(var i = 1; i <= currentVote -1; i++ ){
            classString += '.' + i + '-ptos,';
        }
        classString += '.' + currentVote + '-ptos';
        return classString;
    }

    function getClassStringElementAboveCurrentVote(currentVote, remainingVotes){
        var classString = '';
        var topLimit = currentVote + remainingVotes;
        for(var i = currentVote; i <= topLimit; i++ ){
            classString += '.' + i + '-ptos,';
        }        
        classString += topLimit + '-ptos';
        return classString;
    }
   

    function getClassStringVoteByMaxpointsAllowed(maxPointsAllowed){
        var classString = "";
        for(var i = maxPointsAllowed + 1; i < 11; i++){
            classString += "." + i + "-ptos,";
        }
        classString += ".12-ptos"
        return classString;
    }    

    

    function showLargeDescription(event){
        var readMoreLink = $(event.currentTarget);
        var largeDescription = $(event.currentTarget).parent().children("#large-description");
        readMoreLink.text("menos info");
        largeDescription.slideDown(function(){
            $grid.isotope();
            readMoreLink.off('click', showLargeDescription);
            readMoreLink.on('click', hideLargeDescription);
        });
    }
    
    function hideLargeDescription(event){
        var readMoreLink = $(event.currentTarget);
        var largeDescription = $(event.currentTarget).parent().children("#large-description");
        
        readMoreLink.text("más info");
        largeDescription.slideUp(function(){
            $grid.isotope();
            readMoreLink.off('click', hideLargeDescription);
            readMoreLink.on('click', showLargeDescription);           
        });
    }


})();



function showLogin(){
    // aquí le pasamos la clase o id de nuestro div a centrar (en este caso "caja")
    $('#popup').css({
        position:'absolute',
        left: ($(window).width() - $('#popup').outerWidth())/2,
        top: ($(window).height() - $('#popup').outerHeight())/2 
    });
    $("#popup-background").css("display", "block");
    return false;
}
