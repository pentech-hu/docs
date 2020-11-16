<?php
    function _log($name, $value){
        echo str_pad($name, 20, " ", STR_PAD_LEFT) . ": " . $value . "\n";
    }
    $algorithm = 'aes-256-cbc';
    $encryption_key = bin2hex(random_bytes(16));

    _log('ALGORITHM', $algorithm);
    _log('KEY', $encryption_key);

    echo str_repeat('–', 60) . "\n";

    $data = [
        'session' => '93b4',
        'user' => '9542'
    ];

    function encrypt($input, $algorithm, $encryption_key) {
        // openssl_random_pseudo_bytes generates chars invalid to be used in URL, so we use random_bytes as it also generates cryptographically secure pseudo-random bytes
        $initialisation_vector = bin2hex(random_bytes(openssl_cipher_iv_length($algorithm) / 2));
        return openssl_encrypt($input, $algorithm, $encryption_key, 0, $initialisation_vector) . ':' . $initialisation_vector;
    };

    function decrypt($encrypted, $algorithm, $encryption_key) {
        list($encoded, $initialisation_vector) = explode(':' , $encrypted, 2);
        // _log('encoded part', $encoded);
        // _log('iv', $initialisation_vector);
        return openssl_decrypt($encoded, $algorithm, $encryption_key, 0, $initialisation_vector);
    };

    $original_json = json_encode($data);
    _log('original JSON', $original_json);

    $encrypted = encrypt($original_json, $algorithm, $encryption_key);
    _log('encrypted', $encrypted);

    $url_encoded = rawurlencode($encrypted);
    _log('url encoded', $url_encoded);

    $url_decoded = rawurldecode($url_encoded);
    _log('url decoded', $url_decoded);

    $decrypted = decrypt($url_decoded, $algorithm, $encryption_key);
    _log('decoded JSON', $decrypted);

    $decrypted_data = json_decode($decrypted);
    echo 'Finished.';
