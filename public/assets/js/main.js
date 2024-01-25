$(function() {
    $(document).on("click", "[data-toggle=modal][data-target]", function(){
        $($(this).attr("data-target")).modal("show")
    });
    $(document).on("click", "[data-dismiss=modal]", function(){
        $(this).closest(".modal").modal("hide")
    });


	// LEFT MENU
    $(document).on("click", ".menuArrow", function(e){
        e.preventDefault();
        e.stopPropagation();

        var li = $(this).closest('li')
        
        if(li.hasClass("opened")) li.removeClass("opened");
        else li.addClass("opened");
    });


    // Navigation Bar
    $(document).on("mouseenter", "#headerNavBarBlocks", function(){
        $("#MenuUser").attr("src", "/images/MenuUserLight.svg");
    });
    $(document).on("mouseleave", "#headerNavBarBlocks", function(){
        $("#MenuUser").attr("src", "/images/MenuUser.svg");
    });
	
	
	// ======================== SCROLL ======================== //
	$(window).on('scroll', function () {
		
	});
	
	
	// ======================== RESIZE ======================== //
	$(window).on('resize', function () {
		
	});
})