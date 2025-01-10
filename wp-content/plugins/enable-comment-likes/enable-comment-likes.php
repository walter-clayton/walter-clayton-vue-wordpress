<?php
/*
Plugin Name: Enable Comment Likes
Description: Adds like functionality to comments
Version: 1.0
Author: Walter Clayton
*/

// Make sure we're running within WordPress
if (!defined('ABSPATH')) {
    exit;
}

// Include WordPress core files if needed
require_once(ABSPATH . 'wp-admin/includes/plugin.php');
require_once(ABSPATH . 'wp-includes/rest-api.php');

// Add likes meta field to comments
add_action('init', function () {
    register_meta('comment', 'likes_count', [
        'type' => 'integer',
        'single' => true,
        'show_in_rest' => true,
        'default' => 0,
        'auth_callback' => function () {
            return true; // Allow anyone to update like count
        }
    ]);
});

// Register REST API endpoints for likes
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/comments/(?P<id>\d+)/like', [
        'methods' => 'POST',
        'callback' => 'handle_comment_like',
        'permission_callback' => '__return_true',
        'args' => [
            'id' => [
                'validate_callback' => function ($param) {
                    return is_numeric($param);
                }
            ]
        ]
    ]);
});

function handle_comment_like($request)
{
    $comment_id = $request['id'];

    // Verify comment exists
    $comment = get_comment($comment_id);
    if (!$comment) {
        return new WP_Error(
            'comment_not_found',
            'Comment not found',
            ['status' => 404]
        );
    }

    // Get current likes count
    $likes = (int)get_comment_meta($comment_id, 'likes_count', true);
    $likes++;

    // Update likes count
    $updated = update_comment_meta($comment_id, 'likes_count', $likes);

    if ($updated) {
        return new WP_REST_Response([
            'likes_count' => $likes,
            'comment_id' => $comment_id
        ], 200);
    }

    return new WP_Error(
        'update_failed',
        'Failed to update likes count',
        ['status' => 500]
    );
}

// Add likes count to comment response
add_filter('rest_prepare_comment', function ($response, $comment, $request) {
    $likes = (int)get_comment_meta($comment->comment_ID, 'likes_count', true);
    $response->data['meta'] = [
        'likes_count' => $likes
    ];
    return $response;
}, 10, 3);

// Add this near the top of your plugin file
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
