(function(){
    console.log("HOLA");
    var $grid = undefined;
    /* Evento votar de cada select */
    $( document ).ready(function() {
        $('select').change(function(event){
            console.log(event);
            var talkId = $(event.currentTarget).attr('talk-id');
            var score = event.currentTarget.selectedIndex;
            vote(talkId, score);
        });

        // init Isotope
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

        //show and hiden descriptions when the user click "read more" or "read less"
        $(".speaker .read-more").on('click',showLargeDescription);
    });


    function showLargeDescription(event){
        console.log('showLargeDescription');
        var readMoreLink = $(event.currentTarget);
        var largeDescription = $(event.currentTarget).parent().children("#large-description");
        //shortDescription.slideUp();
        readMoreLink.text("menos info");
        largeDescription.slideDown(function(){
            $grid.isotope();
            readMoreLink.off('click', showLargeDescription);
            readMoreLink.on('click', hideShortDescription);
        });
    }
    
    function hideShortDescription(event){
        console.log('showShortDescription');
        var readMoreLink = $(event.currentTarget);
        var largeDescription = $(event.currentTarget).parent().children("#large-description");
        
        readMoreLink.text("más info");
        largeDescription.slideUp(function(){
            $grid.isotope();
            readMoreLink.off('click', hideShortDescription);
            readMoreLink.on('click', showLargeDescription);           
        });
    }



    function vote(talkId, score){
        console.log(talkId, score);
        $.ajax({
            type: "POST",
            url:  '/api/paper/' + talkId +'/vote',
            data: {score: score},
            success: success
        });

        function success(response){
        console.log(response);
        }
    }
})();
