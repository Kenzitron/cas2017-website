(function(){
    var $grid = undefined;
    var $remaining_votes = undefined;
    
    $( document ).ready(function() {
        $remaining_votes = parseInt($("#remaining_votes").val());
        /* Votaciones */        
        $("button.vote").click(function(event){            
            var talkId = $(event.target).attr("data-talk");
            var score = $(event.target).attr("data-score");
            var deltaVote = calculateDeltaRemainingvotes(event);
            $remaining_votes = $remaining_votes + deltaVote; 
             $(event.target).parent().attr("current-vote", score);  
            updateClassesAfterVote(event, $remaining_votes ); 
            updateTotalScoreOfTheTalk(event, deltaVote);           
            vote(talkId, score);
        });

        function calculateDeltaRemainingvotes(event){
            var oldScore = $(event.target).parent().children(".selected").attr("data-score");
            var newScore = $(event.target).attr("data-score");
           return parseInt(oldScore) - parseInt(newScore);
        }
      
        

        /* Isotope */
        $grid = $('.grid').isotope({
            // options
            itemSelector: '.grid-item',
            layoutMode: 'masonry'
        });      
    
        // filter items on button click
        $('.filter-button-group').on( 'click', 'button', function() {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
        });

        /* Descroptions */
        $(".speaker .read-more").on('click',showLargeDescription);
    });


    /* Helper functions */
    function vote(talkId, score){
        $.ajax({
            type: "POST",
            url:  '/api/paper/' + talkId +'/vote',
            data: {score: score}
        });
    }

    function updateClassesAfterVote(event, maxPointsAllowed){
        var classesNotAllowed = getClassStringVoteByMaxpointsAllowed(maxPointsAllowed);   
        $("button.vote").prop("disabled", false);
        $(classesNotAllowed).prop("disabled", true);
        $(event.target).parent().children(".selected").removeClass("selected");
        $(event.target).addClass("selected"); 
        AllowVotesUnderCurrentVote();       
    }

    function updateTotalScoreOfTheTalk(event, deltaVote){
        var talkItem = $(event.currentTarget).closest(".grid-item");
        var totalScoreItem = talkItem.find(".total-score");
        var currentTalkScore = parseInt(talkItem.attr('total-score'));
        var newTotalScore = currentTalkScore - deltaVote;        
        totalScoreItem.text(newTotalScore + " pts");
        talkItem.attr('total-score', newTotalScore);
    }   

    function AllowVotesUnderCurrentVote(){
        var votesContainers = $(".votes-container");
        $.each(votesContainers, function(index, voteContainer){
            var currentVote =  parseInt($(voteContainer).attr('current-vote')) || 0; 
            var classString = getClassStringElementUnderCurrentVote(currentVote);
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
        //shortDescription.slideUp();
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
