jQuery( document ).ready(function($) {

	/*Validate signup form*/
	$("#frm_provensec_signup").validate({
		rules:
		{
			provensec_name		:	"required",			
			provensec_email		:	{ required: true, email: true },	
			provensec_org 		:	{required:true },	
			provensec_add 		:  	{required:true ,minlength: 10 },
			provensec_city 		: 	{required:true ,minlength: 3},
			provensec_postcode 	:	{required:true,digits: true, rangelength: [2, 8] },
			provensec_country 	:	{required:true },
			captcha				:	{required:true },
		}
	});

	$( "#frm_provensec_signup" ).submit(function( event ) {
		  var selected_asets = $('#provensec_assets').val();
		  var asset_rows = $('.asset_row').length;
		  if(selected_asets==asset_rows)
		  {
		  	return true;
		  }
		  alert('Please add all '+selected_asets+' assets');
		  event.preventDefault();
		  return false;	  
	});


	
	function cal_paymeent()
	{
		var number_of_asset=  $('#provensec_assets').val();	
		var asset_price_daily  = $('#user_asset_price_daily').val();
		var asset_price_onetime  = $('#user_asset_price_onetime').val();
		var total_payment = number_of_asset * asset_price_daily;
		$('#provensec_total_payment').html('$'+total_payment.toFixed(2));
	}
	
	//cal_paymeent() ;

	function append_asset () {		
		var asset_row = '<div class="asset_row"><input type="text" name="asset_name[]" placeholder="Asset name" required/><input type="text" name="asset_host[]" placeholder="Asset IP" required/><select name="asset_type[]" id="asset_type[]" required><option value="">Select Asset Type</option><option value="1">Infrastructure device IP</option><option value="2">HTTPS enabled server</option><option value="3">HTTP only server</option></select><select name="scan_type[]" id="scan_type[]" class="scan_type" required><option value="">Select Scan Type</option><option value="once">One time scan</option><option value="daily">Daily Scan</option></select></div>';
		$('#assets_section').html('') ;
		for ( var i = 0; i < $('#provensec_assets').val(); i++ ) {
			$('#assets_section').append(asset_row);
		};
	}
	
	$('#provensec_assets').on('change', function() {
		//cal_paymeent();
	});

	$('.scan_type').live('change', function() {
		var payment_total = 0 ;
		var onetime_aset  = 0 ; 
		var daily_aset  = 0   ; 
		$('.scan_type').each(function(i, obj) {
	    	if($(this).val()=='once')
	    	{
	    		onetime_aset++ ;
	    	}
	    	else if ($(this).val()=='daily') {
	    		daily_aset++   ;
	    	}
		});
		var one_time_total =  $("#user_asset_price_onetime").val() * onetime_aset ;
		var daily_aset_total =  $("#user_asset_price_daily").val() * daily_aset   ;
		payment_total = one_time_total  +  daily_aset_total ;
		$('#provensec_total_payment').html('$'+payment_total.toFixed(2));	
	});

	//change CAPTCHA on each click or on refreshing page
    $("#reload").click(function() {
		$("#img").attr('src', $("#img").attr('src')+'?'+Math.random());
    });

    $('#add_asset').click(function() {
    	
    	var asset_row = '<div class="asset_row"><input type="text" name="asset_name[]" placeholder="Asset name" required/><input type="text" name="asset_host[]" placeholder="Asset IP" required/><select name="asset_type[]" id="asset_type[]" required><option value="">Select Asset Type</option><option value="1">Infrastructure device IP</option><option value="2">HTTPS enabled server</option><option value="3">HTTP only server</option></select><select name="subscription_type[]" id="subscription_type[]" class="scan_type" required><option value="">Select Subscription Type</option><option value="once">Once</option><option value="daily">Daily</option></select><span class="del_asset_row">×</span></div>' ;

    	if($('#provensec_assets').val() > $('.asset_row').length) 
    	{
    		$('#assets_section').append(asset_row) ;
    	}
    	else
    	{
    		alert('You cannot add assets greater than the selected amounts .') ;
    	}
    	
    	return false ;

    });


    $("#assets_section").on("click", ".del_asset_row", function() {

    	if (confirm("Are you sure to delete ?")) {
			$(this).parent('.asset_row').remove() ;
	    }

    });

	
});