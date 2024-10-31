<?php
require_once('ipn.class.php') ;
global $wpdb ;
$setting =  get_option('provensec_setting') ;
$api_key =  $setting['api_key']		;
$user_name =  $setting['user_name'] ;
$user_id = '';
if( isset($_POST['custom']) && $_POST['custom'] > 0 )
{
	$user_id = $_POST['custom'] 	;
}
elseif( isset($_SESSION['userid']) && $_SESSION['userid'] > 0 )
{
	$user_id =  $_SESSION['userid'] ;
}
if(!empty($user_id))
{
	$headers = array() ;

	$headers[] = 'From: '.get_bloginfo('name').' <'.ADMIN_EMAIL.'>' ;

	$data = $_POST ;
					
	$listener = new IpnListener() ;

	$listener->use_sandbox = ENABLE_SANDBOX ;

	try {
		$listener->requirePostMethod() ;
		$verified = $listener->processIpn($data) ;

	} catch (Exception $e) {
	    $error = $e->getMessage() ;
        mail(ADMIN_EMAIL, 'Invalid IPN error', $error) ;
	}
	
	$table_name = $wpdb->prefix . 'provensec_users' ;

	$user_data = $wpdb->get_row("SELECT * FROM $table_name WHERE id = $user_id " ) ;


	if ($verified && !empty($user_data) ) {

		$wpdb->update( $table_name , array( 'status' => 1 , 'payment_date' => date('Y-m-d H:i:s')) , array( 'id' => $_POST['custom'] )
		) ;
		
		/*$subject = __('New user registered on '.get_bloginfo('name') , 'provensec') ;
		$message = 'Hello admin, </br> New user registered on '.get_bloginfo('name').'. You can check details from admin dashboard.' ;
		wp_mail(ADMIN_EMAIL, $subject, $message, $headers ) ;*/

		$assets_data = array() ;
		if(!empty($user_data->assets_data))
		{
			$assets_data = json_decode($user_data->assets_data) ;
		}

		$post_array = array(
			'name' => $user_data->name   ,
			'email' => $user_data->email ,
			'organization_name' => $user_data->org_name ,
			'asset' => $user_data->number_asset ,
			'assets' => $assets_data 		 ,
			'address' => $user_data->address ,
			'postcode'=>$user_data->postcode ,
			'city' =>$user_data->city 		 ,
			'country' =>$user_data->country  
		) ;

		$post_array =  http_build_query($post_array) ;
		$url = PROVENSEC_SERVICES."register/" ;
		$ch = curl_init(); 
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1) ;
		curl_setopt($ch, CURLOPT_HTTPHEADER,array('Authorization: TRUEREST username='.
			$user_name.'&apikey='.$api_key )) ;
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post_array) ;
		$output = curl_exec($ch) ;
		$info = curl_getinfo($ch);
		curl_close($ch)			 ;

	}
	else
	{
		wp_mail(ADMIN_EMAIL,'Invalid IPN error','Invalid IPN error', $headers );
	}
}
else
{
	echo 'Invalid Access !';
}