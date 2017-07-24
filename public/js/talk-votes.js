/* Evento votar de cada select */
$( document ).ready(function() {
    $('select').change(function(event){
        console.log(event);
        var talkId = $(event.currentTarget).attr('talk-id');
        var score = event.currentTarget.selectedIndex;
        vote(talkId, score);
    });

    // init Isotope
    var $grid = $('.grid').isotope({
        // options
        itemSelector: '.grid-item',
        layoutMode: 'masonry'
    });      
   
    // filter items on button click
    $('.filter-button-group').on( 'click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });
});





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