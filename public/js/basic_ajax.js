(function ($){
//this is AJAX build for reviews 

    var newReviewForm = $('#new-review-form'),
        newReviewRate = $('#new-review-rate'),
        newReviewInput = $('#new-review'),
        reviewsArea = $('#reviews-area');


    function bindEventsToReviews(newReview){
        newReview.find('.finishItem').on('click', function(event){
            event.preventDefault();
            var currentlink = $(this);
            var currentId = currentLink.data('id');

            var requestConfig = {
                method: 'POST',
                url:  currentId
            };

            $.ajax(requestConfig).then(function (responseMessage){
                var newElement = $(responseMessage);
                bindEventsToReviews(newElement);
                newReview.replaceWith(newElement);
            })
        })
    }

    reviewsArea.children().each(function (index, element) {
        bindEventsToReviews($(element));
    })

    newReviewForm.submit(function(event) {
        event.preventDefault();

        var newReview = newReviewInput.val();
        var newRate = newReviewRate.val();

        if (newReview){
            var requestConfig = {
                method: "POST",
                data: {
                    rating: newRate,
                    comment: newReview
                }
            };
        

            $.ajax(requestConfig).then(function (responseMessage){
                console.log(responseMessage);
                var newElement = $(responseMessage);
                bindEventsToReviews(newElement);
                reviewsArea.append(newElement);
            })
                
        }
    })    
})(jQuery);

