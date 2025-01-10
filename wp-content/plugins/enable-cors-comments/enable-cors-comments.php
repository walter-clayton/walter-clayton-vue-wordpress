<?php
/*
Plugin Name: Enable CORS for Comments
Description: Enables CORS headers for comment submission
Version: 1.0
Author: Walter Clayton
*/

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = get_http_origin();
        if ($origin) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        }
        return $value;
    });
}, 15);
