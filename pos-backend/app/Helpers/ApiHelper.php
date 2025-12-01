<?php

namespace App\Helpers;

class ApiHelper
{
   
    public static function success($data = null, string $message = 'Success', int $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    public static function error(string $message, $errors = null, int $status = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $status);
    }

    public static function validation($errors, string $message = 'Validation failed', int $status = 422)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $status);
    }

    public static function api_response($type, $data = null, $message = 'Success', $status = 200)
    {
        switch ($type) {
            case 'success':
                return self::success($data, $message, $status);

            case 'error':
                return self::error($message, $data, $status);

            case 'validation':
                return self::validation($data, $message, $status);

            default:
                return self::success($data, $message, $status);
        }
    }
    
}
